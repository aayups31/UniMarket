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
    <form className="mt-9 space-y-5" noValidate onSubmit={onSubmit}>
      <input type="hidden" {...register('next')} />

      <div className="space-y-2">
        <label className="text-sm font-bold text-[#20221f]" htmlFor="signup-email">
          Waterloo email
        </label>
        <input
          aria-describedby={errors.email ? 'signup-email-error' : 'signup-email-hint'}
          aria-invalid={Boolean(errors.email)}
          autoComplete="email"
          autoFocus
          className="h-12 w-full rounded-lg border border-black/18 bg-white px-4 text-base text-[#111311] outline-none transition placeholder:text-black/55 hover:border-black/30 focus:border-[#8b6b00] focus:ring-4 focus:ring-[#ffd54f]/30 disabled:cursor-not-allowed disabled:bg-black/[0.03]"
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
          <p className="text-sm text-black/58" id="signup-email-hint">
            Only verified @uwaterloo.ca students can join.
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-[#20221f]" htmlFor="signup-password">
          Password
        </label>
        <input
          aria-describedby={errors.password ? 'signup-password-error' : 'signup-password-hint'}
          aria-invalid={Boolean(errors.password)}
          autoComplete="new-password"
          className="h-12 w-full rounded-lg border border-black/18 bg-white px-4 text-base text-[#111311] outline-none transition placeholder:text-black/55 hover:border-black/30 focus:border-[#8b6b00] focus:ring-4 focus:ring-[#ffd54f]/30 disabled:cursor-not-allowed disabled:bg-black/[0.03]"
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
          <p className="text-sm text-black/58" id="signup-password-hint">
            Use 8–72 characters with uppercase, lowercase, and a number.
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-[#20221f]" htmlFor="confirm-password">
          Confirm password
        </label>
        <input
          aria-describedby={errors.confirmPassword ? 'confirm-password-error' : undefined}
          aria-invalid={Boolean(errors.confirmPassword)}
          autoComplete="new-password"
          className="h-12 w-full rounded-lg border border-black/18 bg-white px-4 text-base text-[#111311] outline-none transition placeholder:text-black/55 hover:border-black/30 focus:border-[#8b6b00] focus:ring-4 focus:ring-[#ffd54f]/30 disabled:cursor-not-allowed disabled:bg-black/[0.03]"
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
          className="border-l-2 border-red-600 bg-red-50 px-4 py-3 text-sm font-medium text-red-800"
          role="alert"
        >
          {serverError}
        </div>
      ) : null}

      <button
        className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#111311] px-5 text-sm font-bold text-white transition hover:bg-black focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#ffd54f]/70 disabled:cursor-not-allowed disabled:opacity-60"
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
            <ArrowRight aria-hidden="true" className="size-4" />
          </>
        )}
      </button>

      <p className="text-center text-sm text-black/55">
        Already have an account?{' '}
        <Link
          className="-my-3 inline-flex min-h-11 items-center align-middle font-bold text-[#111311] underline decoration-[#d7a900] decoration-2 underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d7a900]"
          href={loginHref}
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
