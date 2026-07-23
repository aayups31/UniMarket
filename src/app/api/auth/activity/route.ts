import { NextResponse } from 'next/server';

import { markWebSessionActivity } from '@/lib/auth/web-session-cookies';
import { getCurrentIdentity } from '@/lib/auth/session';

export const dynamic = 'force-dynamic';

export async function POST() {
  const identity = await getCurrentIdentity();
  if (!identity) {
    return NextResponse.json(
      { error: 'Your web session has expired.' },
      { headers: { 'Cache-Control': 'private, no-store' }, status: 401 },
    );
  }

  await markWebSessionActivity();
  return new NextResponse(null, {
    headers: { 'Cache-Control': 'private, no-store' },
    status: 204,
  });
}
