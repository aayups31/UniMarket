'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, LoaderCircle } from 'lucide-react';
import Link from 'next/link';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';

import { signupAction } from '../actions';
import { signupSchema, type SignupInput } from '../schemas';

export function SignupForm({ nextPath }: { nextPath: string }) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<SignupInput>({
    defaultValues: { confirmPassword: '', email: '', next: nextPath, password: '' },
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = handleSubmit((values) => {
    setServerError(null);
    startTransition(async () => {
      try {
        const result = await signupAction(values);
        if (result && !result.ok) setServerError(result.message);
      } catch {
        setServerError('Something went wrong. Check your connection and try again.');
      }
    });
  });

  const loginHref =
    nextPath === '/marketplace' ? '/login' : `/login?next=${encodeURIComponent(nextPath)}`;

  return (
    <form className="mt-10 space-y-5" noValidate onSubmit={onSubmit}>
      <input type="hidden" {...register('next')} />

      <div className="space-y-2">
        <label className="text-sm font-bold text-um-text-strong" htmlFor="signup-email">
          Waterloo email
        </label>
        <input
          aria-describedby={errors.email ? 'signup-email-error' : 'signup-email-hint'}
          aria-invalid={Boolean(errors.email)}
          autoComplete="email"
          autoFocus
          className="h-[3.35rem] w-full rounded-sm border border-black/[0.12] bg-um-surface px-4 text-base text-um-text-strong outline-none transition placeholder:text-um-text-muted hover:border-black/25 focus:border-um-gold-600 focus:ring-4 focus:ring-um-gold-400/20 disabled:cursor-not-allowed disabled:bg-black/[0.03]"
          disabled={isPending}
          id="signup-email"
          inputMode="email"
          placeholder="yourname@uwaterloo.ca"
          type="email"
          {...register('email')}
        />
        {errors.email ? (
          <p className="text-sm font-medium text-red-700" id="signup-email-error">
            {errors.email.message}
          </p>
        ) : (
          <p className="text-sm text-um-text-muted" id="signup-email-hint">
            Only verified @uwaterloo.ca students can join.
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-um-text-strong" htmlFor="signup-password">
          Password
        </label>
        <input
          aria-describedby={errors.password ? 'signup-password-error' : 'signup-password-hint'}
          aria-invalid={Boolean(errors.password)}
          autoComplete="new-password"
          className="h-[3.35rem] w-full rounded-sm border border-black/[0.12] bg-um-surface px-4 text-base text-um-text-strong outline-none transition placeholder:text-um-text-muted hover:border-black/25 focus:border-um-gold-600 focus:ring-4 focus:ring-um-gold-400/20 disabled:cursor-not-allowed disabled:bg-black/[0.03]"
          disabled={isPending}
          id="signup-password"
          placeholder="Create a password"
          type="password"
          {...register('password')}
        />
        {errors.password ? (
          <p className="text-sm font-medium text-red-700" id="signup-password-error">
            {errors.password.message}
          </p>
        ) : (
          <p className="text-sm text-um-text-muted" id="signup-password-hint">
            Use 8–72 characters with uppercase, lowercase, and a number.
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-um-text-strong" htmlFor="confirm-password">
          Confirm password
        </label>
        <input
          aria-describedby={errors.confirmPassword ? 'confirm-password-error' : undefined}
          aria-invalid={Boolean(errors.confirmPassword)}
          autoComplete="new-password"
          className="h-[3.35rem] w-full rounded-sm border border-black/[0.12] bg-um-surface px-4 text-base text-um-text-strong outline-none transition placeholder:text-um-text-muted hover:border-black/25 focus:border-um-gold-600 focus:ring-4 focus:ring-um-gold-400/20 disabled:cursor-not-allowed disabled:bg-black/[0.03]"
          disabled={isPending}
          id="confirm-password"
          placeholder="Repeat your password"
          type="password"
          {...register('confirmPassword')}
        />
        {errors.confirmPassword ? (
          <p className="text-sm font-medium text-red-700" id="confirm-password-error">
            {errors.confirmPassword.message}
          </p>
        ) : null}
      </div>

      {serverError ? (
        <div
          aria-live="polite"
          className="border-l-2 border-red-600 bg-red-50/80 px-4 py-3 text-sm font-medium text-red-800"
          role="alert"
        >
          {serverError}
        </div>
      ) : null}

      <button
        className="group flex h-[3.35rem] w-full items-center justify-center gap-3 rounded-sm bg-um-ink-950 px-5 text-sm font-black text-white transition hover:bg-um-ink-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-um-gold-400/45 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isPending}
        type="submit"
      >
        {isPending ? (
          <>
            <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
            Creating account…
          </>
        ) : (
          <>
            Create account
            <ArrowRight
              aria-hidden="true"
              className="size-4 text-um-gold-400 transition-transform group-hover:translate-x-1"
            />
          </>
        )}
      </button>

      <p className="flex flex-wrap items-center justify-center gap-x-1.5 text-center text-sm text-um-text-muted">
        <span>Already have an account?</span>
        <Link
          className="inline-flex min-h-11 items-center font-bold leading-5 text-um-text-strong underline decoration-um-gold-500 decoration-2 underline-offset-4 transition hover:text-um-gold-200 hover:decoration-um-gold-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-um-gold-500"
          href={loginHref}
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
