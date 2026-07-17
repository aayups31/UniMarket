'use client';

import { CircleAlert, RotateCcw } from 'lucide-react';

import { WaterlooCampaignPanel } from '@/features/auth/components/waterloo-campaign-panel';

export default function OnboardingError({ reset }: { reset: () => void }) {
  return (
    <main className="min-h-screen bg-um-surface-warm text-um-text-strong">
      <div className="mx-auto grid min-h-screen max-w-[1600px] lg:grid-cols-[minmax(28rem,0.88fr)_minmax(38rem,1.12fr)]">
        <WaterlooCampaignPanel />
        <div className="flex min-h-screen flex-col bg-um-surface-warm">
          <WaterlooCampaignPanel compact className="lg:hidden" />
          <div className="grid flex-1 place-items-center px-5 py-12 sm:px-10 lg:px-14">
            <div className="w-full max-w-lg border-l-2 border-red-600 py-2 pl-6 sm:pl-8">
              <CircleAlert aria-hidden="true" className="size-6 text-red-700" />
              <p className="mt-5 font-condensed text-[0.68rem] font-bold uppercase tracking-[0.18em] text-red-700">
                Profile service unavailable
              </p>
              <h1 className="mt-3 text-3xl font-black tracking-[-0.04em] text-um-text-strong">
                We couldn’t load profile setup.
              </h1>
              <p className="mt-3 leading-7 text-um-text-muted">
                This is usually temporary. Try loading your verified profile again.
              </p>
              <button
                className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-um-sm bg-um-ink-950 px-5 text-sm font-bold text-white transition hover:bg-um-ink-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-um-gold-400/50"
                onClick={reset}
                type="button"
              >
                <RotateCcw aria-hidden="true" className="size-4" />
                Try again
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
