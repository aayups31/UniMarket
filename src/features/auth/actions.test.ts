import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  cookies: vi.fn(),
  createClient: vi.fn(),
  headers: vi.fn(),
  redirect: vi.fn((path: string): never => {
    throw new Error(`REDIRECT:${path}`);
  }),
}));

vi.mock('next/headers', () => ({ cookies: mocks.cookies, headers: mocks.headers }));
vi.mock('next/navigation', () => ({ redirect: mocks.redirect }));
vi.mock('@/lib/supabase/server', () => ({ createClient: mocks.createClient }));

import { AUTH_NEXT_COOKIE } from '@/lib/auth/pending-sign-in';

import {
  loginAction,
  requestPasswordResetAction,
  resendSignupAction,
  signupAction,
  updatePasswordAction,
} from './actions';

const siteUrl = 'https://mvp.unimarket.example';
const strongPassword = 'Waterloo8';

type AuthError = {
  code?: string;
  status?: number;
};

type ProfileResult = {
  data: {
    email_verified: boolean;
    onboarding_completed_at: string | null;
    role: 'moderator' | 'student';
  } | null;
  error: Error | null;
};

type SupabaseOptions = {
  getUserEmail?: string;
  getUserError?: AuthError | null;
  loginEmail?: string;
  loginEmailConfirmedAt?: string | null;
  loginError?: AuthError | null;
  loginHasUser?: boolean;
  profile?: ProfileResult;
  resetError?: AuthError | null;
  resendError?: AuthError | null;
  signupError?: AuthError | null;
  signupHasSession?: boolean;
  signupIdentities?: unknown[];
  updateError?: AuthError | null;
};

function arrangeSupabase({
  getUserEmail = 'student@uwaterloo.ca',
  getUserError = null,
  loginEmail = 'student@uwaterloo.ca',
  loginEmailConfirmedAt = '2026-07-15T12:00:00.000Z',
  loginError = null,
  loginHasUser = true,
  profile = {
    data: {
      email_verified: true,
      onboarding_completed_at: '2026-07-15T12:00:00.000Z',
      role: 'student',
    },
    error: null,
  },
  resetError = null,
  resendError = null,
  signupError = null,
  signupHasSession = false,
  signupIdentities = [{ id: 'identity-123' }],
  updateError = null,
}: SupabaseOptions = {}) {
  const signInWithPassword = vi.fn().mockResolvedValue({
    data: {
      user: loginHasUser
        ? {
            email: loginEmail,
            email_confirmed_at: loginEmailConfirmedAt,
            id: 'user-123',
          }
        : null,
    },
    error: loginError,
  });
  const signUp = vi.fn().mockResolvedValue({
    data: {
      session: signupHasSession ? { access_token: 'temporary-session' } : null,
      user: { identities: signupIdentities },
    },
    error: signupError,
  });
  const resend = vi.fn().mockResolvedValue({ error: resendError });
  const resetPasswordForEmail = vi.fn().mockResolvedValue({ error: resetError });
  const getUser = vi.fn().mockResolvedValue({
    data: {
      user: getUserEmail ? { email: getUserEmail, id: 'user-123' } : null,
    },
    error: getUserError,
  });
  const updateUser = vi.fn().mockResolvedValue({ error: updateError });
  const signOut = vi.fn().mockResolvedValue({ error: null });
  const maybeSingle = vi.fn().mockResolvedValue(profile);
  const eq = vi.fn(() => ({ maybeSingle }));
  const select = vi.fn(() => ({ eq }));
  const from = vi.fn(() => ({ select }));

  mocks.createClient.mockResolvedValue({
    auth: {
      getUser,
      resend,
      resetPasswordForEmail,
      signInWithPassword,
      signOut,
      signUp,
      updateUser,
    },
    from,
  });

  return {
    eq,
    from,
    getUser,
    maybeSingle,
    resend,
    resetPasswordForEmail,
    select,
    signInWithPassword,
    signOut,
    signUp,
    updateUser,
  };
}

async function expectRedirect(action: () => Promise<unknown>, path: string) {
  await expect(action()).rejects.toThrow(`REDIRECT:${path}`);
  expect(mocks.redirect).toHaveBeenCalledWith(path);
}

describe('auth server actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', siteUrl);

    mocks.cookies.mockResolvedValue({ set: vi.fn() });
    mocks.headers.mockResolvedValue({
      get: vi.fn((name: string) => (name === 'origin' ? 'https://untrusted.example' : null)),
    });
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  describe('signupAction', () => {
    it('signs up with the password and static confirmation callback', async () => {
      const cookieStore = { set: vi.fn() };
      mocks.cookies.mockResolvedValue(cookieStore);
      const context = arrangeSupabase();

      await expectRedirect(
        () =>
          signupAction({
            confirmPassword: strongPassword,
            email: ' Student@UWATERLOO.CA ',
            next: '/my-listings?status=active',
            password: strongPassword,
          }),
        '/verify?email=student%40uwaterloo.ca&next=%2Fmy-listings%3Fstatus%3Dactive',
      );

      expect(context.signUp).toHaveBeenCalledWith({
        email: 'student@uwaterloo.ca',
        options: { emailRedirectTo: `${siteUrl}/auth/callback` },
        password: strongPassword,
      });
      expect(cookieStore.set).toHaveBeenCalledWith(
        AUTH_NEXT_COOKIE,
        '/my-listings?status=active',
        expect.objectContaining({ httpOnly: true, path: '/', sameSite: 'lax' }),
      );
      expect(context.signOut).not.toHaveBeenCalled();
    });

    it('rejects public moderator signup before creating a Supabase client', async () => {
      const result = await signupAction({
        confirmPassword: strongPassword,
        email: 'aayupsuw@gmail.com',
        password: strongPassword,
      });

      expect(result).toEqual({ ok: false, message: 'Use your @uwaterloo.ca email address.' });
      expect(mocks.createClient).not.toHaveBeenCalled();
    });

    it('keeps an existing confirmed account on signup with a sign-in prompt', async () => {
      const cookieStore = { set: vi.fn() };
      mocks.cookies.mockResolvedValue(cookieStore);
      arrangeSupabase({ signupIdentities: [] });

      const result = await signupAction({
        confirmPassword: strongPassword,
        email: 'student@uwaterloo.ca',
        password: strongPassword,
      });

      expect(result).toEqual({
        ok: false,
        message: 'This Waterloo email is already registered.',
        reason: 'account-exists',
      });
      expect(mocks.redirect).not.toHaveBeenCalled();
      expect(cookieStore.set).not.toHaveBeenCalled();
    });
  });

  describe('resendSignupAction', () => {
    it('resends a signup confirmation with the static callback', async () => {
      const context = arrangeSupabase();

      const result = await resendSignupAction({
        email: 'student@uwaterloo.ca',
        next: '/listings/new',
      });

      expect(result).toEqual({ ok: true, message: 'A new verification email is on its way.' });
      expect(context.resend).toHaveBeenCalledWith({
        email: 'student@uwaterloo.ca',
        options: { emailRedirectTo: `${siteUrl}/auth/callback` },
        type: 'signup',
      });
    });
  });

  describe('loginAction', () => {
    it.each([
      {
        email: 'student@uwaterloo.ca',
        label: 'a student who completed onboarding',
        profile: {
          data: {
            email_verified: true,
            onboarding_completed_at: '2026-07-15T12:00:00.000Z',
            role: 'student' as const,
          },
          error: null,
        },
      },
      {
        email: 'aayupsuw@gmail.com',
        label: 'the provisioned moderator',
        profile: {
          data: {
            email_verified: true,
            onboarding_completed_at: null,
            role: 'moderator' as const,
          },
          error: null,
        },
      },
    ])('routes $label directly to the safe destination', async ({ email, profile }) => {
      const context = arrangeSupabase({ loginEmail: email, profile });

      await expectRedirect(
        () =>
          loginAction({
            email,
            next: '/my-listings?status=active',
            password: strongPassword,
          }),
        '/my-listings?status=active',
      );

      expect(context.signInWithPassword).toHaveBeenCalledWith({
        email,
        password: strongPassword,
      });
      expect(context.select).toHaveBeenCalledWith('role, onboarding_completed_at, email_verified');
      expect(context.eq).toHaveBeenCalledWith('id', 'user-123');
      expect(context.signOut).not.toHaveBeenCalled();
    });

    it('routes an incomplete student to onboarding with the safe destination', async () => {
      arrangeSupabase({
        profile: {
          data: { email_verified: true, onboarding_completed_at: null, role: 'student' },
          error: null,
        },
      });

      await expectRedirect(
        () =>
          loginAction({
            email: 'student@uwaterloo.ca',
            next: '/listings/new',
            password: strongPassword,
          }),
        '/onboarding?next=%2Flistings%2Fnew',
      );
    });

    it('signs out and rejects an unverified authenticated user', async () => {
      const context = arrangeSupabase({ loginEmailConfirmedAt: null });

      const result = await loginAction({
        email: 'student@uwaterloo.ca',
        password: strongPassword,
      });

      expect(result).toEqual({
        ok: false,
        message: 'Use an eligible UniMarket account to continue.',
      });
      expect(context.signOut).toHaveBeenCalledWith({ scope: 'local' });
      expect(context.from).not.toHaveBeenCalled();
    });

    it.each([
      { label: 'missing', profile: { data: null, error: null } },
      {
        label: 'unverified',
        profile: {
          data: { email_verified: false, onboarding_completed_at: null, role: 'student' as const },
          error: null,
        },
      },
      { label: 'unavailable', profile: { data: null, error: new Error('database unavailable') } },
    ])('signs out when the profile is $label', async ({ profile }) => {
      const context = arrangeSupabase({ profile });

      const result = await loginAction({
        email: 'student@uwaterloo.ca',
        password: strongPassword,
      });

      expect(result).toEqual({
        ok: false,
        message: "Your account couldn't be prepared. Please try again.",
      });
      expect(context.signOut).toHaveBeenCalledWith({ scope: 'local' });
    });

    it.each(['invalid_credentials', 'user_not_found'])(
      'does not reveal account existence for %s',
      async (code) => {
        const context = arrangeSupabase({ loginError: { code }, loginHasUser: false });

        const result = await loginAction({
          email: 'student@uwaterloo.ca',
          password: 'incorrect-password',
        });

        expect(result).toEqual({ ok: false, message: 'The email or password is incorrect.' });
        expect(context.from).not.toHaveBeenCalled();
      },
    );
  });

  describe('requestPasswordResetAction', () => {
    it.each(['student@uwaterloo.ca', 'aayupsuw@gmail.com'])(
      'requests recovery without revealing whether %s exists',
      async (email) => {
        const context = arrangeSupabase();

        const result = await requestPasswordResetAction({ email });

        expect(result).toEqual({
          ok: true,
          message: 'If an eligible account exists, a password recovery email is on its way.',
        });
        expect(context.resetPasswordForEmail).toHaveBeenCalledWith(email, {
          redirectTo: `${siteUrl}/auth/recovery-callback`,
        });
      },
    );
  });

  describe('updatePasswordAction', () => {
    it('verifies the recovery user, updates the password, signs out locally, and redirects', async () => {
      const context = arrangeSupabase();

      await expectRedirect(
        () =>
          updatePasswordAction({
            confirmPassword: strongPassword,
            password: strongPassword,
          }),
        '/login?notice=password-updated',
      );

      expect(context.getUser).toHaveBeenCalledOnce();
      expect(context.updateUser).toHaveBeenCalledWith({ password: strongPassword });
      expect(context.signOut).toHaveBeenCalledWith({ scope: 'local' });
      expect(context.getUser.mock.invocationCallOrder[0]).toBeLessThan(
        context.updateUser.mock.invocationCallOrder[0],
      );
      expect(context.updateUser.mock.invocationCallOrder[0]).toBeLessThan(
        context.signOut.mock.invocationCallOrder[0],
      );
    });

    it('does not update a password without an eligible recovery user', async () => {
      const context = arrangeSupabase({ getUserEmail: '' });

      const result = await updatePasswordAction({
        confirmPassword: strongPassword,
        password: strongPassword,
      });

      expect(result).toEqual({
        ok: false,
        message: 'Request a new recovery link before updating your password.',
      });
      expect(context.updateUser).not.toHaveBeenCalled();
      expect(context.signOut).toHaveBeenCalledWith({ scope: 'local' });
    });
  });
});
