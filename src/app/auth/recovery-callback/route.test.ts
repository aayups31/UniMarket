import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  createClient: vi.fn(),
  redirect: vi.fn((path: string): never => {
    throw new Error(`REDIRECT:${path}`);
  }),
}));

vi.mock('next/navigation', () => ({ redirect: mocks.redirect }));
vi.mock('@/lib/supabase/server', () => ({ createClient: mocks.createClient }));

import { GET } from './route';

type ProfileResult = {
  data: { email_verified: boolean } | null;
  error: Error | null;
};

type SupabaseOptions = {
  email?: string;
  emailConfirmedAt?: string | null;
  exchangeError?: Error | null;
  profile?: ProfileResult;
  redirectType?: string | null;
};

function arrangeSupabase({
  email = 'aayupsuw@gmail.com',
  emailConfirmedAt = '2026-07-15T12:00:00.000Z',
  exchangeError = null,
  profile = { data: { email_verified: true }, error: null },
  redirectType = 'recovery',
}: SupabaseOptions = {}) {
  const exchangeCodeForSession = vi.fn().mockResolvedValue({
    data: {
      redirectType,
      user: exchangeError
        ? null
        : {
            email,
            email_confirmed_at: emailConfirmedAt,
            id: 'moderator-123',
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
    GET(new Request('http://localhost:3000/auth/recovery-callback?code=recovery-code')),
  ).rejects.toThrow(`REDIRECT:${path}`);
  expect(mocks.redirect).toHaveBeenCalledWith(path);
}

describe('GET /auth/recovery-callback', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('keeps a valid recovery session and sends the account to update its password', async () => {
    const context = arrangeSupabase();

    await expectRedirect('/update-password');

    expect(context.exchangeCodeForSession).toHaveBeenCalledWith('recovery-code');
    expect(context.from).toHaveBeenCalledWith('profiles');
    expect(context.select).toHaveBeenCalledWith('email_verified');
    expect(context.eq).toHaveBeenCalledWith('id', 'moderator-123');
    expect(context.signOut).not.toHaveBeenCalled();
  });

  it('rejects and signs out a callback that did not originate from password recovery', async () => {
    const context = arrangeSupabase({ redirectType: null });

    await expectRedirect('/forgot-password?error=invalid-link');

    expect(context.signOut).toHaveBeenCalledWith({ scope: 'local' });
    expect(context.from).not.toHaveBeenCalled();
  });

  it('returns an invalid exchange to password recovery without trying to sign out', async () => {
    const context = arrangeSupabase({ exchangeError: new Error('expired code') });

    await expectRedirect('/forgot-password?error=invalid-link');

    expect(context.from).not.toHaveBeenCalled();
    expect(context.signOut).not.toHaveBeenCalled();
  });

  it.each([
    { email: 'attacker@example.com', emailConfirmedAt: '2026-07-15T12:00:00.000Z' },
    { email: 'student@uwaterloo.ca', emailConfirmedAt: null },
  ])('signs out an ineligible recovery account', async ({ email, emailConfirmedAt }) => {
    const context = arrangeSupabase({ email, emailConfirmedAt });

    await expectRedirect('/forgot-password?error=invalid-link');

    expect(context.signOut).toHaveBeenCalledWith({ scope: 'local' });
    expect(context.from).not.toHaveBeenCalled();
  });

  it.each([
    { label: 'unverified', profile: { data: { email_verified: false }, error: null } },
    { label: 'missing', profile: { data: null, error: null } },
    { label: 'unavailable', profile: { data: null, error: new Error('database unavailable') } },
  ])('signs out when the recovery profile is $label', async ({ profile }) => {
    const context = arrangeSupabase({ profile });

    await expectRedirect('/forgot-password?error=invalid-link');

    expect(context.maybeSingle).toHaveBeenCalledOnce();
    expect(context.signOut).toHaveBeenCalledWith({ scope: 'local' });
  });
});
