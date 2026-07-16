'use server';

import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { buildAuthCallbackUrl } from '@/lib/auth/callback-url';
import { isAllowedAuthEmail, normalizeEmail } from '@/lib/auth/email';
import { getSafeNextPath } from '@/lib/auth/navigation';
import { AUTH_NEXT_COOKIE, AUTH_NEXT_MAX_AGE_SECONDS } from '@/lib/auth/pending-sign-in';
import { createClient } from '@/lib/supabase/server';

import {
  loginSchema,
  passwordResetRequestSchema,
  resendSignupSchema,
  signupSchema,
  updatePasswordSchema,
  type LoginInput,
  type PasswordResetRequestInput,
  type ResendSignupInput,
  type SignupInput,
  type UpdatePasswordInput,
} from './schemas';

export type AuthActionResult = { ok: true; message: string } | { ok: false; message: string };

function emailRequestErrorMessage(status?: number) {
  if (status === 429) {
    return 'Too many emails were requested. Wait a minute, then try again.';
  }

  return "We couldn't send the email right now. Please try again in a moment.";
}

function loginErrorMessage(code?: string) {
  if (code === 'email_not_confirmed') {
    return 'Verify your email before signing in. Use the confirmation email from signup.';
  }

  if (code === 'over_request_rate_limit') {
    return 'Too many sign-in attempts. Wait a moment, then try again.';
  }

  return 'The email or password is incorrect.';
}

function passwordUpdateErrorMessage(code?: string) {
  if (code === 'same_password') return 'Choose a password you have not used for this account.';
  if (code === 'weak_password') return 'Use a stronger password and try again.';
  return "We couldn't update the password. Request a new recovery link and try again.";
}

async function getEmailRedirectTo(path: '/auth/callback' | '/auth/recovery-callback') {
  const requestHeaders = await headers();

  return buildAuthCallbackUrl({
    configuredOrigin: process.env.NEXT_PUBLIC_SITE_URL,
    path,
    requestOrigin: requestHeaders.get('origin'),
  });
}

async function rememberAuthDestination(next?: string) {
  const cookieStore = await cookies();

  cookieStore.set(AUTH_NEXT_COOKIE, getSafeNextPath(next), {
    httpOnly: true,
    maxAge: AUTH_NEXT_MAX_AGE_SECONDS,
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });
}

export async function loginAction(input: LoginInput): Promise<AuthActionResult> {
  const parsed = loginSchema.safeParse(input);

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? 'Check your details.' };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error || !data.user) {
    return { ok: false, message: loginErrorMessage(error?.code) };
  }

  const verifiedEmail = normalizeEmail(data.user.email ?? '');

  if (
    !data.user.email_confirmed_at ||
    !isAllowedAuthEmail(verifiedEmail) ||
    verifiedEmail !== parsed.data.email
  ) {
    await supabase.auth.signOut({ scope: 'local' });
    return { ok: false, message: 'Use an eligible UniMarket account to continue.' };
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role, onboarding_completed_at, email_verified')
    .eq('id', data.user.id)
    .maybeSingle();

  if (profileError || !profile || !profile.email_verified) {
    await supabase.auth.signOut({ scope: 'local' });
    return { ok: false, message: "Your account couldn't be prepared. Please try again." };
  }

  const next = getSafeNextPath(parsed.data.next);

  if (profile.role === 'moderator' || profile.onboarding_completed_at) redirect(next);

  const params = new URLSearchParams();
  if (next !== '/marketplace') params.set('next', next);
  redirect(params.size ? `/onboarding?${params.toString()}` : '/onboarding');
}

export async function signupAction(input: SignupInput): Promise<AuthActionResult> {
  const parsed = signupSchema.safeParse(input);

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? 'Check your details.' };
  }

  const supabase = await createClient();
  const emailRedirectTo = await getEmailRedirectTo('/auth/callback');
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: { emailRedirectTo },
  });

  if (error) {
    if (error.code === 'weak_password') {
      return { ok: false, message: 'Use a stronger password and try again.' };
    }

    return { ok: false, message: emailRequestErrorMessage(error.status) };
  }

  // Confirmations are required, so no lasting session should be created here.
  // Keep this defensive sign-out in case a local project is misconfigured.
  if (data.session) await supabase.auth.signOut({ scope: 'local' });

  await rememberAuthDestination(parsed.data.next);

  const params = new URLSearchParams({ email: parsed.data.email });
  const next = getSafeNextPath(parsed.data.next);
  if (next !== '/marketplace') params.set('next', next);
  redirect(`/verify?${params.toString()}`);
}

export async function resendSignupAction(input: ResendSignupInput): Promise<AuthActionResult> {
  const parsed = resendSignupSchema.safeParse(input);

  if (!parsed.success) {
    return { ok: false, message: 'Return to signup and check your Waterloo email address.' };
  }

  const supabase = await createClient();
  const emailRedirectTo = await getEmailRedirectTo('/auth/callback');
  const { error } = await supabase.auth.resend({
    email: parsed.data.email,
    options: { emailRedirectTo },
    type: 'signup',
  });

  if (error) return { ok: false, message: emailRequestErrorMessage(error.status) };

  await rememberAuthDestination(parsed.data.next);
  return { ok: true, message: 'A new verification email is on its way.' };
}

export async function requestPasswordResetAction(
  input: PasswordResetRequestInput,
): Promise<AuthActionResult> {
  const parsed = passwordResetRequestSchema.safeParse(input);

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? 'Check your email.' };
  }

  const supabase = await createClient();
  const redirectTo = await getEmailRedirectTo('/auth/recovery-callback');
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, { redirectTo });

  if (error) return { ok: false, message: emailRequestErrorMessage(error.status) };

  return {
    ok: true,
    message: 'If an eligible account exists, a password recovery email is on its way.',
  };
}

export async function updatePasswordAction(input: UpdatePasswordInput): Promise<AuthActionResult> {
  const parsed = updatePasswordSchema.safeParse(input);

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? 'Check your password.' };
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user || !isAllowedAuthEmail(normalizeEmail(user.email ?? ''))) {
    await supabase.auth.signOut({ scope: 'local' });
    return { ok: false, message: 'Request a new recovery link before updating your password.' };
  }

  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });

  if (error) return { ok: false, message: passwordUpdateErrorMessage(error.code) };

  await supabase.auth.signOut({ scope: 'local' });
  redirect('/login?notice=password-updated');
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut({ scope: 'local' });
  redirect('/login');
}
