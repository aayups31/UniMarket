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
  'h-12 w-full rounded-lg border border-black/18 bg-white px-4 text-base text-[#111311] outline-none transition placeholder:text-black/55 hover:border-black/30 focus:border-[#8b6b00] focus:ring-4 focus:ring-[#ffd54f]/30 disabled:cursor-not-allowed disabled:bg-black/[0.03]';

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
    <form className="mt-9 space-y-7" noValidate onSubmit={onSubmit}>
      <input type="hidden" {...register('next')} />

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <label className="text-sm font-bold text-[#20221f]" htmlFor="email">
            University email
          </label>
          <input
            className={`${inputClassName} font-medium text-black/55`}
            disabled
            id="email"
            type="email"
            value={email}
          />
          <p className="flex items-center gap-1.5 font-mono text-[0.62rem] font-bold uppercase tracking-[0.14em] text-emerald-800">
            <BadgeCheck aria-hidden="true" className="size-3.5" />
            Verified Waterloo account
          </p>
        </div>

        <div className="space-y-2 sm:col-span-2">
          <label className="text-sm font-bold text-[#20221f]" htmlFor="full-name">
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
            <p className="text-sm font-medium text-red-700" id="name-error">
              {errors.fullName.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-[#20221f]" htmlFor="program">
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
            <p className="text-sm font-medium text-red-700" id="program-error">
              {errors.program.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-[#20221f]" htmlFor="year">
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
            <p className="text-sm font-medium text-red-700" id="year-error">
              {errors.academicYear.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-2 sm:col-span-2">
          <label className="text-sm font-bold text-[#20221f]" htmlFor="residence-area">
            Residence or area <span className="font-normal text-black/55">(optional)</span>
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
          <p className="text-xs leading-5 text-black/58" id="residence-hint">
            This stays private. Sellers choose a separate, broad pickup area for each listing.
          </p>
        </div>
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
            Saving profile…
          </>
        ) : (
          <>
            Enter the marketplace
            <ArrowRight aria-hidden="true" className="size-4" />
          </>
        )}
      </button>
    </form>
  );
}
