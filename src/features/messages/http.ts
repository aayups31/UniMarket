import { NextResponse } from 'next/server';

import { MessagingRequestError } from './queries';

export function assertSameOrigin(request: Request) {
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) {
    throw new MessagingRequestError(403, 'That request could not be verified.');
  }
}

export function messageJson(data: unknown, init?: ResponseInit) {
  const response = NextResponse.json(data, init);
  response.headers.set('Cache-Control', 'private, no-store, max-age=0');
  return response;
}

export function messageErrorResponse(error: unknown) {
  if (error instanceof MessagingRequestError) {
    return messageJson({ error: error.message }, { status: error.status });
  }

  console.error('[messages] Unexpected API error', error);
  return messageJson({ error: 'Messages are temporarily unavailable.' }, { status: 500 });
}

export async function readJsonBody(request: Request) {
  try {
    return await request.json();
  } catch {
    throw new MessagingRequestError(400, 'Send a valid JSON request.');
  }
}
