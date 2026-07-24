import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';

import { CampusRouteGraphic } from '@/components/ui/CampusRouteGraphic';
import { SignOutButton } from '@/features/auth/components/sign-out-button';
import { WaterlooCampaignPanel } from '@/features/auth/components/waterloo-campaign-panel';
import { OnboardingForm } from '@/features/onboarding/components/onboarding-form';
import { ACADEMIC_YEARS, type OnboardingInput } from '@/features/onboarding/schemas';
import { getSafeNextPath } from '@/lib/auth/navigation';
import { getCurrentIdentity, getViewer } from '@/lib/auth/session';

export const metadata: Metadata = {
  title: 'Set up your profile',
  description: 'Complete your private Waterloo student profile.',
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nocache: true,
  },
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
        <div className="border-l-2 border-red-600 py-2 pl-6">
          <p className="font-condensed text-[0.68rem] font-bold uppercase tracking-[0.18em] text-red-700">
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
      <section className="relative">
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <span aria-hidden="true" className="h-px w-10 bg-um-gold-500" />
            <p className="font-condensed text-[0.68rem] font-bold uppercase tracking-[0.2em] text-um-gold-700">
              Verified / One last step
            </p>
          </div>
          <h1 className="font-editorial mt-5 text-5xl leading-[0.94] tracking-[-0.045em] text-um-text-strong sm:text-6xl">
            Welcome, Warrior.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-um-text-muted">
            Give Waterloo students enough context to trade with confidence. We never ask for your
            exact address.
          </p>

          <div className="mt-8 grid border-y border-black/[0.09] py-4 sm:grid-cols-[9rem_1fr] sm:gap-5">
            <p className="font-condensed text-xs font-bold uppercase tracking-[0.15em] text-um-gold-700">
              Private by default
            </p>
            <p className="mt-1 text-sm leading-6 text-um-text sm:mt-0">
              Your optional residence area stays private. Every listing uses a separate, broad
              pickup area.
            </p>
          </div>

          <OnboardingForm email={viewer.email} initialValues={initialValues} nextPath={nextPath} />
        </div>
      </section>
    </OnboardingFrame>
  );
}

function OnboardingFrame({ action, children }: { action?: ReactNode; children: ReactNode }) {
  return (
    <main className="min-h-screen bg-um-surface-warm text-um-text-strong">
      <div className="mx-auto grid min-h-screen max-w-[1600px] lg:grid-cols-[minmax(28rem,0.88fr)_minmax(38rem,1.12fr)]">
        <WaterlooCampaignPanel />

        <div className="relative flex min-h-screen flex-col overflow-hidden bg-um-surface-warm">
          <CampusRouteGraphic
            className="pointer-events-none absolute -right-36 top-10 h-72 w-[34rem] opacity-[0.045]"
            tone="light"
          />
          <WaterlooCampaignPanel compact className="lg:hidden" />

          <div className="flex items-center justify-between border-b border-black/10 px-5 py-3 sm:px-10 lg:hidden">
            <p className="font-condensed text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-um-text-muted">
              Profile setup / 01—01
            </p>
            {action}
          </div>

          <div className="flex-1 px-5 py-8 sm:px-10 sm:py-10 lg:px-14 lg:py-12 xl:px-20">
            <header className="relative z-10 mx-auto mb-10 hidden max-w-2xl items-center justify-between border-b border-black/10 pb-4 lg:flex">
              <p className="font-condensed text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-um-text-muted">
                Profile setup / 01—01
              </p>
              {action}
            </header>

            <div className="relative z-10 mx-auto max-w-2xl">{children}</div>
          </div>

          <footer className="mx-5 mb-6 flex items-center justify-between border-t border-black/10 pt-4 font-condensed text-[0.64rem] font-semibold uppercase tracking-[0.15em] text-um-text-muted sm:mx-10 lg:hidden">
            <span>Verified Waterloo access</span>
            <span>DC · SLC · E7</span>
          </footer>
        </div>
      </div>
    </main>
  );
}
