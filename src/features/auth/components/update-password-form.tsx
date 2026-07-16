'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, LoaderCircle } from 'lucide-react';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';

import { updatePasswordAction } from '../actions';
import { updatePasswordSchema, type UpdatePasswordInput } from '../schemas';

export function UpdatePasswordForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<UpdatePasswordInput>({
    defaultValues: { confirmPassword: '', password: '' },
    resolver: zodResolver(updatePasswordSchema),
  });

  const onSubmit = handleSubmit((values) => {
    setServerError(null);
    startTransition(async () => {
      try {
        const result = await updatePasswordAction(values);
        if (result && !result.ok) setServerError(result.message);
      } catch {
        setServerError('Something went wrong. Request a new recovery link and try again.');
      }
    });
  });

  return (
    <form className="mt-9 space-y-5" noValidate onSubmit={onSubmit}>
      <div className="space-y-2">
        <label className="text-sm font-bold text-[#20221f]" htmlFor="new-password">
          New password
        </label>
        <input
          aria-describedby={errors.password ? 'new-password-error' : 'new-password-hint'}
          aria-invalid={Boolean(errors.password)}
          autoComplete="new-password"
          autoFocus
          className="h-12 w-full rounded-lg border border-black/18 bg-white px-4 text-base text-[#111311] outline-none transition placeholder:text-black/55 hover:border-black/30 focus:border-[#8b6b00] focus:ring-4 focus:ring-[#ffd54f]/30 disabled:cursor-not-allowed disabled:bg-black/[0.03]"
          disabled={isPending}
          id="new-password"
          placeholder="Create a new password"
          type="password"
          {...register('password')}
        />
        {errors.password ? (
          <p className="text-sm font-medium text-red-700" id="new-password-error">
            {errors.password.message}
          </p>
        ) : (
          <p className="text-sm text-black/58" id="new-password-hint">
            Use 8–72 characters with uppercase, lowercase, and a number.
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-[#20221f]" htmlFor="confirm-new-password">
          Confirm new password
        </label>
        <input
          aria-describedby={errors.confirmPassword ? 'confirm-new-password-error' : undefined}
          aria-invalid={Boolean(errors.confirmPassword)}
          autoComplete="new-password"
          className="h-12 w-full rounded-lg border border-black/18 bg-white px-4 text-base text-[#111311] outline-none transition placeholder:text-black/55 hover:border-black/30 focus:border-[#8b6b00] focus:ring-4 focus:ring-[#ffd54f]/30 disabled:cursor-not-allowed disabled:bg-black/[0.03]"
          disabled={isPending}
          id="confirm-new-password"
          placeholder="Repeat your new password"
          type="password"
          {...register('confirmPassword')}
        />
        {errors.confirmPassword ? (
          <p className="text-sm font-medium text-red-700" id="confirm-new-password-error">
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
            Updating…
          </>
        ) : (
          <>
            Save new password
            <ArrowRight aria-hidden="true" className="size-4" />
          </>
        )}
      </button>
    </form>
  );
}
