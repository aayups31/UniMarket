import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  cookies: vi.fn(),
  createClient: vi.fn(),
  redirect: vi.fn((path: string): never => {
    throw new Error(`REDIRECT:${path}`);
  }),
}));

vi.mock('next/headers', () => ({ cookies: mocks.cookies }));
vi.mock('next/navigation', () => ({ redirect: mocks.redirect }));
vi.mock('@/lib/supabase/server', () => ({ createClient: mocks.createClient }));

import { AUTH_NEXT_COOKIE } from '@/lib/auth/pending-sign-in';

import { GET } from './route';

type ProfileResult = {
  data: { email_verified: boolean } | null;
  error: Error | null;
};

type SupabaseOptions = {
  email?: string;
  emailConfirmedAt?: string | null;
  exchangeError?: Error | null;
  next?: string;
  profile?: ProfileResult;
};

function arrangeSupabase({
  email = 'student@uwaterloo.ca',
  emailConfirmedAt = '2026-07-15T12:00:00.000Z',
  exchangeError = null,
  next,
  profile = { data: { email_verified: true }, error: null },
}: SupabaseOptions = {}) {
  const cookieStore = {
    delete: vi.fn(),
    get: vi.fn((name: string) =>
      name === AUTH_NEXT_COOKIE && next ? { name, value: next } : undefined,
    ),
  };
  mocks.cookies.mockResolvedValue(cookieStore);

  const exchangeCodeForSession = vi.fn().mockResolvedValue({
    data: {
      user: exchangeError
        ? null
        : {
            email,
            email_confirmed_at: emailConfirmedAt,
            id: 'user-123',
          },
    },
    error: exchangeError,
  });
  const signOut = vi.fn().mockResolvedValue({ error: null });
  const maybeSingle = vi.fn().mockResolvedValue(profile);
  const eq = vi.fn(() => ({ maybeSingle }));
  const select = vi.fn(() => ({ eq }));
  const from = vi.fn(() => ({ select }));

  mocks.createClient.mockResolvedValue({
    auth: { exchangeCodeForSession, signOut },
    from,
  });

  return {
    cookieStore,
    eq,
    exchangeCodeForSession,
    from,
    maybeSingle,
    select,
    signOut,
  };
}

async function expectRedirect(path: string) {
  await expect(
    GET(new Request('http://localhost:3000/auth/callback?code=confirmation-code')),
  ).rejects.toThrow(`REDIRECT:${path}`);
  expect(mocks.redirect).toHaveBeenCalledWith(path);
}

describe('GET /auth/callback', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('ends the temporary confirmation session and returns the user to login with a safe next path', async () => {
    const context = arrangeSupabase({ next: '/my-listings?status=active' });

    await expectRedirect('/login?notice=email-verified&next=%2Fmy-listings%3Fstatus%3Dactive');

    expect(context.exchangeCodeForSession).toHaveBeenCalledWith('confirmation-code');
    expect(context.from).toHaveBeenCalledWith('profiles');
    expect(context.select).toHaveBeenCalledWith('email_verified');
    expect(context.eq).toHaveBeenCalledWith('id', 'user-123');
    expect(context.signOut).toHaveBeenCalledOnce();
    expect(context.signOut).toHaveBeenCalledWith({ scope: 'local' });
    expect(context.cookieStore.delete).toHaveBeenCalledWith(AUTH_NEXT_COOKIE);
  });

  it('clamps an unsafe pending destination to the marketplace', async () => {
    const context = arrangeSupabase({ next: 'https://attacker.example/steal' });

    await expectRedirect('/login?notice=email-verified');

    expect(context.signOut).toHaveBeenCalledWith({ scope: 'local' });
    expect(context.cookieStore.delete).toHaveBeenCalledWith(AUTH_NEXT_COOKIE);
  });

  it('returns an invalid exchange to login without trying to sign out a session', async () => {
    const context = arrangeSupabase({
      exchangeError: new Error('expired code'),
      next: '/my-listings',
    });

    await expectRedirect('/login?error=invalid-link&next=%2Fmy-listings');

    expect(context.from).not.toHaveBeenCalled();
    expect(context.signOut).not.toHaveBeenCalled();
    expect(context.cookieStore.delete).toHaveBeenCalledWith(AUTH_NEXT_COOKIE);
  });

  it.each([
    { email: 'attacker@example.com', emailConfirmedAt: '2026-07-15T12:00:00.000Z' },
    { email: 'student@uwaterloo.ca', emailConfirmedAt: null },
  ])('signs out an ineligible exchanged account', async ({ email, emailConfirmedAt }) => {
    const context = arrangeSupabase({ email, emailConfirmedAt, next: '/my-listings' });

    await expectRedirect('/login?error=ineligible-account&next=%2Fmy-listings');

    expect(context.signOut).toHaveBeenCalledWith({ scope: 'local' });
    expect(context.from).not.toHaveBeenCalled();
  });

  it.each([
    { label: 'unverified', profile: { data: { email_verified: false }, error: null } },
    { label: 'missing', profile: { data: null, error: null } },
    { label: 'unavailable', profile: { data: null, error: new Error('database unavailable') } },
  ])('signs out when the profile is $label', async ({ profile }) => {
    const context = arrangeSupabase({ next: '/my-listings', profile });

    await expectRedirect('/login?error=profile-unavailable&next=%2Fmy-listings');

    expect(context.maybeSingle).toHaveBeenCalledOnce();
    expect(context.signOut).toHaveBeenCalledWith({ scope: 'local' });
  });
});
