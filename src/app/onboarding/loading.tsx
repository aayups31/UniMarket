import { WaterlooCampaignPanel } from '@/features/auth/components/waterloo-campaign-panel';

export default function OnboardingLoading() {
  return (
    <main className="min-h-screen bg-[#f4f1e9] text-[#111311]">
      <div className="mx-auto grid min-h-screen max-w-[1600px] lg:grid-cols-[minmax(28rem,0.88fr)_minmax(38rem,1.12fr)]">
        <WaterlooCampaignPanel />
        <div className="min-h-screen bg-[#f4f1e9]">
          <WaterlooCampaignPanel compact className="lg:hidden" />
          <div
            aria-label="Loading profile setup"
            className="mx-auto max-w-2xl animate-pulse px-5 py-12 sm:px-10 lg:px-14 lg:py-24"
            role="status"
          >
            <div className="h-3 w-40 bg-black/10" />
            <div className="mt-5 h-12 w-3/5 bg-black/10" />
            <div className="mt-5 h-5 w-full bg-black/[0.07]" />
            <div className="mt-2 h-5 w-4/5 bg-black/[0.07]" />
            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              <div className="h-12 rounded-lg bg-black/10 sm:col-span-2" />
              <div className="h-12 rounded-lg bg-black/10 sm:col-span-2" />
              <div className="h-12 rounded-lg bg-black/10" />
              <div className="h-12 rounded-lg bg-black/10" />
              <div className="h-12 rounded-lg bg-black/10 sm:col-span-2" />
            </div>
            <span className="sr-only">Loading profile setup…</span>
          </div>
        </div>
      </div>
    </main>
  );
}
