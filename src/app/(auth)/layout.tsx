import type { ReactNode } from 'react';

import { WaterlooCampaignPanel } from '@/features/auth/components/waterloo-campaign-panel';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="um-auth-dark min-h-screen bg-um-ink-950 text-um-text-strong">
      <div className="mx-auto grid min-h-screen max-w-[112rem] lg:grid-cols-[minmax(28rem,0.94fr)_minmax(32rem,1.06fr)]">
        <WaterlooCampaignPanel />

        <div className="um-ink-canvas relative flex min-h-screen flex-col overflow-hidden">
          <WaterlooCampaignPanel compact className="lg:hidden" />

          <section className="relative flex flex-1 flex-col px-5 py-9 sm:px-10 sm:py-12 lg:px-16 lg:py-14 xl:px-24">
            <div className="mx-auto hidden w-full max-w-lg items-center justify-between border-b border-white/[0.08] pb-4 lg:flex">
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-um-gold-700">
                Verified Waterloo access
              </p>
              <p className="text-xs font-medium text-um-text-muted">Private marketplace</p>
            </div>

            <div className="mx-auto flex w-full max-w-lg flex-1 items-center py-5 lg:py-10">
              <div className="um-fade-up w-full">{children}</div>
            </div>

            <footer className="mx-auto mt-8 flex w-full max-w-lg items-center justify-between border-t border-white/[0.08] pt-4 text-xs text-um-text-muted">
              <span>Verified Waterloo access</span>
              <span>DC · SLC · E7</span>
            </footer>
          </section>
        </div>
      </div>
    </main>
  );
}
