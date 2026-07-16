import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { SignupForm } from '@/features/auth/components/signup-form';
import { getSafeNextPath } from '@/lib/auth/navigation';
import { getCurrentIdentity, getViewer } from '@/lib/auth/session';

export const metadata: Metadata = {
  title: 'Create account',
  description: 'Create a verified Waterloo student account for UniMarket.',
};

type SignupPageProps = {
  searchParams: Promise<{ next?: string | string[] }>;
};

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const params = await searchParams;
  const requestedNext = Array.isArray(params.next) ? params.next[0] : params.next;
  const nextPath = getSafeNextPath(requestedNext);
  const identity = await getCurrentIdentity();

  if (identity) {
    const viewer = await getViewer();
    if (viewer?.profile.role === 'moderator' || viewer?.profile.onboarding_completed_at) {
      redirect(nextPath);
    }
    redirect(`/onboarding?next=${encodeURIComponent(nextPath)}`);
  }

  return (
    <div>
      <p className="font-mono text-[0.64rem] font-bold uppercase tracking-[0.2em] text-[#856800]">
        Waterloo access · 01
      </p>
      <h1 className="mt-4 text-4xl font-black leading-[1.02] tracking-[-0.05em] text-[#111311] sm:text-[2.75rem]">
        Create your Waterloo account.
      </h1>
      <p className="mt-4 max-w-sm text-base leading-7 text-black/58">
        Join with your Waterloo email and a password. You’ll verify the address once, then use your
        password whenever you return.
      </p>

      <SignupForm nextPath={nextPath} />
    </div>
  );
}
