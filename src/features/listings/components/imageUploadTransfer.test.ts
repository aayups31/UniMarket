import { afterEach, describe, expect, it, vi } from 'vitest';

import { uploadListingImageToSignedUrl } from './imageUploadTransfer';

describe('uploadListingImageToSignedUrl', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('uploads the original file with a cancellable signed request and no auth header', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('{}', { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);
    const controller = new AbortController();
    const file = new File(['photo'], 'IMG_4821.jpg', { type: 'image/jpeg' });

    await expect(
      uploadListingImageToSignedUrl(
        'https://project.supabase.co/storage/v1/object/upload/sign/listing-images/photo?token=signed',
        file,
        controller.signal,
      ),
    ).resolves.toEqual({ ok: true });

    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, options] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toContain('token=signed');
    expect(options.method).toBe('PUT');
    expect(options.signal).toBe(controller.signal);
    expect(options.headers).toEqual({ 'x-upsert': 'false' });
    expect(options.headers).not.toHaveProperty('Authorization');
    expect(options.body).toBeInstanceOf(FormData);

    const form = options.body as FormData;
    expect(form.get('cacheControl')).toBe('3600');
    expect(form.get('')).toBe(file);
  });

  it('returns a useful storage rejection without throwing', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ message: 'Upload token has expired' }), {
          status: 400,
          headers: { 'content-type': 'application/json' },
        }),
      ),
    );

    const result = await uploadListingImageToSignedUrl(
      'https://project.supabase.co/signed',
      new File(['photo'], 'photo.jpg', { type: 'image/jpeg' }),
      new AbortController().signal,
    );

    expect(result).toEqual({
      ok: false,
      status: 400,
      message: 'Upload token has expired',
    });
  });
});
