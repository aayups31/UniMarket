import type { ReactNode } from 'react';

import { WaterlooCampaignPanel } from '@/features/auth/components/waterloo-campaign-panel';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-[#f4f1e9] text-[#111311]">
      <div className="mx-auto grid min-h-screen max-w-[1600px] lg:grid-cols-[minmax(28rem,0.92fr)_minmax(32rem,1.08fr)]">
        <WaterlooCampaignPanel />

        <div className="flex min-h-screen flex-col bg-[#f4f1e9]">
          <WaterlooCampaignPanel compact className="lg:hidden" />

          <section className="flex flex-1 flex-col px-5 py-9 sm:px-10 sm:py-12 lg:px-16 lg:py-14 xl:px-24">
            <div className="mx-auto flex w-full max-w-md flex-1 items-center py-4 lg:py-10">
              <div className="w-full">{children}</div>
            </div>

            <footer className="mx-auto mt-8 flex w-full max-w-md items-center justify-between border-t border-black/10 pt-4 font-mono text-[0.58rem] uppercase tracking-[0.15em] text-black/55 lg:hidden">
              <span>Verified Waterloo access</span>
              <span>DC · SLC · E7</span>
            </footer>
          </section>
        </div>
      </div>
    </main>
  );
}
