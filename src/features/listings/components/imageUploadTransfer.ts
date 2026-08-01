const UPLOAD_CACHE_SECONDS = '3600';

export type SignedImageUploadResult = { ok: true } | { ok: false; status: number; message: string };

/**
 * Sends a file to a Supabase signed upload URL without attaching the browser's
 * current auth header. The AbortSignal is intentional: iOS can suspend a tab
 * or switch networks while a request is in flight, and an unbounded request
 * would otherwise block every photo queued behind it.
 */
export async function uploadListingImageToSignedUrl(
  signedUrl: string,
  file: File,
  signal: AbortSignal,
): Promise<SignedImageUploadResult> {
  const form = new FormData();
  form.append('cacheControl', UPLOAD_CACHE_SECONDS);
  form.append('', file);

  const response = await fetch(signedUrl, {
    method: 'PUT',
    headers: { 'x-upsert': 'false' },
    body: form,
    signal,
  });

  if (response.ok) return { ok: true };

  let message = 'The image transfer was rejected.';
  try {
    const payload = (await response.json()) as { error?: string; message?: string };
    message = payload.message ?? payload.error ?? message;
  } catch {
    // Some gateway and network responses do not have a JSON body.
  }

  return { ok: false, status: response.status, message };
}
