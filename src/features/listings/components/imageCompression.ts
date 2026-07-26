'use client';

import imageCompression from 'browser-image-compression';

export type ImageCompressionOptions = {
  maxBytes?: number;
  maxWidth?: number;
  quality?: number;
};

const MAX_ORIGINAL_BYTES = 25_000_000;

const MIME_BY_EXTENSION: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  jpe: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  avif: 'image/avif',
  heic: 'image/heic',
  heif: 'image/heif',
};

const SUPPORTED_SOURCE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
  'image/heic',
  'image/heif',
]);

type HeicConverter = (options: {
  blob: Blob;
  toType: 'image/jpeg';
  quality: number;
}) => Promise<Blob | Blob[]>;

/**
 * Converts common phone-gallery images into a compressed JPEG.
 *
 * Output guarantees:
 * - MIME type: image/jpeg
 * - Extension: .jpg
 * - Maximum dimension: approximately 1600 px by default
 * - Target size: approximately 1.5 MB by default
 */
export async function compressImageFile(
  originalFile: File,
  options: ImageCompressionOptions = {},
): Promise<File> {
  const maxBytes = options.maxBytes ?? 1_500_000;
  const maxWidth = options.maxWidth ?? 1_600;
  const quality = options.quality ?? 0.82;

  if (originalFile.size === 0) {
    throw new Error('The selected image is empty.');
  }

  if (originalFile.size > MAX_ORIGINAL_BYTES) {
    throw new Error('The original image is larger than 25 MB.');
  }

  const detectedType = detectImageType(originalFile);

  if (!detectedType) {
    throw new Error(
      'The phone did not provide a recognisable image format.',
    );
  }

  if (!SUPPORTED_SOURCE_TYPES.has(detectedType)) {
    throw new Error(
      `The image format "${detectedType}" is not supported.`,
    );
  }

  let workingFile = setFileMimeType(originalFile, detectedType);

  if (detectedType === 'image/heic' || detectedType === 'image/heif') {
    workingFile = await convertHeicToJpeg(workingFile, quality);
  }

  try {
    const compressed = await imageCompression(workingFile, {
      maxSizeMB: maxBytes / 1_000_000,
      maxWidthOrHeight: maxWidth,
      initialQuality: quality,
      maxIteration: 10,
      fileType: 'image/jpeg',
      useWebWorker: typeof Worker !== 'undefined',
    });

    if (!compressed || compressed.size === 0) {
      throw new Error('Compression returned an empty image.');
    }

    const baseName =
      originalFile.name.replace(/\.[^.]+$/, '') || 'listing-photo';

    return new File([compressed], `${baseName}.jpg`, {
      type: 'image/jpeg',
      lastModified: originalFile.lastModified || Date.now(),
    });
  } catch (error) {
    console.error('[Image compression failed]', {
      name: originalFile.name,
      originalType: originalFile.type,
      detectedType,
      size: originalFile.size,
      error,
    });

    throw new Error(
      `The image could not be compressed. ${getErrorMessage(error)}`,
    );
  }
}

function detectImageType(file: File): string {
  const suppliedType = file.type.trim().toLowerCase();

  // MIME aliases occasionally returned by Android devices or applications.
  if (
    suppliedType === 'image/jpg' ||
    suppliedType === 'image/pjpeg'
  ) {
    return 'image/jpeg';
  }

  if (suppliedType === 'image/x-png') {
    return 'image/png';
  }

  if (
    suppliedType === 'image/heic-sequence' ||
    suppliedType === 'image/heif-sequence'
  ) {
    return suppliedType.startsWith('image/heic')
      ? 'image/heic'
      : 'image/heif';
  }

  if (suppliedType) {
    return suppliedType;
  }

  // Some gallery providers return an empty MIME type.
  const extension = file.name
    .split('.')
    .pop()
    ?.toLowerCase();

  return extension ? MIME_BY_EXTENSION[extension] ?? '' : '';
}

function setFileMimeType(file: File, type: string): File {
  if (file.type === type) {
    return file;
  }

  return new File([file], file.name, {
    type,
    lastModified: file.lastModified,
  });
}

async function convertHeicToJpeg(
  file: File,
  quality: number,
): Promise<File> {
  try {
    const heicModule = await import('heic2any');
    const convert = heicModule.default as HeicConverter;

    const conversionResult = await convert({
      blob: file,
      toType: 'image/jpeg',
      quality,
    });

    const jpegBlob = Array.isArray(conversionResult)
      ? conversionResult[0]
      : conversionResult;

    if (!jpegBlob || jpegBlob.size === 0) {
      throw new Error('HEIC conversion produced no image.');
    }

    const baseName =
      file.name.replace(/\.[^.]+$/, '') || 'listing-photo';

    return new File([jpegBlob], `${baseName}.jpg`, {
      type: 'image/jpeg',
      lastModified: file.lastModified || Date.now(),
    });
  } catch (error) {
    console.error('[HEIC conversion failed]', {
      name: file.name,
      type: file.type,
      size: file.size,
      error,
    });

    throw new Error(
      `This HEIC/HEIF photo could not be converted. ${getErrorMessage(error)}`,
    );
  }
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return 'Please choose another photo and try again.';
}