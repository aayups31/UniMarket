'use client';

import Image from 'next/image';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CheckCircle2, GripVertical, ImagePlus, Loader2, RotateCcw, Trash2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import {
  finalizeListingImageAction,
  registerListingImageAction,
  removeListingImageAction,
  reorderListingImagesAction,
  reverifyListingImagesAction,
} from '../actions';
import { LISTING_IMAGE_MAX_BYTES, LISTING_IMAGE_MAX_COUNT } from '../schemas';
import { compressImageFile } from './imageCompression';

export type ComposerImage = {
  id: string;
  url: string;
  path: string;
  progress: number;
  status: 'uploading' | 'uploaded' | 'failed';
  name: string;
  focusPosition?: string;
};

function toObjectPositionValue(value?: string) {
  if (!value) return '50% 35%';
  if (value.startsWith('object-[') && value.includes('_')) {
    const match = value.match(/object-\[(\d+)%_(\d+)%\]/);
    if (match) {
      return `${match[1]}% ${match[2]}%`;
    }
  }
  if (value.startsWith('object-position:')) {
    return value.replace('object-position:', '').trim();
  }
  return value;
}

type ImageUploaderProps = {
  listingId: string | null;
  initialImages?: ComposerImage[];
  ensureDraft: () => Promise<string | null>;
  onImagesChange?: (images: ComposerImage[]) => void;
};

const ACCEPTED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

export function ImageUploader({
  listingId,
  initialImages = [],
  ensureDraft,
  onImagesChange,
}: ImageUploaderProps) {
  const [images, setImages] = useState(initialImages);
  const [message, setMessage] = useState('');
  const [bannerMessage, setBannerMessage] = useState<string | null>(null);
  const [isDraggingFiles, setIsDraggingFiles] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const cancelledUploadsRef = useRef(new Set<string>());
  const imagesRef = useRef(images);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  useEffect(() => {
    imagesRef.current = images;
    onImagesChange?.(images);
  }, [images, onImagesChange]);

  useEffect(
    () => () => {
      imagesRef.current.forEach((image) => {
        if (image.url.startsWith('blob:')) URL.revokeObjectURL(image.url);
      });
    },
    [],
  );

  // On mount, try to reconcile any pending uploads for this listing.
  useEffect(() => {
    if (!listingId) return;
    let mounted = true;
    void (async () => {
      try {
        const result = await reverifyListingImagesAction({ listingId });
        if (!mounted) return;
        if (result.ok && result.data.updated.length > 0) {
          setImages((current) =>
            current.map((img) =>
              result.data.updated.includes(img.id)
                ? { ...img, status: 'uploaded', progress: 100 }
                : img,
            ),
          );
          setMessage(
            `Recovered ${result.data.updated.length} uploaded photo${result.data.updated.length > 1 ? 's' : ''}.`,
          );
        }
      } catch {
        // ignore
      }
    })();
    return () => {
      mounted = false;
    };
  }, [listingId]);

  const uploadFiles = useCallback(
    async (selected: File[]) => {
      setMessage('');
      const available = LISTING_IMAGE_MAX_COUNT - images.length;
      const files = selected.slice(0, available);
      const supportedFiles: File[] = [];
      let validationMessage = '';
      let compressedCount = 0;

      if (selected.length > available) {
        validationMessage = `You can add ${available} more image${available === 1 ? '' : 's'}.`;
      }
      if (files.length === 0) {
        if (validationMessage) setMessage(validationMessage);
        return;
      }

      for (const file of files) {
        let preparedFile: File;
        try {
          preparedFile = await compressImageFile(file);
        } catch {
          // Likely an unsupported encode/decoding error (e.g. HEIC). Show a clear banner.
          setBannerMessage(
            `${file.name} could not be prepared. If this is an iPhone photo, choose "Most Compatible" in Camera settings or export as JPEG/PNG before uploading.`,
          );
          continue;
        }

        if (preparedFile.size < file.size) compressedCount += 1;

        if (!ACCEPTED_TYPES.has(preparedFile.type)) {
          setBannerMessage(
            `${file.name} is in an unsupported format (${preparedFile.type}). Use JPEG, PNG, or WebP.`,
          );
          continue;
        }
        if (preparedFile.size > LISTING_IMAGE_MAX_BYTES) {
          validationMessage = `${file.name} is larger than 5 MB.`;
          continue;
        }
        supportedFiles.push(preparedFile);
      }

      if (validationMessage) setMessage(validationMessage);
      if (compressedCount > 0 && !validationMessage) {
        setMessage(
          `We reduced ${compressedCount} large photo${compressedCount === 1 ? '' : 's'} to keep the upload reliable.`,
        );
      }
      if (supportedFiles.length === 0) return;

      const draftId = listingId ?? (await ensureDraft());
      if (!draftId) {
        setMessage('Save the draft before adding images.');
        return;
      }

      for (const file of supportedFiles) {
        try {
          const dimensions = await getImageDimensions(file);
          const registration = await registerListingImageAction({
            listingId: draftId,
            name: file.name,
            mimeType: file.type,
            sizeBytes: file.size,
            ...dimensions,
          });
          if (!registration.ok) {
            setMessage(registration.message);
            continue;
          }

          const item: ComposerImage = {
            id: registration.data.id,
            path: registration.data.path,
            url: URL.createObjectURL(file),
            progress: 0,
            status: 'uploading',
            name: file.name,
            focusPosition: '50% 35%',
          };
          setImages((current) => [...current, item]);
          await uploadListingImage(file, draftId, item, setImages, cancelledUploadsRef, setMessage);
        } catch {
          setBannerMessage(
            `${file.name} could not be prepared. Check your connection or try a different image.`,
          );
        }
      }
    },
    [ensureDraft, images.length, listingId],
  );

  const handleDragEnd = async ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    const currentImages = imagesRef.current;
    const oldIndex = currentImages.findIndex((image) => image.id === active.id);
    const newIndex = currentImages.findIndex((image) => image.id === over.id);
    const previousOrder = currentImages.map((image) => image.id);
    const next = arrayMove(currentImages, oldIndex, newIndex);
    setImages(next);
    const draftId = listingId ?? (await ensureDraft());
    if (!draftId) {
      setImages((current) => restoreImageOrder(current, previousOrder));
      return;
    }

    // If some images failed to upload, exclude them from the server-side reorder
    // so the RPC only sees valid image rows. The local order still includes
    // failed placeholders so users can remove or retry them.
    const imageIdsToSave = next.filter((img) => img.status !== 'failed').map((image) => image.id);
    try {
      const result = await reorderListingImagesAction({
        listingId: draftId,
        imageIds: imageIdsToSave,
      });
      if (!result.ok) {
        setImages((current) => restoreImageOrder(current, previousOrder));
        setMessage(`${result.message} Your previous order was restored.`);
      }
    } catch {
      setImages((current) => restoreImageOrder(current, previousOrder));
      setMessage('The image order could not be saved. Your previous order was restored.');
    }
  };

  // Drag-and-drop reordering handled via dnd-kit; arrow/cover/crop controls removed.

  const removeImage = async (image: ComposerImage) => {
    cancelledUploadsRef.current.add(image.id);
    const draftId = listingId ?? (await ensureDraft());
    if (!draftId) return;
    try {
      const result = await removeListingImageAction({ listingId: draftId, imageId: image.id });
      if (!result.ok) {
        cancelledUploadsRef.current.delete(image.id);
        setImages((current) =>
          current.map((item) =>
            item.id === image.id && item.status === 'uploading'
              ? { ...item, status: 'failed' }
              : item,
          ),
        );
        setMessage(result.message);
        return;
      }
      if (image.url.startsWith('blob:')) URL.revokeObjectURL(image.url);
      setImages((current) => current.filter((item) => item.id !== image.id));
    } catch {
      cancelledUploadsRef.current.delete(image.id);
      setImages((current) =>
        current.map((item) =>
          item.id === image.id && item.status === 'uploading'
            ? { ...item, status: 'failed' }
            : item,
        ),
      );
      setMessage('The image could not be removed. Check your connection and try again.');
    }
  };

  const uploadedCount = useMemo(
    () => images.filter((image) => image.status === 'uploaded').length,
    [images],
  );
  const failedCount = useMemo(
    () => images.filter((image) => image.status === 'failed').length,
    [images],
  );
  const isWaitingForUpload = images.some((image) => image.status === 'uploading');
  const uploadHelp = message
    ? message
    : failedCount > 0
      ? `${failedCount} photo${failedCount === 1 ? ' needs' : 's need'} attention. Remove the failed photo${failedCount === 1 ? '' : 's'} before publishing.`
      : isWaitingForUpload
        ? 'Finishing your photo upload… keep this page open until it is ready.'
        : 'JPEG, PNG, or WebP · up to 5 MB each · drag to reorder · the first photo is the cover';
  return (
    <section id="images" aria-labelledby="images-heading" className="scroll-mt-32 pb-12 sm:pb-14">
      <div className="mb-6 grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
        <div className="border-l-2 border-um-gold-500 pl-4">
          <p className="font-condensed text-xs font-bold uppercase tracking-[0.15em] text-um-gold-700">
            Add photos
          </p>
          <h2
            id="images-heading"
            className="mt-1.5 text-2xl font-bold tracking-[-0.035em] text-um-text-strong"
          >
            Make the item easy to understand
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-um-text-muted">
            Show it clearly from a few angles. The first photo becomes the cover.
          </p>
        </div>
        <span
          aria-atomic="true"
          aria-live="polite"
          className={cn(
            'inline-flex h-8 w-fit shrink-0 items-center gap-1.5 border-l-2 px-3 text-xs font-semibold tabular-nums sm:mt-1',
            failedCount > 0
              ? 'border-red-400 bg-red-400/[0.10] text-red-200'
              : 'border-um-gold-400 bg-white/[0.06] text-um-text-muted',
          )}
          role="status"
        >
          {failedCount > 0 ? (
            <RotateCcw aria-hidden="true" className="size-3.5" />
          ) : uploadedCount > 0 ? (
            <CheckCircle2 aria-hidden="true" className="size-3.5 text-um-success" />
          ) : null}
          {failedCount > 0
            ? `${failedCount} needs attention`
            : `${uploadedCount} / ${LISTING_IMAGE_MAX_COUNT} ready`}
        </span>
      </div>

      {bannerMessage ? (
        <div className="mb-4 rounded-um-sm border border-red-500/30 bg-red-600/95 p-3 text-sm font-semibold text-white">
          <div className="flex items-start justify-between gap-3">
            <div>{bannerMessage}</div>
            <button
              type="button"
              onClick={() => setBannerMessage(null)}
              className="ml-4 rounded bg-white/10 px-2 py-1 text-xs font-medium text-white/90"
            >
              Dismiss
            </button>
          </div>
        </div>
      ) : null}

      {/* crop modal removed — simplified UX: keep item centered when uploading */}

      <div
        onDragEnter={(event) => {
          event.preventDefault();
          setIsDraggingFiles(true);
        }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null))
            setIsDraggingFiles(false);
        }}
        onDrop={(event) => {
          event.preventDefault();
          setIsDraggingFiles(false);
          void uploadFiles(Array.from(event.dataTransfer.files));
        }}
        className={cn(
          'relative overflow-hidden rounded-um-md border border-dashed border-white/[0.22] bg-um-ink-950 p-3 text-white shadow-[0_20px_55px_rgba(8,12,19,0.28)] transition duration-160 ease-um-out sm:p-5',
          isDraggingFiles && 'border-um-gold-400 bg-um-ink-850 shadow-um-gold',
        )}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 -top-28 size-96 rounded-full bg-um-gold-400/[0.07] blur-[88px]"
        />
        {images.length === 0 ? (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="relative flex min-h-72 w-full flex-col items-center justify-center px-5 text-center outline-none transition duration-160 ease-um-out hover:bg-white/[0.04] focus-visible:ring-2 focus-visible:ring-um-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-um-ink-900"
          >
            <span className="grid size-14 place-items-center border border-white/10 bg-white/[0.06] text-um-gold-400 shadow-um-sm">
              <ImagePlus aria-hidden="true" className="size-6" strokeWidth={1.8} />
            </span>
            <span className="mt-5 text-lg font-bold tracking-[-0.02em] text-white">
              Drop your photos here
            </span>
            <span className="mt-1.5 text-sm text-white/52">or choose them from your device</span>
            <span className="mt-5 inline-flex min-h-11 items-center rounded-um-sm bg-um-gold-400 px-4 text-sm font-bold text-um-ink-950 shadow-um-xs">
              Choose photos
            </span>
          </button>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={images.map((image) => image.id)} strategy={rectSortingStrategy}>
              <div className="relative grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3">
                {images.map((image, index) => (
                  <SortableImage
                    key={image.id}
                    image={image}
                    index={index}
                    onRemove={removeImage}
                  />
                ))}
                {images.length < LISTING_IMAGE_MAX_COUNT ? (
                  <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="flex aspect-[4/3] min-h-28 flex-col items-center justify-center rounded-um-sm border border-dashed border-white/20 bg-white/[0.05] text-sm font-bold text-white/55 transition duration-160 ease-um-out hover:border-um-gold-400 hover:text-white focus-visible:ring-2 focus-visible:ring-um-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-um-ink-900"
                  >
                    <ImagePlus aria-hidden="true" className="mb-2 size-5" strokeWidth={1.8} />
                    Add photos
                  </button>
                ) : null}
              </div>
            </SortableContext>
          </DndContext>
        )}

        <input
          ref={inputRef}
          aria-describedby="image-upload-help"
          aria-label="Upload listing photos"
          className="sr-only"
          accept="image/*"
          multiple
          onChange={(event) => {
            void uploadFiles(Array.from(event.target.files ?? []));
            event.target.value = '';
          }}
          tabIndex={-1}
          type="file"
        />
      </div>
      <p
        aria-live="polite"
        className={cn(
          'mt-3 min-h-5 text-sm leading-5',
          message || failedCount > 0 ? 'font-medium text-red-200' : 'text-um-text-muted',
        )}
        id="image-upload-help"
      >
        {uploadHelp}
      </p>
    </section>
  );
}

function SortableImage({
  image,
  index,
  onRemove,
}: {
  image: ComposerImage;
  index: number;
  onRemove: (image: ComposerImage) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: image.id,
  });
  const safeAttributes = {
    ...attributes,
    'aria-describedby': undefined,
  };
  const safeListeners = {
    ...listeners,
    onKeyDown: (event: React.KeyboardEvent) => {
      if (event.key === ' ' || event.key === 'Enter') {
        event.preventDefault();
      }
      listeners?.onKeyDown?.(event);
    },
  };
  return (
    <div
      ref={setNodeRef}
      {...safeAttributes}
      {...safeListeners}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        'group relative aspect-[4/3] overflow-hidden rounded-um-sm bg-um-ink-800 shadow-um-xs ring-1 ring-white/[0.14]',
        isDragging && 'z-20 opacity-80 shadow-um-md',
        image.status === 'failed' && 'ring-2 ring-red-400/70',
      )}
    >
      <Image
        src={image.url}
        alt={`${image.name} preview`}
        fill
        unoptimized
        className="object-cover"
        style={{ objectFit: 'cover', objectPosition: toObjectPositionValue(image.focusPosition) }}
      />
      <div className="absolute inset-x-0 top-0 flex items-center justify-between bg-gradient-to-b from-black/60 to-transparent p-2 text-white">
        <span className="font-condensed rounded-full bg-um-ink-950/80 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-[0.1em] text-white">
          {index + 1}
        </span>
        {image.status === 'failed' ? (
          <span className="rounded-full bg-red-500/90 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-[0.08em] text-white">
            Needs attention
          </span>
        ) : (
          <button
            type="button"
            className="grid size-11 touch-none place-items-center rounded-um-sm bg-black/[0.55] transition hover:bg-black/75 focus-visible:ring-2 focus-visible:ring-white"
            aria-label={`Drag ${image.name} to reorder`}
          >
            <GripVertical aria-hidden="true" className="size-4" />
          </button>
        )}
      </div>
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-2 pt-8">
        {image.status === 'uploading' ? (
          <div
            aria-label={`Uploading ${image.name}`}
            aria-valuemax={100}
            aria-valuemin={0}
            aria-valuenow={Math.min(100, Math.max(0, Math.round(image.progress)))}
            className="flex items-center gap-2 text-xs font-medium text-white"
            role="progressbar"
          >
            <Loader2 aria-hidden="true" className="size-3 animate-spin" />
            <span>{Math.max(1, Math.round(image.progress))}%</span>
            <div aria-hidden="true" className="h-1 flex-1 overflow-hidden rounded-full bg-white/30">
              <div className="h-full bg-um-gold-400" style={{ width: `${image.progress}%` }} />
            </div>
          </div>
        ) : image.status === 'failed' ? (
          <div className="flex items-center justify-between gap-2 rounded-um-xs border border-red-300/30 bg-um-ink-950/85 px-2 py-1.5">
            <span
              className="inline-flex items-center gap-1 text-xs font-semibold text-red-100"
              role="alert"
            >
              <RotateCcw aria-hidden="true" className="size-3" /> Upload did not finish
            </span>
            <button
              type="button"
              onClick={() => onRemove(image)}
              aria-label={`Remove failed upload ${image.name}`}
              className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-um-xs bg-red-500 px-2.5 text-xs font-bold text-white transition hover:bg-red-400 focus-visible:ring-2 focus-visible:ring-white"
            >
              <Trash2 aria-hidden="true" className="size-3.5" /> Remove
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-end gap-1">
            <button
              type="button"
              onClick={() => onRemove(image)}
              aria-label={`Remove ${image.name}`}
              className="grid size-10 place-items-center rounded-um-sm bg-black/[0.55] text-white transition hover:bg-um-danger focus-visible:ring-2 focus-visible:ring-white"
            >
              <Trash2 aria-hidden="true" className="size-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

async function getImageDimensions(file: File) {
  // Try fast bitmap API first, but fall back to image element if it fails
  if (typeof window !== 'undefined' && 'createImageBitmap' in window) {
    try {
      const bitmap = await createImageBitmap(file);
      const dimensions = { width: bitmap.width, height: bitmap.height };
      bitmap.close();
      return dimensions;
    } catch (err) {
      // Continue to fallback below
      // Log to help debugging in the wild
      console.warn('createImageBitmap failed, falling back to Image element', err);
    }
  }

  return await new Promise<{ width: number; height: number }>((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new window.Image();
    image.onload = () => {
      resolve({ width: image.naturalWidth, height: image.naturalHeight });
      URL.revokeObjectURL(url);
    };
    image.onerror = (e) => {
      URL.revokeObjectURL(url);
      console.error('Image failed to load for dimension extraction', e);
      reject(new Error('Invalid image'));
    };
    image.src = url;
  });
}

function restoreImageOrder(images: ComposerImage[], orderedIds: string[]) {
  const byId = new Map(images.map((image) => [image.id, image]));
  const restored = orderedIds.flatMap((id) => {
    const image = byId.get(id);
    if (!image) return [];
    byId.delete(id);
    return [image];
  });

  return [...restored, ...byId.values()];
}

type FinalizeImageResult = Awaited<ReturnType<typeof finalizeListingImageAction>>;

async function finalizeUploadedImage(
  listingId: string,
  imageId: string,
  maxAttempts: number,
): Promise<FinalizeImageResult> {
  let lastResult: FinalizeImageResult | null = null;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const result = await finalizeListingImageAction({ listingId, imageId });
    lastResult = result;
    if (result.ok) return result;

    const objectMayStillBeSettling = result.message.toLowerCase().includes('did not finish');
    if (!objectMayStillBeSettling || attempt === maxAttempts - 1) return result;
    await new Promise((resolve) => setTimeout(resolve, 300 * 2 ** attempt));
  }

  return (
    lastResult ?? {
      ok: false,
      message: 'The uploaded image could not be verified.',
    }
  );
}

function getStorageErrorText(error: unknown) {
  if (!error || typeof error !== 'object') return String(error ?? '');
  const details = error as {
    message?: unknown;
    error?: unknown;
    statusCode?: unknown;
    originalError?: unknown;
  };
  return [details.statusCode, details.error, details.message, details.originalError]
    .filter(Boolean)
    .map(String)
    .join(' ')
    .toLowerCase();
}

function isAuthenticationStorageError(error: unknown) {
  const text = getStorageErrorText(error);
  return (
    text.includes('401') ||
    text.includes('403') ||
    text.includes('unauthorized') ||
    text.includes('jwt') ||
    text.includes('jws')
  );
}

async function uploadListingImage(
  file: File,
  listingId: string,
  item: ComposerImage,
  setImages: React.Dispatch<React.SetStateAction<ComposerImage[]>>,
  cancelledUploadsRef: React.MutableRefObject<Set<string>>,
  setMessage: React.Dispatch<React.SetStateAction<string>>,
) {
  const supabase = createClient();
  const updateProgress = (progress: number) => {
    setImages((current) =>
      current.map((image) => (image.id === item.id ? { ...image, progress } : image)),
    );
  };
  const failUpload = (errorMessage?: string) => {
    setImages((current) =>
      current.map((image) => (image.id === item.id ? { ...image, status: 'failed' } : image)),
    );
    setMessage(errorMessage ?? `${file.name} did not finish uploading. Remove it and try again.`);
  };

  const session = await supabase.auth.getSession();
  if (!session.data.session) {
    failUpload('Your session expired. Sign in again before uploading.');
    return;
  }

  let lastError: unknown = null;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    if (cancelledUploadsRef.current.has(item.id)) return;

    if (attempt > 0) {
      updateProgress(18);
      await supabase.auth.refreshSession().catch(() => undefined);
      await new Promise((resolve) => setTimeout(resolve, 650));
    } else {
      updateProgress(10);
    }

    const { error } = await supabase.storage.from('listing-images').upload(item.path, file, {
      cacheControl: '3600',
      contentType: file.type,
      upsert: false,
    });

    if (!error) {
      lastError = null;
      updateProgress(84);
      break;
    }

    lastError = error;

    // Mobile connections can drop after Storage accepted the body but before
    // the browser received the response. Reconcile before sending it again.
    try {
      const recovered = await finalizeUploadedImage(listingId, item.id, 1);
      if (recovered.ok) {
        lastError = null;
        break;
      }
    } catch {
      // The normal retry below is still safe because every image path is unique.
    }
  }

  if (cancelledUploadsRef.current.has(item.id)) {
    await removeListingImageAction({ listingId, imageId: item.id }).catch(() => undefined);
    return;
  }

  if (lastError) {
    failUpload(
      isAuthenticationStorageError(lastError)
        ? 'Your session could not be verified. Sign out, sign in again, and retry the photo.'
        : undefined,
    );
    return;
  }

  try {
    const finalized = await finalizeUploadedImage(listingId, item.id, 5);
    if (!finalized.ok) {
      failUpload(finalized.message);
      return;
    }

    setImages((current) =>
      current.map((image) =>
        image.id === item.id ? { ...image, progress: 100, status: 'uploaded' } : image,
      ),
    );
    setMessage('');
  } catch {
    failUpload(`${file.name} uploaded but could not be verified. Remove it and try again.`);
  }
}
