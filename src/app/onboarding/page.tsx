import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';

import { SignOutButton } from '@/features/auth/components/sign-out-button';
import { WaterlooCampaignPanel } from '@/features/auth/components/waterloo-campaign-panel';
import { OnboardingForm } from '@/features/onboarding/components/onboarding-form';
import { ACADEMIC_YEARS, type OnboardingInput } from '@/features/onboarding/schemas';
import { getSafeNextPath } from '@/lib/auth/navigation';
import { getCurrentIdentity, getViewer } from '@/lib/auth/session';

export const metadata: Metadata = {
  title: 'Set up your profile',
  description: 'Complete your private Waterloo student profile.',
};

type OnboardingPageProps = {
  searchParams: Promise<{ next?: string | string[] }>;
};

function knownAcademicYear(value: string | null) {
  return ACADEMIC_YEARS.find((year) => year === value);
}

export default async function OnboardingPage({ searchParams }: OnboardingPageProps) {
  const params = await searchParams;
  const requestedNext = Array.isArray(params.next) ? params.next[0] : params.next;
  const nextPath = getSafeNextPath(requestedNext);
  const identity = await getCurrentIdentity();

  if (!identity) {
    redirect(`/login?next=${encodeURIComponent(nextPath)}`);
  }

  const viewer = await getViewer();

  if (!viewer) {
    return (
      <OnboardingFrame action={<SignOutButton />}>
        <div className="border-l-2 border-red-600 bg-red-50 px-6 py-6">
          <p className="font-mono text-[0.62rem] font-bold uppercase tracking-[0.18em] text-red-700">
            Profile service unavailable
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-[-0.04em] text-[#111311]">
            We couldn’t prepare your profile.
          </h1>
          <p className="mt-3 max-w-lg leading-7 text-black/58">
            We verified your email but couldn’t prepare your profile. Sign out, then try again.
          </p>
        </div>
      </OnboardingFrame>
    );
  }

  if (viewer.profile.role === 'moderator' || viewer.profile.onboarding_completed_at) {
    redirect(nextPath);
  }

  const initialValues: Partial<OnboardingInput> = {
    academicYear: knownAcademicYear(viewer.profile.academic_year),
    fullName: viewer.profile.full_name ?? '',
    program: viewer.profile.program ?? '',
    residenceArea: viewer.profile.residence_area ?? '',
  };

  return (
    <OnboardingFrame action={<SignOutButton />}>
      <section>
        <p className="font-mono text-[0.64rem] font-bold uppercase tracking-[0.2em] text-[#856800]">
          Verified · One last step
        </p>
        <h1 className="mt-4 text-4xl font-black leading-[0.98] tracking-[-0.055em] text-[#111311] sm:text-5xl">
          Welcome, Warrior.
        </h1>
        <p className="mt-5 max-w-xl text-base leading-7 text-black/58">
          Add a few details so Waterloo students know who they’re dealing with. Your exact address
          is never requested or shown.
        </p>

        <div className="mt-7 border-l-2 border-[#d0a100] bg-[#fff8d9] px-4 py-3">
          <p className="text-sm font-bold text-[#3f3300]">Private by default</p>
          <p className="mt-1 text-sm leading-6 text-[#574a13]">
            Your optional residence area stays private. Listings use a separate broad pickup area.
          </p>
        </div>

        <OnboardingForm email={viewer.email} initialValues={initialValues} nextPath={nextPath} />
      </section>
    </OnboardingFrame>
  );
}

function OnboardingFrame({ action, children }: { action?: ReactNode; children: ReactNode }) {
  return (
    <main className="min-h-screen bg-[#f4f1e9] text-[#111311]">
      <div className="mx-auto grid min-h-screen max-w-[1600px] lg:grid-cols-[minmax(28rem,0.88fr)_minmax(38rem,1.12fr)]">
        <WaterlooCampaignPanel />

        <div className="flex min-h-screen flex-col bg-[#f4f1e9]">
          <WaterlooCampaignPanel compact className="lg:hidden" />

          <div className="flex items-center justify-between border-b border-black/10 px-5 py-3 sm:px-10 lg:hidden">
            <p className="font-mono text-[0.58rem] uppercase tracking-[0.16em] text-black/55">
              Profile setup · 01/01
            </p>
            {action}
          </div>

          <div className="flex-1 px-5 py-8 sm:px-10 sm:py-10 lg:px-14 lg:py-12 xl:px-20">
            <header className="mx-auto mb-10 hidden max-w-2xl items-center justify-between border-b border-black/10 pb-4 lg:flex">
              <p className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-black/55">
                Profile setup · 01/01
              </p>
              {action}
            </header>

            <div className="mx-auto max-w-2xl">{children}</div>
          </div>

          <footer className="mx-5 mb-6 flex items-center justify-between border-t border-black/10 pt-4 font-mono text-[0.58rem] uppercase tracking-[0.15em] text-black/55 sm:mx-10 lg:hidden">
            <span>Verified Waterloo access</span>
            <span>DC · SLC · E7</span>
          </footer>
        </div>
      </div>
    </main>
  );
}
