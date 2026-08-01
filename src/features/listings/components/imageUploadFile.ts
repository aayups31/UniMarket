import { LISTING_IMAGE_MAX_BYTES } from '../schemas';

const ACCEPTED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

const MIME_ALIASES: Record<string, string> = {
  'image/jpg': 'image/jpeg',
  'image/pjpeg': 'image/jpeg',
  'image/x-png': 'image/png',
};

const MIME_BY_EXTENSION: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  jpe: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
};

export type PreparedListingImage = { ok: true; file: File } | { ok: false; message: string };

/**
 * Validates a listing photo without decoding or re-encoding it in the browser.
 * Android gallery providers sometimes omit the MIME type or use a JPEG alias,
 * so safe types can also be inferred from the filename.
 */
export function prepareListingImageFile(file: File): PreparedListingImage {
  if (file.size === 0) {
    return { ok: false, message: `${file.name} is empty.` };
  }

  if (file.size > LISTING_IMAGE_MAX_BYTES) {
    return { ok: false, message: `${file.name} is larger than the 5 MB upload limit.` };
  }

  const suppliedType = file.type.trim().toLowerCase();
  const extension = file.name.split('.').pop()?.toLowerCase() ?? '';
  const inferredType = MIME_BY_EXTENSION[extension];
  const normalizedType =
    MIME_ALIASES[suppliedType] ??
    (ACCEPTED_IMAGE_TYPES.has(suppliedType) ? suppliedType : undefined) ??
    (!suppliedType || suppliedType === 'application/octet-stream' ? inferredType : undefined);

  if (!normalizedType || !ACCEPTED_IMAGE_TYPES.has(normalizedType)) {
    return {
      ok: false,
      message: `${file.name} is not supported. Choose a JPEG, PNG, or WebP photo.`,
    };
  }

  if (file.type === normalizedType) return { ok: true, file };

  return {
    ok: true,
    file: new File([file], file.name, {
      type: normalizedType,
      lastModified: file.lastModified,
    }),
  };
}
