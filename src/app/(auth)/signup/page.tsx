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
      <p className="text-sm font-semibold tracking-[0.02em] text-um-gold-700">
        01 / Waterloo access
      </p>
      <h1 className="mt-5 text-[clamp(2.6rem,5.5vw,3.75rem)] font-bold leading-[1.02] tracking-[-0.028em] text-um-text-strong">
        Your Waterloo
        <span className="block text-um-gold-600">marketplace.</span>
      </h1>
      <p className="mt-5 max-w-md text-base leading-7 text-um-text">
        Join with your Waterloo email and a password. You’ll verify the address once, then use your
        password whenever you return.
      </p>

      <SignupForm nextPath={nextPath} />
    </div>
  );
}
