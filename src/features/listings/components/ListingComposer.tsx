'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import * as Dialog from '@radix-ui/react-dialog';
import * as Switch from '@radix-ui/react-switch';
import {
  Armchair,
  BookOpenText,
  Check,
  ChevronDown,
  Eye,
  ImageIcon,
  Loader2,
  MapPin,
  MonitorSmartphone,
  Save,
  Shapes,
  ShieldCheck,
  Shirt,
  Sparkles,
  X,
  type LucideIcon,
} from 'lucide-react';
import { useForm, useWatch } from 'react-hook-form';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';
import { cn } from '@/lib/utils';

import { publishListingAction, saveListingDraftAction } from '../actions';
import { publishListingInBrowser, saveListingDraftInBrowser } from '../client-persistence';
import {
  centsToDollars,
  dollarsToCents,
  LISTING_DESCRIPTION_MAX,
  LISTING_TITLE_MAX,
  listingPublishSchema,
  type ListingCondition,
  type ListingDraftInput,
} from '../schemas';
import { ImageUploader, type ComposerImage } from './ImageUploader';

type CategoryOption = { id: number; slug: string; name: string; icon: string };

type ListingComposerProps = {
  sellerName: string;
  categories: CategoryOption[];
  pickupAreas: string[];
  initial?: {
    id: string;
    title: string;
    description: string;
    priceCents: number | null;
    categoryId: number | null;
    condition: ListingCondition | null;
    openToOffers: boolean;
    pickupArea: string;
    status: string;
    images: ComposerImage[];
  };
};

type FormValues = {
  title: string;
  description: string;
  price: string;
  categoryId: string;
  condition: ListingCondition | '';
  openToOffers: boolean;
  pickupArea: string;
};

const CONDITIONS: Array<{ value: ListingCondition; label: string; detail: string }> = [
  { value: 'new', label: 'New', detail: 'Unused and in original condition.' },
  { value: 'like_new', label: 'Like New', detail: 'Barely used with almost no wear.' },
  { value: 'good', label: 'Good', detail: 'Works well with normal signs of use.' },
  { value: 'fair', label: 'Fair', detail: 'Functional with visible wear or small flaws.' },
  { value: 'well_used', label: 'Well Used', detail: 'Heavily used, but still useful.' },
];

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  electronics: MonitorSmartphone,
  books: BookOpenText,
  household: Armchair,
  'household-items': Armchair,
  clothing: Shirt,
};

const STEPS = [
  { href: '#images', label: 'Photos' },
  { href: '#details', label: 'Details' },
  { href: '#pricing', label: 'Price & pickup' },
  { href: '#publish', label: 'Publish' },
];

const AUTOSAVE_DELAY_MS = 1600;

export function ListingComposer({
  sellerName,
  categories,
  pickupAreas,
  initial,
}: ListingComposerProps) {
  const router = useRouter();
  const isPublished = initial?.status === 'published';
  const [listingId, setListingId] = useState(initial?.id ?? null);
  const [images, setImages] = useState<ComposerImage[]>(initial?.images ?? []);
  const [notice, setNotice] = useState('');
  const [noticeKind, setNoticeKind] = useState<'success' | 'error'>('success');
  const [isAutosaving, setIsAutosaving] = useState(false);
  const [pendingAction, setPendingAction] = useState<'save' | 'publish' | null>(null);
  const [isSaving, startSaving] = useTransition();
  const listingIdRef = useRef(initial?.id ?? null);
  const hasPersistedListingRef = useRef(Boolean(initial?.id));
  const draftSaveQueueRef = useRef<Promise<void>>(Promise.resolve());
  const autosaveRevisionRef = useRef(0);
  const lastAutosaveAttemptRevisionRef = useRef<number | null>(null);
  const manualOperationRef = useRef(false);
  const publishCompletedRef = useRef(false);
  const {
    register,
    getValues,
    reset,
    setValue,
    setError,
    clearErrors,
    control,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    mode: 'onTouched',
    defaultValues: {
      title: initial?.title ?? '',
      description: initial?.description ?? '',
      price: centsToDollars(initial?.priceCents),
      categoryId: initial?.categoryId ? String(initial.categoryId) : '',
      condition: initial?.condition ?? '',
      openToOffers: initial?.openToOffers ?? false,
      pickupArea: initial?.pickupArea ?? '',
    },
  });
  const values = useWatch({ control }) as FormValues;
  const canAutosave = !isPublished;
  const hasUploadingImages = images.some((image) => image.status === 'uploading');
  const hasPendingWork = isDirty || hasUploadingImages;
  const hasDraftSafePrice =
    values.price.trim().length === 0 || dollarsToCents(values.price) !== null;

  const toPayload = useCallback(
    (id = listingIdRef.current): ListingDraftInput => ({
      listingId: id,
      title: getValues('title'),
      description: getValues('description'),
      priceCents: dollarsToCents(getValues('price')),
      categoryId: getValues('categoryId') ? Number(getValues('categoryId')) : null,
      condition: getValues('condition') || null,
      openToOffers: getValues('openToOffers'),
      pickupArea: getValues('pickupArea'),
    }),
    [getValues],
  );

  const persistDraft = useCallback(() => {
    const rawPrice = getValues('price');
    if (rawPrice.trim() && dollarsToCents(rawPrice) === null) {
      setNoticeKind('error');
      setNotice('Enter a valid price with no more than two decimal places.');
      setError('price', { message: 'Enter a valid price with no more than two decimal places.' });
      return Promise.resolve(null);
    }
    // Reserve the draft ID before the first request. The Server Action and the
    // browser RLS fallback can then retry without ever creating two drafts.
    const reservedId = listingIdRef.current ?? crypto.randomUUID();
    listingIdRef.current = reservedId;
    const snapshot = toPayload(reservedId);

    const saveSnapshot = async () => {
      // A second request can be queued while the first creates a new draft. Reuse
      // the ID established by that first request instead of creating a duplicate.
      const payload = {
        ...snapshot,
        listingId: snapshot.listingId ?? listingIdRef.current,
      };

      try {
        let result;
        try {
          result = await saveListingDraftAction(payload);
        } catch {
          // The authenticated browser workflow below is the resilience path for
          // a Server Action request that was interrupted by the network.
        }

        if (!result?.ok && !result?.fieldErrors) {
          result = await saveListingDraftInBrowser(payload);
        }

        if (!result) {
          setNoticeKind('error');
          setNotice('Your draft could not be saved. Check your connection and try again.');
          return null;
        }

        if (!result.ok) {
          setNoticeKind('error');
          setNotice(result.message);
          applyFieldErrors(result.fieldErrors, setError);
          return null;
        }

        const savedId = result.data.id;
        if (!hasPersistedListingRef.current) {
          hasPersistedListingRef.current = true;
          listingIdRef.current = savedId;
          setListingId(savedId);
          window.history.replaceState(null, '', `/listings/${savedId}/edit`);
        }

        // Only clear the dirty state when the fields still match the exact payload
        // that reached the server. Edits made while a save is in flight stay dirty.
        if (
          draftFingerprint({ ...payload, listingId: savedId }) ===
          draftFingerprint(toPayload(savedId))
        ) {
          reset(getValues());
        }

        return savedId;
      } catch {
        setNoticeKind('error');
        setNotice(
          'We could not save this draft. Your changes are still here—check your connection and try again.',
        );
        return null;
      }
    };

    // Serialize every draft write. An older autosave can never finish after a
    // newer manual save and overwrite the user's latest fields.
    const queuedSave = draftSaveQueueRef.current.then(saveSnapshot, saveSnapshot);
    draftSaveQueueRef.current = queuedSave.then(
      () => undefined,
      () => undefined,
    );
    return queuedSave;
  }, [getValues, reset, setError, toPayload]);

  useEffect(() => {
    autosaveRevisionRef.current += 1;
  }, [
    values.categoryId,
    values.condition,
    values.description,
    values.openToOffers,
    values.pickupArea,
    values.price,
    values.title,
  ]);

  useEffect(() => {
    if (
      !canAutosave ||
      !isDirty ||
      !hasDraftSafePrice ||
      hasUploadingImages ||
      isAutosaving ||
      isSaving ||
      manualOperationRef.current ||
      publishCompletedRef.current
    ) {
      return;
    }

    const snapshotFingerprint = draftFingerprint(toPayload());
    const snapshotRevision = autosaveRevisionRef.current;
    if (lastAutosaveAttemptRevisionRef.current === snapshotRevision) return;

    const autosaveTimer = window.setTimeout(() => {
      if (manualOperationRef.current || publishCompletedRef.current) return;

      lastAutosaveAttemptRevisionRef.current = snapshotRevision;
      setIsAutosaving(true);
      void persistDraft()
        .then((savedId) => {
          if (
            savedId &&
            snapshotFingerprint === draftFingerprint(toPayload(savedId)) &&
            !manualOperationRef.current &&
            !publishCompletedRef.current
          ) {
            setNoticeKind('success');
            setNotice('Draft autosaved privately.');
          }
        })
        .finally(() => setIsAutosaving(false));
    }, AUTOSAVE_DELAY_MS);

    return () => window.clearTimeout(autosaveTimer);
  }, [
    canAutosave,
    hasDraftSafePrice,
    hasUploadingImages,
    isAutosaving,
    isDirty,
    isSaving,
    persistDraft,
    toPayload,
    values.categoryId,
    values.condition,
    values.description,
    values.openToOffers,
    values.pickupArea,
    values.price,
    values.title,
  ]);

  useEffect(() => {
    if (!hasPendingWork) return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = true;
    };
    const handleLinkClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) return;
      const link = target.closest<HTMLAnchorElement>('a[href]');
      if (!link || link.target === '_blank' || link.hasAttribute('download')) return;

      const href = link.getAttribute('href');
      if (!href || href.startsWith('#')) return;

      const destination = new URL(link.href, window.location.href);
      if (
        destination.pathname === window.location.pathname &&
        destination.search === window.location.search
      ) {
        return;
      }

      if (
        !window.confirm(
          hasUploadingImages
            ? 'Photos are still uploading. Leave this page anyway?'
            : 'You have unsaved listing changes. Leave this page anyway?',
        )
      ) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('click', handleLinkClick, true);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('click', handleLinkClick, true);
    };
  }, [hasPendingWork, hasUploadingImages]);

  const saveDraft = () => {
    manualOperationRef.current = true;
    setPendingAction('save');
    setNoticeKind('success');
    setNotice(isPublished ? 'Saving changes…' : 'Saving your private draft…');
    startSaving(async () => {
      try {
        const id = await persistDraft();
        if (id) {
          setNoticeKind('success');
          setNotice(isPublished ? 'Changes saved.' : 'Draft saved privately.');
        }
      } finally {
        manualOperationRef.current = false;
        setPendingAction(null);
      }
    });
  };

  const publish = () => {
    manualOperationRef.current = true;
    setPendingAction('publish');
    setNoticeKind('success');
    setNotice('Checking your listing before it goes live…');
    startSaving(async () => {
      try {
        clearErrors();
        const id = await persistDraft();
        if (!id) return;

        const payload = toPayload(id);
        const validation = listingPublishSchema.safeParse(payload);
        if (!validation.success) {
          applyFieldErrors(
            Object.fromEntries(
              validation.error.issues.flatMap((issue) =>
                typeof issue.path[0] === 'string' ? [[issue.path[0], issue.message]] : [],
              ),
            ),
            setError,
          );
          setNoticeKind('error');
          setNotice('Your listing needs a few more details before publishing.');
          focusFirstIssue(validation.error.issues[0]?.path[0]);
          return;
        }
        if (images.some((image) => image.status === 'failed')) {
          setNoticeKind('error');
          setNotice('Remove failed uploads before publishing your listing.');
          document.getElementById('images')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          return;
        }
        if (!images.some((image) => image.status === 'uploaded')) {
          setNoticeKind('error');
          setNotice('Please add at least one finished image before publishing.');
          document.getElementById('images')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          return;
        }
        if (images.some((image) => image.status === 'uploading')) {
          setNoticeKind('error');
          setNotice('Let the images finish uploading before publishing.');
          return;
        }

        try {
          let result;
          try {
            result = await publishListingAction(validation.data);
          } catch (error) {
            console.error('[listings] publish Server Action request failed', error);
          }

          if (!result?.ok && !result?.fieldErrors) {
            result = await publishListingInBrowser(validation.data);
          }

          if (!result) {
            setNoticeKind('error');
            setNotice('We could not publish the listing. Your work is still saved as a draft.');
            return;
          }

          if (!result.ok) {
            setNoticeKind('error');
            setNotice(result.message);
            applyFieldErrors(result.fieldErrors, setError);
            return;
          }
          publishCompletedRef.current = true;
          router.push(`/listings/${result.data.id}?published=1`);
          router.refresh();
        } catch {
          setNoticeKind('error');
          setNotice('We could not publish the listing. Your work is still saved as a draft.');
        }
      } finally {
        manualOperationRef.current = false;
        setPendingAction(null);
      }
    });
  };

  const selectedCategory = categories.find((category) => String(category.id) === values.categoryId);
  const coverImage = images[0]?.url;
  const selectedCondition = CONDITIONS.find((condition) => condition.value === values.condition);
  const displayPrice = dollarsToCents(values.price);
  const saveState =
    isSaving || isAutosaving
      ? 'Saving…'
      : isDirty
        ? 'Unsaved changes'
        : listingId
          ? isPublished
            ? 'Changes saved'
            : 'Draft saved privately'
          : 'Not saved yet';

  return (
    <div className="relative overflow-hidden bg-um-ink-950 pb-44 text-um-text-inverse lg:pb-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-48 -top-64 size-[48rem] rounded-full bg-um-gold-400/[0.065] blur-[120px]"
      />
      <header className="relative mx-auto max-w-um-content overflow-hidden px-5 pb-10 pt-10 text-um-text-inverse sm:px-8 sm:pb-12 sm:pt-14 lg:px-10 lg:pb-14 lg:pt-16">
        <GoldBands />
        <div className="relative z-10 max-w-3xl">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <p className="font-condensed text-xs font-semibold uppercase tracking-[0.16em] text-um-gold-400">
              {isPublished ? 'Edit listing' : 'Create a listing'}
            </p>
            <span aria-hidden="true" className="h-px w-8 bg-um-gold-600" />
            <p className="text-xs font-medium text-white/[0.55]">{saveState}</p>
          </div>
          <h1 className="mt-4 text-[clamp(2.65rem,6vw,4.4rem)] font-bold leading-[1.02] tracking-[-0.026em] text-white">
            {isPublished ? 'Keep it current.' : 'Pass it on.'}
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-6 text-white/[0.76] sm:text-base sm:leading-7">
            {isPublished
              ? 'Update the details students need, then save your changes.'
              : 'Create a clear listing for another Waterloo student. Most take less than two minutes.'}
          </p>
        </div>
      </header>

      <nav
        aria-label="Listing sections"
        className="relative mx-auto max-w-um-content overflow-x-auto border-y border-white/[0.09] px-4 [scrollbar-width:none] sm:px-6 lg:px-8 [&::-webkit-scrollbar]:hidden"
      >
        <ol className="flex min-w-max items-center">
          {STEPS.map((step, index) => (
            <li className="flex items-center" key={step.href}>
              <a
                className="group inline-flex min-h-14 items-center gap-2.5 px-3 text-xs font-semibold text-white/55 transition-colors duration-160 ease-um-out hover:text-white sm:px-5 sm:text-sm"
                href={step.href}
              >
                <span className="font-condensed text-[0.66rem] font-bold tracking-[0.12em] text-um-gold-400">
                  {String(index + 1).padStart(2, '0')}
                </span>
                {step.label}
              </a>
              {index < STEPS.length - 1 ? (
                <span aria-hidden="true" className="h-px w-7 bg-white/[0.12] sm:w-12" />
              ) : null}
            </li>
          ))}
        </ol>
      </nav>

      <div className="relative mx-auto mt-8 grid max-w-um-content items-start gap-7 px-3 sm:px-6 lg:grid-cols-[minmax(0,1.72fr)_minmax(18.5rem,0.82fr)] lg:px-8 xl:gap-10">
        <form
          className="min-w-0 rounded-[1.35rem] border border-white/[0.08] bg-um-ink-900 px-5 py-8 text-um-text-strong shadow-[0_28px_80px_rgba(0,0,0,0.34)] sm:px-8 sm:py-10 lg:px-10"
          onSubmit={(event) => event.preventDefault()}
        >
          <ImageUploader
            ensureDraft={persistDraft}
            initialImages={initial?.images}
            listingId={listingId}
            onImagesChange={setImages}
          />

          <section
            aria-labelledby="details-heading"
            className="scroll-mt-32 border-t border-white/[0.09] py-12 sm:py-14"
            id="details"
          >
            <SectionHeading
              eyebrow="Item details"
              number="02"
              title="Tell students what they need to know"
              body="Specific listings earn confidence faster. Mention what is included and be direct about wear."
              id="details-heading"
            />

            <div className="mt-9 space-y-9">
              <Field
                counter={`${values.title.length}/${LISTING_TITLE_MAX}`}
                error={errors.title?.message}
                helper="Include the item type, brand, and one useful detail."
                label="Title"
              >
                <Input
                  {...register('title', {
                    maxLength: {
                      value: LISTING_TITLE_MAX,
                      message: `Use ${LISTING_TITLE_MAX} characters or fewer.`,
                    },
                  })}
                  aria-describedby="title-help"
                  aria-invalid={Boolean(errors.title)}
                  className="h-[3.25rem] rounded-um-sm border-white/[0.12] bg-um-ink-850 px-4 text-base text-um-text-strong shadow-um-xs placeholder:text-um-text-muted focus:border-um-gold-400 focus:ring-4 focus:ring-um-gold-500/[0.18]"
                  id="title"
                  placeholder="Dell 24-inch monitor with stand"
                />
              </Field>

              <Field
                counter={`${values.description.length}/${LISTING_DESCRIPTION_MAX}`}
                error={errors.description?.message}
                helper="Mention what is included, how it works, and any defects."
                label="Description"
              >
                <Textarea
                  {...register('description', {
                    maxLength: {
                      value: LISTING_DESCRIPTION_MAX,
                      message: 'The description is too long.',
                    },
                  })}
                  aria-describedby="description-help"
                  aria-invalid={Boolean(errors.description)}
                  className="min-h-44 rounded-um-sm border-white/[0.12] bg-um-ink-850 px-4 py-4 text-base leading-7 text-um-text-strong shadow-um-xs placeholder:text-um-text-muted focus:border-um-gold-400 focus:ring-4 focus:ring-um-gold-500/[0.18]"
                  id="description"
                  onInput={(event) => {
                    event.currentTarget.style.height = 'auto';
                    event.currentTarget.style.height = `${event.currentTarget.scrollHeight}px`;
                  }}
                  placeholder="Selling before co-op. Works perfectly and includes the stand, HDMI cable, and power cable. Small cosmetic marks on the back; no damage to the screen."
                  rows={7}
                />
              </Field>

              <fieldset
                aria-describedby={`categoryId-help${errors.categoryId ? ' categoryId-error' : ''}`}
                aria-invalid={Boolean(errors.categoryId)}
                id="categoryId-group"
              >
                <legend className="text-sm font-bold text-um-text-strong">Category</legend>
                <p className="mt-1.5 text-sm text-um-text-muted" id="categoryId-help">
                  Choose the closest fit.
                </p>
                <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                  {categories.map((category) => {
                    const selected = values.categoryId === String(category.id);
                    const Icon = CATEGORY_ICONS[category.slug] ?? Shapes;
                    return (
                      <label
                        className={cn(
                          'relative flex min-h-24 cursor-pointer flex-col justify-between overflow-hidden rounded-um-sm border p-3.5 transition duration-160 ease-um-out focus-within:ring-2 focus-within:ring-um-gold-400 focus-within:ring-offset-2 focus-within:ring-offset-um-ink-900',
                          selected
                            ? 'border-um-gold-400 bg-um-ink-800 text-white shadow-um-sm'
                            : 'border-white/[0.10] bg-um-ink-850 hover:border-white/[0.24] hover:bg-um-ink-800',
                        )}
                        key={category.id}
                      >
                        <input
                          {...register('categoryId')}
                          aria-describedby={`categoryId-help${errors.categoryId ? ' categoryId-error' : ''}`}
                          className="sr-only"
                          id={`categoryId-${category.id}`}
                          type="radio"
                          value={category.id}
                        />
                        <span
                          className={cn(
                            'grid size-8 place-items-center',
                            selected
                              ? 'bg-um-gold-400 text-um-ink-950'
                              : 'bg-white/[0.08] text-um-text-muted',
                          )}
                        >
                          <Icon aria-hidden="true" className="size-[1.15rem]" strokeWidth={1.8} />
                        </span>
                        <span
                          className={cn(
                            'mt-3 pr-4 text-sm font-bold leading-5',
                            selected ? 'text-white' : 'text-um-text-strong',
                          )}
                        >
                          {category.name}
                        </span>
                        {selected ? (
                          <Check
                            aria-hidden="true"
                            className="absolute right-3 top-3 size-4 text-um-gold-400"
                            strokeWidth={2.4}
                          />
                        ) : null}
                      </label>
                    );
                  })}
                </div>
                {errors.categoryId ? (
                  <p className="mt-2 text-sm text-um-danger" id="categoryId-error" role="alert">
                    {errors.categoryId.message}
                  </p>
                ) : null}
              </fieldset>

              <fieldset
                aria-describedby={`condition-help${errors.condition ? ' condition-error' : ''}`}
                aria-invalid={Boolean(errors.condition)}
                id="condition-group"
              >
                <legend className="text-sm font-bold text-um-text-strong">Condition</legend>
                <p className="mt-1.5 text-sm text-um-text-muted" id="condition-help">
                  Choose the honest description a buyer would expect.
                </p>
                <div className="mt-4 grid grid-cols-2 overflow-hidden rounded-um-sm border border-white/[0.12] bg-um-ink-850 sm:grid-cols-5">
                  {CONDITIONS.map((condition) => {
                    const selected = values.condition === condition.value;
                    return (
                      <label
                        className={cn(
                          'relative flex min-h-12 cursor-pointer items-center justify-center border-b border-r border-white/[0.08] px-2 py-3 text-center transition duration-160 ease-um-out focus-within:z-10 focus-within:ring-2 focus-within:ring-um-gold-400 sm:min-h-14 sm:border-b-0',
                          selected
                            ? 'bg-um-gold-400 text-um-ink-950'
                            : 'bg-um-ink-850 text-um-text hover:bg-um-ink-800',
                        )}
                        key={condition.value}
                      >
                        <input
                          {...register('condition')}
                          aria-describedby={`condition-help${errors.condition ? ' condition-error' : ''}`}
                          className="sr-only"
                          id={`condition-${condition.value}`}
                          type="radio"
                          value={condition.value}
                        />
                        <span className="text-xs font-bold leading-4 sm:text-sm">
                          {condition.label}
                        </span>
                        {selected ? (
                          <Check
                            aria-hidden="true"
                            className="absolute right-1.5 top-1.5 size-3 text-um-gold-400"
                          />
                        ) : null}
                      </label>
                    );
                  })}
                </div>
                <div
                  aria-live="polite"
                  className="min-h-[3.25rem] border-b border-white/[0.08] bg-um-ink-850 px-4 py-3 text-sm leading-6 text-um-text-muted"
                >
                  {selectedCondition
                    ? `${selectedCondition.label} — ${selectedCondition.detail}`
                    : 'Select the condition that sets an honest expectation.'}
                </div>
                {errors.condition ? (
                  <p className="mt-2 text-sm text-um-danger" id="condition-error" role="alert">
                    {errors.condition.message}
                  </p>
                ) : null}
              </fieldset>
            </div>
          </section>

          <section
            aria-labelledby="pricing-heading"
            className="scroll-mt-32 border-t border-white/[0.09] py-12 sm:py-14"
            id="pricing"
          >
            <SectionHeading
              body="Set the price in Canadian dollars and choose a broad meetup area. Exact locations stay private."
              eyebrow="Price & pickup"
              id="pricing-heading"
              number="03"
              title="Make the exchange easy"
            />

            <div className="mt-9 grid gap-8 sm:grid-cols-2">
              <Field
                error={errors.price?.message}
                helper="Enter 0 if you are passing it on for free."
                label="Price"
              >
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-sm font-bold text-um-text-muted">
                    $
                  </span>
                  <Input
                    {...register('price')}
                    aria-describedby="price-help"
                    aria-invalid={Boolean(errors.price)}
                    className="h-[3.25rem] rounded-um-sm border-white/[0.12] bg-um-ink-850 pl-8 pr-16 text-lg font-bold text-um-text-strong shadow-um-xs placeholder:text-um-text-muted focus:border-um-gold-400 focus:ring-4 focus:ring-um-gold-500/[0.18]"
                    id="price"
                    inputMode="decimal"
                    placeholder="120"
                  />
                  <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center font-condensed text-xs font-semibold uppercase tracking-[0.1em] text-um-text-muted">
                    CAD
                  </span>
                </div>
              </Field>

              <Field
                error={errors.pickupArea?.message}
                helper="Share the exact meetup point privately after agreeing on the sale."
                htmlFor="pickupArea"
                label="Pickup area"
              >
                <div className="relative">
                  <MapPin
                    aria-hidden="true"
                    className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-um-text-muted"
                    strokeWidth={1.8}
                  />
                  <select
                    {...register('pickupArea')}
                    aria-describedby="pickupArea-help"
                    aria-invalid={Boolean(errors.pickupArea)}
                    className="flex h-[3.25rem] w-full appearance-none rounded-um-sm border border-white/[0.12] bg-um-ink-850 pl-11 pr-10 text-sm font-medium text-um-text-strong shadow-um-xs outline-none transition focus:border-um-gold-400 focus:ring-4 focus:ring-um-gold-500/[0.18]"
                    id="pickupArea"
                  >
                    <option value="">Choose a broad area</option>
                    {pickupAreas.map((area) => (
                      <option key={area} value={area}>
                        {area}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    aria-hidden="true"
                    className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-um-text-muted"
                  />
                </div>
              </Field>
            </div>

            <div className="mt-8 flex items-center justify-between gap-5 border-y border-white/[0.09] py-5">
              <div>
                <Label className="text-um-text-strong" htmlFor="open-to-offers">
                  Open to offers
                </Label>
                <p className="mt-1.5 text-sm leading-6 text-um-text-muted">
                  Let students know there is room to find a fair price.
                </p>
              </div>
              <Switch.Root
                aria-label="Open to offers"
                checked={values.openToOffers}
                className="relative h-11 w-12 shrink-0 rounded-full bg-transparent transition-colors duration-160 ease-um-out before:absolute before:inset-x-0 before:top-2 before:h-7 before:rounded-full before:bg-white/[0.16] before:transition-colors before:duration-160 before:ease-um-out focus-visible:ring-2 focus-visible:ring-um-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-um-ink-900 data-[state=checked]:before:bg-um-gold-500"
                id="open-to-offers"
                onCheckedChange={(checked) =>
                  setValue('openToOffers', checked, { shouldDirty: true })
                }
              >
                <Switch.Thumb className="absolute left-0 top-3 block size-5 translate-x-1 rounded-full bg-white shadow transition-transform duration-160 ease-um-out data-[state=checked]:translate-x-6 data-[state=checked]:bg-um-gold-400" />
              </Switch.Root>
            </div>
          </section>

          <section
            className="scroll-mt-32 border-t border-white/[0.09] pt-12 sm:pt-14"
            id="publish"
          >
            <div className="relative overflow-hidden rounded-um-md bg-um-ink-950 p-5 text-white shadow-um-md sm:p-7">
              <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-um-gold-400" />
              <div className="flex items-start gap-3.5">
                <span className="grid size-10 shrink-0 place-items-center bg-white/[0.08] text-um-gold-400">
                  <ShieldCheck aria-hidden="true" className="size-5" strokeWidth={1.9} />
                </span>
                <div>
                  <p className="font-condensed text-[0.68rem] font-bold uppercase tracking-[0.16em] text-um-gold-400">
                    04 / Publish
                  </p>
                  <h2 className="mt-1.5 text-xl font-bold tracking-[-0.025em] text-white">
                    Listed for Waterloo.
                  </h2>
                  <p className="mt-2 max-w-xl text-sm leading-6 text-white/60">
                    Drafts stay private. Publishing makes this visible to verified Waterloo
                    students.
                  </p>
                </div>
              </div>

              <p
                aria-live="polite"
                className={cn(
                  'mt-5 min-h-5 text-sm font-medium',
                  noticeKind === 'error' ? 'text-red-300' : 'text-emerald-300',
                )}
              >
                {notice || (isDirty ? 'You have unsaved changes.' : saveState)}
              </p>

              <div className="mt-4 hidden flex-wrap justify-end gap-3 lg:flex">
                <Button
                  className="border-white/15 bg-white/[0.07] text-white hover:bg-white/[0.12]"
                  disabled={isSaving}
                  onClick={saveDraft}
                  type="button"
                  variant="secondary"
                >
                  {pendingAction === 'save' ? (
                    <Loader2 aria-hidden="true" className="size-4 animate-spin" />
                  ) : (
                    <Save aria-hidden="true" className="size-4" />
                  )}
                  {pendingAction === 'save'
                    ? 'Saving…'
                    : isPublished
                      ? 'Save changes'
                      : 'Save draft'}
                </Button>
                <Button
                  className="bg-um-gold-400 text-um-ink-950 shadow-um-sm hover:bg-um-gold-300"
                  disabled={isSaving || hasUploadingImages}
                  onClick={publish}
                  size="lg"
                  type="button"
                  variant="primary"
                >
                  {isSaving || hasUploadingImages ? (
                    <Loader2 aria-hidden="true" className="size-4 animate-spin" />
                  ) : (
                    <Sparkles aria-hidden="true" className="size-4" />
                  )}
                  {hasUploadingImages
                    ? 'Uploading photos'
                    : pendingAction === 'publish'
                      ? 'Publishing…'
                      : isPublished
                        ? 'Update listing'
                        : 'Publish listing'}
                </Button>
              </div>
            </div>
          </section>
        </form>

        <aside aria-label="Live listing preview" className="sticky top-32 hidden min-w-0 lg:block">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="font-condensed text-xs font-bold uppercase tracking-[0.16em] text-um-gold-400">
              Live preview
            </p>
            <p className="text-[0.68rem] font-medium text-white/45">Buyer view</p>
          </div>
          <ListingPreviewCard
            condition={selectedCondition}
            coverImage={coverImage}
            displayPrice={displayPrice}
            selectedCategory={selectedCategory}
            sellerName={sellerName}
            values={values}
          />
          <p className="mt-3 text-xs leading-5 text-white/45">
            This preview updates as you type. Your listing stays private until you publish.
          </p>
        </aside>
      </div>

      {notice ? (
        <div
          aria-live="polite"
          className={cn(
            'pointer-events-none fixed bottom-6 right-6 z-50 hidden max-w-md border px-4 py-3 text-sm font-semibold shadow-[0_18px_50px_rgba(0,0,0,0.32)] lg:block',
            noticeKind === 'error'
              ? 'border-red-300/30 bg-[#341617] text-red-100'
              : 'border-um-gold-400/30 bg-um-ink-900 text-white',
          )}
          role={noticeKind === 'error' ? 'alert' : 'status'}
        >
          {notice}
        </div>
      ) : null}

      <div className="fixed inset-x-0 bottom-[calc(4rem+env(safe-area-inset-bottom))] z-40 border-y border-white/10 bg-um-ink-950/[0.97] px-3 py-2.5 shadow-[0_-12px_32px_rgba(0,0,0,0.28)] backdrop-blur-md sm:px-5 lg:hidden">
        <div className="mx-auto max-w-xl">
          <p
            aria-live="polite"
            className={cn(
              'mb-2 truncate text-xs font-medium',
              noticeKind === 'error' ? 'text-red-300' : 'text-white/65',
            )}
            role={noticeKind === 'error' ? 'alert' : 'status'}
          >
            {notice || saveState}
          </p>
          <div className="flex items-center gap-2.5">
            <Dialog.Root>
              <Dialog.Trigger asChild>
                <Button
                  aria-label="Preview listing"
                  className="size-11 shrink-0 border-white/15 bg-white/[0.07] p-0 text-white hover:bg-white/[0.12]"
                  size="icon"
                  type="button"
                  variant="secondary"
                >
                  <Eye aria-hidden="true" className="size-4" />
                </Button>
              </Dialog.Trigger>

              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-50 bg-um-ink-950/60 backdrop-blur-[2px] data-[state=closed]:animate-out data-[state=open]:animate-in" />
                <Dialog.Content
                  aria-describedby="mobile-preview-description"
                  className="fixed inset-x-0 bottom-0 z-50 max-h-[calc(100dvh-0.75rem)] overflow-y-auto overscroll-contain rounded-t-um-xl border border-b-0 border-white/10 bg-um-ink-950 px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-3 text-white shadow-[0_-24px_64px_rgba(0,0,0,0.42)] focus:outline-none sm:px-6"
                >
                  <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-white/20" />
                  <div className="mx-auto flex max-w-xl items-start justify-between gap-4">
                    <div className="pt-1">
                      <Dialog.Title className="text-xl font-bold tracking-[-0.025em] text-white">
                        Buyer preview
                      </Dialog.Title>
                      <Dialog.Description
                        className="mt-1 text-sm leading-5 text-white/55"
                        id="mobile-preview-description"
                      >
                        This updates live and stays private until you publish.
                      </Dialog.Description>
                    </div>
                    <Dialog.Close asChild>
                      <button
                        aria-label="Close listing preview"
                        className="grid size-11 shrink-0 place-items-center rounded-um-sm text-white/55 transition hover:bg-white/[0.08] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-um-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-um-ink-950"
                        type="button"
                      >
                        <X aria-hidden="true" className="size-5" />
                      </button>
                    </Dialog.Close>
                  </div>

                  <div className="mx-auto mt-5 max-w-xl">
                    <ListingPreviewCard
                      condition={selectedCondition}
                      coverImage={coverImage}
                      displayPrice={displayPrice}
                      selectedCategory={selectedCategory}
                      sellerName={sellerName}
                      values={values}
                    />
                  </div>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>

            <Button
              aria-label={isPublished ? 'Save changes' : 'Save draft'}
              className="h-11 shrink-0 border-white/15 bg-white/[0.07] px-3 text-white hover:bg-white/[0.12]"
              disabled={isSaving}
              onClick={saveDraft}
              type="button"
              variant="secondary"
            >
              {pendingAction === 'save' ? (
                <Loader2 aria-hidden="true" className="size-4 animate-spin" />
              ) : (
                <Save aria-hidden="true" className="size-4" />
              )}
              <span className="hidden min-[390px]:inline">
                {pendingAction === 'save' ? 'Saving…' : isPublished ? 'Save' : 'Save draft'}
              </span>
            </Button>
            <Button
              className="h-11 flex-1 bg-um-gold-500 px-4 text-um-ink-950 shadow-um-xs hover:bg-um-gold-400"
              disabled={isSaving || hasUploadingImages}
              onClick={publish}
              type="button"
              variant="gold"
            >
              {isSaving || hasUploadingImages ? (
                <Loader2 aria-hidden="true" className="size-4 animate-spin" />
              ) : (
                <Sparkles aria-hidden="true" className="size-4" />
              )}
              {hasUploadingImages
                ? 'Uploading photos'
                : pendingAction === 'publish'
                  ? 'Publishing…'
                  : isPublished
                    ? 'Update listing'
                    : 'Publish listing'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function GoldBands() {
  return (
    <div
      aria-hidden="true"
      className="absolute -right-8 top-1/2 hidden w-[34%] -translate-y-1/2 rotate-[-7deg] space-y-2 opacity-65 sm:block"
    >
      <div className="ml-auto h-2.5 w-[72%] bg-um-gold-300" />
      <div className="ml-auto h-2.5 w-[88%] bg-um-gold-400" />
      <div className="ml-auto h-2.5 w-full bg-um-gold-500" />
      <div className="ml-auto h-2.5 w-[58%] bg-um-gold-600" />
    </div>
  );
}

function SectionHeading({
  eyebrow,
  number,
  title,
  body,
  id,
}: {
  eyebrow: string;
  number: string;
  title: string;
  body: string;
  id: string;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-[3.25rem_1fr]">
      <span className="font-condensed flex h-10 items-start border-l-2 border-um-gold-500 pl-3 pt-0.5 text-xs font-bold tracking-[0.1em] text-um-gold-700">
        {number}
      </span>
      <div>
        <p className="font-condensed text-xs font-bold uppercase tracking-[0.15em] text-um-gold-700">
          {eyebrow}
        </p>
        <h2 className="mt-1.5 text-2xl font-bold tracking-[-0.035em] text-um-text-strong" id={id}>
          {title}
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-um-text-muted">{body}</p>
      </div>
    </div>
  );
}

function Field({
  label,
  htmlFor,
  helper,
  error,
  counter,
  children,
}: {
  label: string;
  htmlFor?: string;
  helper?: string;
  error?: string;
  counter?: string;
  children: React.ReactNode;
}) {
  const id = htmlFor ?? label.toLowerCase().replaceAll(' ', '-');
  return (
    <div>
      <div className="mb-2.5 flex items-center justify-between gap-3">
        <Label className="font-bold text-um-text-strong" htmlFor={id}>
          {label}
        </Label>
        {counter ? (
          <span className="text-xs tabular-nums text-um-text-muted">{counter}</span>
        ) : null}
      </div>
      {children}
      <p
        className={cn('mt-2 text-sm leading-5', error ? 'text-um-danger' : 'text-um-text-muted')}
        id={`${id}-help`}
      >
        {error || helper}
      </p>
    </div>
  );
}

function ListingPreviewCard({
  condition,
  coverImage,
  displayPrice,
  selectedCategory,
  sellerName,
  values,
}: {
  condition: (typeof CONDITIONS)[number] | undefined;
  coverImage: string | undefined;
  displayPrice: number | null;
  selectedCategory: CategoryOption | undefined;
  sellerName: string;
  values: FormValues;
}) {
  return (
    <div className="overflow-hidden rounded-um-md border border-white/[0.08] bg-um-ink-850 text-white shadow-[0_24px_70px_rgba(0,0,0,0.32)]">
      <div className="relative aspect-[4/3] overflow-hidden bg-um-ink-800">
        {coverImage ? (
          <Image
            alt={values.title ? `${values.title} cover preview` : 'Listing cover preview'}
            className="object-cover"
            fill
            src={coverImage}
            unoptimized
          />
        ) : (
          <div className="grid h-full place-items-center px-8 text-center">
            <div>
              <ImageIcon
                aria-hidden="true"
                className="mx-auto size-7 text-white/25"
                strokeWidth={1.6}
              />
              <p className="mt-3 text-sm leading-6 text-white/42">
                Your cover photo will appear here.
              </p>
            </div>
          </div>
        )}
        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-um-ink-950/90 px-2.5 py-1 text-[0.65rem] font-bold text-white shadow-um-xs backdrop-blur-sm">
          <ShieldCheck aria-hidden="true" className="size-3 text-um-gold-400" />
          Verified Waterloo seller
        </span>
      </div>

      <div className="p-5">
        <p className="font-condensed text-[0.68rem] font-semibold uppercase tracking-[0.13em] text-um-gold-400">
          {selectedCategory?.name || 'Category'}
        </p>
        <div className="mt-2 flex items-start justify-between gap-4">
          <h3 className="min-w-0 text-base font-bold leading-6 tracking-[-0.02em] text-white">
            {values.title || 'Your listing title'}
          </h3>
          <p className="shrink-0 text-base font-bold tabular-nums text-white">
            {formatPreviewPrice(displayPrice)}
          </p>
        </div>

        <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium text-white/72">
          {selectedCategory ? <PreviewCategory category={selectedCategory} /> : null}
          {condition ? (
            <span className="rounded-full bg-white/[0.08] px-2.5 py-1">{condition.label}</span>
          ) : null}
          {values.openToOffers ? (
            <span className="rounded-full bg-um-gold-400 px-2.5 py-1 text-um-ink-950">
              Offers welcome
            </span>
          ) : null}
        </div>

        <div className="mt-5 space-y-2.5 border-t border-white/[0.09] pt-4 text-sm text-white/55">
          <p className="flex items-center gap-2">
            <MapPin aria-hidden="true" className="size-4" strokeWidth={1.8} />
            {values.pickupArea || 'Pickup area'}
          </p>
          <p className="flex items-center gap-2">
            <ShieldCheck aria-hidden="true" className="size-4 text-um-gold-400" strokeWidth={1.8} />
            {sellerName}
          </p>
        </div>
      </div>
    </div>
  );
}

function PreviewCategory({ category }: { category: CategoryOption }) {
  const Icon = CATEGORY_ICONS[category.slug] ?? Shapes;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.08] px-2.5 py-1">
      <Icon aria-hidden="true" className="size-3" strokeWidth={1.8} />
      {category.name}
    </span>
  );
}

function formatPreviewPrice(priceCents: number | null) {
  if (priceCents === null) return '$—';
  if (priceCents === 0) return 'Free';
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    maximumFractionDigits: priceCents % 100 === 0 ? 0 : 2,
  }).format(priceCents / 100);
}

function draftFingerprint(payload: ListingDraftInput) {
  return JSON.stringify({
    listingId: payload.listingId ?? null,
    title: payload.title,
    description: payload.description,
    priceCents: payload.priceCents,
    categoryId: payload.categoryId,
    condition: payload.condition,
    openToOffers: payload.openToOffers,
    pickupArea: payload.pickupArea,
  });
}

function applyFieldErrors(
  errors: Record<string, string> | undefined,
  setError: ReturnType<typeof useForm<FormValues>>['setError'],
) {
  if (!errors) return;
  for (const [field, message] of Object.entries(errors)) {
    const formField = field === 'priceCents' ? 'price' : field;
    if (
      formField in
      {
        title: 1,
        description: 1,
        price: 1,
        categoryId: 1,
        condition: 1,
        pickupArea: 1,
        openToOffers: 1,
      }
    ) {
      setError(formField as keyof FormValues, { message });
    }
  }
}

function focusFirstIssue(field: PropertyKey | undefined) {
  if (typeof field !== 'string') return;
  const formField = field === 'priceCents' ? 'price' : field;
  const isRadioGroup = formField === 'categoryId' || formField === 'condition';
  const control = isRadioGroup
    ? (document.querySelector<HTMLInputElement>(`input[name="${formField}"]:checked`) ??
      document.querySelector<HTMLInputElement>(`input[name="${formField}"]`))
    : document.getElementById(formField);
  const scrollTarget = isRadioGroup ? document.getElementById(`${formField}-group`) : control;

  control?.focus({ preventScroll: true });
  scrollTarget?.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
  });
}
