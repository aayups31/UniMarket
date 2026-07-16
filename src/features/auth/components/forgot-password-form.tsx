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
    <form className="mt-9 space-y-5" noValidate onSubmit={onSubmit}>
      <div className="space-y-2">
        <label className="text-sm font-bold text-[#20221f]" htmlFor="recovery-email">
          Waterloo email
        </label>
        <input
          aria-describedby={errors.email ? 'recovery-email-error' : undefined}
          aria-invalid={Boolean(errors.email)}
          autoComplete="email"
          autoFocus
          className="h-12 w-full rounded-lg border border-black/18 bg-white px-4 text-base text-[#111311] outline-none transition placeholder:text-black/55 hover:border-black/30 focus:border-[#8b6b00] focus:ring-4 focus:ring-[#ffd54f]/30 disabled:cursor-not-allowed disabled:bg-black/[0.03]"
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
          className="border-l-2 border-red-600 bg-red-50 px-4 py-3 text-sm font-medium text-red-800"
          role="alert"
        >
          {serverError}
        </div>
      ) : null}

      {notice ? (
        <div
          aria-live="polite"
          className="border-l-2 border-emerald-700 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-900"
          role="status"
        >
          {notice}
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
            Sending…
          </>
        ) : (
          'Send recovery email'
        )}
      </button>

      <Link
        className="mx-auto flex min-h-11 w-fit items-center gap-1.5 px-2 text-sm font-semibold text-black/55 transition hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d7a900]"
        href="/login"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        Back to sign in
      </Link>
    </form>
  );
}
