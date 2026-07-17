'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, LoaderCircle } from 'lucide-react';
import Link from 'next/link';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';

import { requestPasswordResetAction } from '../actions';
import { passwordResetRequestSchema, type PasswordResetRequestInput } from '../schemas';

export function ForgotPasswordForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<PasswordResetRequestInput>({
    defaultValues: { email: '' },
    resolver: zodResolver(passwordResetRequestSchema),
  });

  const onSubmit = handleSubmit((values) => {
    setServerError(null);
    setNotice(null);

    startTransition(async () => {
      try {
        const result = await requestPasswordResetAction(values);
        if (result.ok) setNotice(result.message);
        else setServerError(result.message);
      } catch {
        setServerError('Something went wrong. Check your connection and try again.');
      }
    });
  });

  return (
    <form className="mt-10 space-y-5" noValidate onSubmit={onSubmit}>
      <div className="space-y-2">
        <label className="text-sm font-bold text-um-text-strong" htmlFor="recovery-email">
          Waterloo email
        </label>
        <input
          aria-describedby={errors.email ? 'recovery-email-error' : undefined}
          aria-invalid={Boolean(errors.email)}
          autoComplete="email"
          autoFocus
          className="h-[3.35rem] w-full rounded-sm border border-black/[0.12] bg-um-surface px-4 text-base text-um-text-strong outline-none transition placeholder:text-um-text-muted hover:border-black/25 focus:border-um-gold-600 focus:ring-4 focus:ring-um-gold-400/20 disabled:cursor-not-allowed disabled:bg-black/[0.03]"
          disabled={isPending}
          id="recovery-email"
          inputMode="email"
          placeholder="yourname@uwaterloo.ca"
          type="email"
          {...register('email')}
        />
        {errors.email ? (
          <p className="text-sm font-medium text-red-700" id="recovery-email-error">
            {errors.email.message}
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

      {notice ? (
        <div
          aria-live="polite"
          className="border-l-2 border-emerald-700 bg-emerald-50/80 px-4 py-3 text-sm font-medium text-emerald-900"
          role="status"
        >
          {notice}
        </div>
      ) : null}

      <button
        className="flex h-[3.35rem] w-full items-center justify-center gap-3 rounded-sm bg-um-ink-950 px-5 text-sm font-black text-white transition hover:bg-um-ink-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-um-gold-400/45 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isPending}
        type="submit"
      >
        {isPending ? (
          <>
            <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
            Sending…
          </>
        ) : (
          'Send recovery email'
        )}
      </button>

      <Link
        className="mx-auto flex min-h-11 w-fit items-center gap-1.5 px-2 text-sm font-semibold text-um-text-muted transition hover:text-um-text-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-um-gold-500"
        href="/login"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        Back to sign in
      </Link>
    </form>
  );
}
