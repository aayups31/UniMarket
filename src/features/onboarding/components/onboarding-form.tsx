'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, BadgeCheck, LoaderCircle } from 'lucide-react';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';

import { completeOnboardingAction } from '../actions';
import {
  ACADEMIC_YEARS,
  RESIDENCE_AREAS,
  onboardingSchema,
  type OnboardingInput,
} from '../schemas';

type OnboardingFormProps = {
  email: string;
  initialValues?: Partial<OnboardingInput>;
  nextPath: string;
};

const inputClassName =
  'mt-2 h-[3.25rem] w-full rounded-[0.8rem] border border-black/[0.11] bg-white/55 px-4 text-[0.95rem] text-um-text-strong outline-none transition placeholder:text-black/32 hover:border-black/20 hover:bg-white/72 focus:border-[#a17800] focus:bg-white focus:ring-4 focus:ring-um-gold-400/15 disabled:cursor-not-allowed disabled:text-um-text-muted';

export function OnboardingForm({ email, initialValues, nextPath }: OnboardingFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<OnboardingInput>({
    defaultValues: {
      academicYear: initialValues?.academicYear,
      fullName: initialValues?.fullName ?? '',
      next: nextPath,
      program: initialValues?.program ?? '',
      residenceArea: initialValues?.residenceArea ?? '',
    },
    resolver: zodResolver(onboardingSchema),
  });

  const onSubmit = handleSubmit((values) => {
    setServerError(null);
    startTransition(async () => {
      try {
        const result = await completeOnboardingAction(values);
        if (result && !result.ok) setServerError(result.message);
      } catch {
        setServerError('Something went wrong. Check your connection and try again.');
      }
    });
  });

  return (
    <form className="mt-8 space-y-7" noValidate onSubmit={onSubmit}>
      <input type="hidden" {...register('next')} />

      <div className="grid gap-x-4 gap-y-5 sm:grid-cols-2">
        <div className="rounded-[1rem] bg-[#11161d] px-4 py-3.5 text-white shadow-um-sm sm:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <label
              className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-white/42"
              htmlFor="email"
            >
              Waterloo account
            </label>
            <p className="flex items-center gap-1.5 text-[0.64rem] font-semibold uppercase tracking-[0.12em] text-[#77d4a7]">
              <BadgeCheck aria-hidden="true" className="size-3.5" />
              Verified
            </p>
          </div>
          <input
            className="mt-1.5 w-full border-0 bg-transparent p-0 text-sm font-medium text-white/76 outline-none"
            disabled
            id="email"
            type="email"
            value={email}
          />
        </div>

        <div className="sm:col-span-2">
          <label className="text-[0.78rem] font-semibold text-um-text-strong" htmlFor="full-name">
            Full name
          </label>
          <input
            aria-describedby={errors.fullName ? 'name-error' : undefined}
            aria-invalid={Boolean(errors.fullName)}
            autoComplete="name"
            className={inputClassName}
            disabled={isPending}
            id="full-name"
            placeholder="Your first and last name"
            type="text"
            {...register('fullName')}
          />
          {errors.fullName ? (
            <p className="mt-1.5 text-sm font-medium text-red-700" id="name-error">
              {errors.fullName.message}
            </p>
          ) : null}
        </div>

        <div>
          <label className="text-[0.78rem] font-semibold text-um-text-strong" htmlFor="program">
            Program
          </label>
          <input
            aria-describedby={errors.program ? 'program-error' : undefined}
            aria-invalid={Boolean(errors.program)}
            autoComplete="organization-title"
            className={inputClassName}
            disabled={isPending}
            id="program"
            placeholder="e.g. Computer Science"
            type="text"
            {...register('program')}
          />
          {errors.program ? (
            <p className="mt-1.5 text-sm font-medium text-red-700" id="program-error">
              {errors.program.message}
            </p>
          ) : null}
        </div>

        <div>
          <label className="text-[0.78rem] font-semibold text-um-text-strong" htmlFor="year">
            Academic year
          </label>
          <select
            aria-describedby={errors.academicYear ? 'year-error' : undefined}
            aria-invalid={Boolean(errors.academicYear)}
            className={inputClassName}
            disabled={isPending}
            id="year"
            {...register('academicYear')}
          >
            <option value="">Select year</option>
            {ACADEMIC_YEARS.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          {errors.academicYear ? (
            <p className="mt-1.5 text-sm font-medium text-red-700" id="year-error">
              {errors.academicYear.message}
            </p>
          ) : null}
        </div>

        <div className="sm:col-span-2">
          <label
            className="text-[0.78rem] font-semibold text-um-text-strong"
            htmlFor="residence-area"
          >
            Residence or area <span className="font-normal text-black/42">Optional</span>
          </label>
          <select
            aria-describedby="residence-hint"
            className={inputClassName}
            disabled={isPending}
            id="residence-area"
            {...register('residenceArea')}
          >
            <option value="">Prefer not to say</option>
            {RESIDENCE_AREAS.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
          <p className="mt-1.5 text-xs leading-5 text-black/42" id="residence-hint">
            Private by default. Listings use their own pickup location.
          </p>
        </div>
      </div>

      {serverError ? (
        <div
          aria-live="polite"
          className="border-l-2 border-red-600 bg-red-50/70 px-4 py-3 text-sm font-medium text-red-800"
          role="alert"
        >
          {serverError}
        </div>
      ) : null}

      <div className="border-t border-black/10 pt-5 sm:flex sm:items-center sm:justify-between sm:gap-6">
        <p className="mb-4 max-w-xs text-xs leading-5 text-black/42 sm:mb-0">
          Your profile can be edited later.
        </p>
        <button
          className="group flex h-[3.2rem] w-full shrink-0 items-center justify-center gap-2 rounded-full bg-um-ink-950 px-6 text-sm font-bold text-white shadow-um-sm transition hover:-translate-y-0.5 hover:bg-[#1a2028] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-um-gold-400/40 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          disabled={isPending}
          type="submit"
        >
          {isPending ? (
            <>
              <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
              Saving profile…
            </>
          ) : (
            <>
              Enter the marketplace
              <ArrowRight
                aria-hidden="true"
                className="size-4 text-um-gold-300 transition-transform group-hover:translate-x-0.5"
              />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
