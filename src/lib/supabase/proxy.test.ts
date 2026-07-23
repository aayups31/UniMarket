import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  createServerClient: vi.fn(),
  getClaims: vi.fn(),
  signOut: vi.fn(),
}));

vi.mock('@supabase/ssr', () => ({ createServerClient: mocks.createServerClient }));
vi.mock('./env', () => ({
  getPublicSupabaseConfig: () => ({
    publishableKey: 'publishable-key',
    url: 'https://project.supabase.co',
  }),
}));

import { NextRequest } from 'next/server';

import {
  WEB_ACTIVITY_COOKIE,
  WEB_SESSION_IDLE_TIMEOUT_MS,
  WEB_SESSION_POLICY_COOKIE,
  WEB_SESSION_POLICY_VERSION,
} from '@/lib/auth/web-session';

import { updateSession } from './proxy';

function request(path: string, cookie?: string) {
  return new NextRequest(`https://unimarket.example${path}`, {
    headers: cookie ? { cookie } : undefined,
  });
}

function authenticated() {
  mocks.getClaims.mockResolvedValue({
    data: { claims: { email: 'student@uwaterloo.ca', sub: 'user-123' } },
    error: null,
  });
}

function webSessionCookie(lastActiveAt: number) {
  return [
    `${WEB_SESSION_POLICY_COOKIE}=${WEB_SESSION_POLICY_VERSION}`,
    `${WEB_ACTIVITY_COOKIE}=${lastActiveAt}`,
  ].join('; ');
}

describe('session proxy', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.createServerClient.mockReturnValue({
      auth: {
        getClaims: mocks.getClaims,
        signOut: mocks.signOut,
      },
    });
    mocks.getClaims.mockResolvedValue({ data: null, error: null });
    mocks.signOut.mockResolvedValue({ error: null });
  });

  it('sends an authenticated sign-in request directly to the marketplace', async () => {
    authenticated();

    const response = await updateSession(request('/login'));

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe('https://unimarket.example/marketplace');
    expect(response.headers.get('location')).not.toContain('/onboarding');
    expect(response.cookies.get(WEB_SESSION_POLICY_COOKIE)?.value).toBe(WEB_SESSION_POLICY_VERSION);
  });

  it('keeps a safe signed-in destination without rendering the auth route', async () => {
    authenticated();

    const response = await updateSession(request('/login?next=%2Fmessages%3Fconversation%3Dabc'));

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe(
      'https://unimarket.example/messages?conversation=abc',
    );
  });

  it('preserves the requested marketplace path for a signed-out visitor', async () => {
    const response = await updateSession(request('/marketplace?q=desk'));

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe(
      'https://unimarket.example/login?next=%2Fmarketplace%3Fq%3Ddesk',
    );
  });

  it('expires an idle web session and clears it before returning to sign in', async () => {
    authenticated();
    const cookie = webSessionCookie(Date.now() - WEB_SESSION_IDLE_TIMEOUT_MS);

    const response = await updateSession(request('/marketplace', cookie));

    expect(mocks.signOut).toHaveBeenCalledWith({ scope: 'local' });
    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe(
      'https://unimarket.example/login?error=session-expired&next=%2Fmarketplace',
    );
  });

  it('returns JSON instead of an auth-page redirect for an expired protected API call', async () => {
    authenticated();
    const cookie = webSessionCookie(Date.now() - WEB_SESSION_IDLE_TIMEOUT_MS);

    const response = await updateSession(request('/api/messages/unread', cookie));

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({
      error: 'Your web session expired after three days of inactivity.',
    });
  });

  it('does not apply the web-only inactivity policy without its policy marker', async () => {
    authenticated();

    const response = await updateSession(request('/api/messages/unread'));

    expect(response.status).toBe(200);
    expect(mocks.signOut).not.toHaveBeenCalled();
  });

  it('bootstraps the web policy on a legacy protected page response', async () => {
    authenticated();

    const response = await updateSession(request('/marketplace'));

    expect(response.status).toBe(200);
    expect(response.cookies.get(WEB_SESSION_POLICY_COOKIE)?.value).toBe(WEB_SESSION_POLICY_VERSION);
    expect(response.cookies.get(WEB_ACTIVITY_COOKIE)?.value).toMatch(/^\d{13}$/);
  });
});
