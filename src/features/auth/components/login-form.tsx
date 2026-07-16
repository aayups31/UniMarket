'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, LoaderCircle } from 'lucide-react';
import Link from 'next/link';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';

import { loginAction } from '../actions';
import { loginSchema, type LoginInput } from '../schemas';

type LoginFormProps = {
  nextPath: string;
};

export function LoginForm({ nextPath }: LoginFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<LoginInput>({
    defaultValues: { email: '', next: nextPath, password: '' },
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = handleSubmit((values) => {
    setServerError(null);

    startTransition(async () => {
      try {
        const result = await loginAction(values);
        if (result && !result.ok) setServerError(result.message);
      } catch {
        setServerError('Something went wrong. Check your connection and try again.');
      }
    });
  });

  const signupHref =
    nextPath === '/marketplace' ? '/signup' : `/signup?next=${encodeURIComponent(nextPath)}`;

  return (
    <form className="mt-9 space-y-5" noValidate onSubmit={onSubmit}>
      <input type="hidden" {...register('next')} />

      <div className="space-y-2">
        <label className="text-sm font-bold text-[#20221f]" htmlFor="login-email">
          Email
        </label>
        <input
          aria-describedby={errors.email ? 'login-email-error' : undefined}
          aria-invalid={Boolean(errors.email)}
          autoComplete="email"
          autoFocus
          className="h-12 w-full rounded-lg border border-black/18 bg-white px-4 text-base text-[#111311] outline-none transition placeholder:text-black/55 hover:border-black/30 focus:border-[#8b6b00] focus:ring-4 focus:ring-[#ffd54f]/30 disabled:cursor-not-allowed disabled:bg-black/[0.03]"
          disabled={isPending}
          id="login-email"
          inputMode="email"
          placeholder="yourname@uwaterloo.ca"
          type="email"
          {...register('email')}
        />
        {errors.email ? (
          <p className="text-sm font-medium text-red-700" id="login-email-error">
            {errors.email.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <label className="text-sm font-bold text-[#20221f]" htmlFor="login-password">
            Password
          </label>
          <Link
            className="-my-3 inline-flex min-h-11 items-center text-xs font-bold text-[#725900] underline decoration-[#d7a900] underline-offset-4 transition hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d7a900]"
            href="/forgot-password"
          >
            Forgot password?
          </Link>
        </div>
        <input
          aria-describedby={errors.password ? 'login-password-error' : undefined}
          aria-invalid={Boolean(errors.password)}
          autoComplete="current-password"
          className="h-12 w-full rounded-lg border border-black/18 bg-white px-4 text-base text-[#111311] outline-none transition placeholder:text-black/55 hover:border-black/30 focus:border-[#8b6b00] focus:ring-4 focus:ring-[#ffd54f]/30 disabled:cursor-not-allowed disabled:bg-black/[0.03]"
          disabled={isPending}
          id="login-password"
          placeholder="Your password"
          type="password"
          {...register('password')}
        />
        {errors.password ? (
          <p className="text-sm font-medium text-red-700" id="login-password-error">
            {errors.password.message}
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
            Signing in…
          </>
        ) : (
          <>
            Sign in
            <ArrowRight aria-hidden="true" className="size-4" />
          </>
        )}
      </button>

      <p className="text-center text-sm text-black/55">
        New to UniMarket?{' '}
        <Link
          className="-my-3 inline-flex min-h-11 items-center align-middle font-bold text-[#111311] underline decoration-[#d7a900] decoration-2 underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d7a900]"
          href={signupHref}
        >
          Create an account
        </Link>
      </p>
    </form>
  );
}
