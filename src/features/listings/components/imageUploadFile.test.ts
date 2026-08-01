import { describe, expect, it } from 'vitest';

import { LISTING_IMAGE_MAX_BYTES } from '../schemas';
import { prepareListingImageFile } from './imageUploadFile';

describe('prepareListingImageFile', () => {
  it('keeps an ordinary mobile JPEG unchanged', () => {
    const file = new File(['photo'], '1000027016.jpg', { type: 'image/jpeg' });
    const result = prepareListingImageFile(file);

    expect(result).toEqual({ ok: true, file });
  });

  it('keeps an iPhone photo that Safari already transcoded to JPEG unchanged', () => {
    const bytes = new Uint8Array([0xff, 0xd8, 0xff, 0xe0]);
    const file = new File([bytes], 'IMG_4821.HEIC', {
      type: 'image/jpeg',
      lastModified: 1_786_128_000_000,
    });
    const result = prepareListingImageFile(file);

    expect(result).toEqual({ ok: true, file });
    if (result.ok) {
      expect(result.file).toBe(file);
      expect(result.file.name).toBe('IMG_4821.HEIC');
      expect(result.file.type).toBe('image/jpeg');
      expect(result.file.size).toBe(bytes.byteLength);
      expect(result.file.lastModified).toBe(1_786_128_000_000);
    }
  });

  it('accepts a JPEG MIME type even when an iPhone picker supplies no extension', () => {
    const file = new File(['photo'], 'IMG_4822', { type: 'image/jpeg' });

    expect(prepareListingImageFile(file)).toEqual({ ok: true, file });
  });

  it('normalizes Android JPEG MIME aliases without re-encoding', () => {
    const file = new File(['photo'], 'camera.jpg', { type: 'image/jpg' });
    const result = prepareListingImageFile(file);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.file.type).toBe('image/jpeg');
      expect(result.file.size).toBe(file.size);
    }
  });

  it('infers a missing MIME type from a safe extension', () => {
    const file = new File(['photo'], 'camera.JPG');
    const result = prepareListingImageFile(file);

    expect(result.ok).toBe(true);
    if (result.ok) expect(result.file.type).toBe('image/jpeg');
  });

  it('normalizes an opaque mobile picker MIME type from a safe extension', () => {
    const file = new File(['photo'], 'camera.JPEG', { type: 'application/octet-stream' });
    const result = prepareListingImageFile(file);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.file).not.toBe(file);
      expect(result.file.type).toBe('image/jpeg');
      expect(result.file.size).toBe(file.size);
      expect(result.file.lastModified).toBe(file.lastModified);
    }
  });

  it('rejects files over the 5 MiB contract', () => {
    const file = new File([new Uint8Array(LISTING_IMAGE_MAX_BYTES + 1)], 'large.jpg', {
      type: 'image/jpeg',
    });

    expect(prepareListingImageFile(file)).toEqual({
      ok: false,
      message: 'large.jpg is larger than the 5 MB upload limit.',
    });
  });

  it('accepts a photo exactly at the 5 MiB contract boundary', () => {
    const file = new File([new Uint8Array(LISTING_IMAGE_MAX_BYTES)], 'boundary.jpg', {
      type: 'image/jpeg',
    });

    expect(prepareListingImageFile(file)).toEqual({ ok: true, file });
  });

  it('rejects unsupported formats instead of attempting a fragile conversion', () => {
    const file = new File(['photo'], 'camera.heic', { type: 'image/heic' });

    expect(prepareListingImageFile(file)).toEqual({
      ok: false,
      message: 'camera.heic is not supported. Choose a JPEG, PNG, or WebP photo.',
    });
  });

  it('rejects an unconverted iPhone HEIF photo with the supported-format guidance', () => {
    const file = new File(['photo'], 'IMG_4823.HEIF', { type: 'image/heif' });

    expect(prepareListingImageFile(file)).toEqual({
      ok: false,
      message: 'IMG_4823.HEIF is not supported. Choose a JPEG, PNG, or WebP photo.',
    });
  });
});
