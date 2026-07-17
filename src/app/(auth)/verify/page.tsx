import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { EmailVerificationStatus } from '@/features/auth/components/email-verification-status';
import { waterlooEmailSchema } from '@/features/auth/schemas';
import { getSafeNextPath } from '@/lib/auth/navigation';

export const metadata: Metadata = {
  title: 'Check your email',
  description: 'Verify your Waterloo email to continue to UniMarket.',
};

type VerifyPageProps = {
  searchParams: Promise<{
    email?: string | string[];
    next?: string | string[];
  }>;
};

export default async function VerifyPage({ searchParams }: VerifyPageProps) {
  const params = await searchParams;
  const rawEmail = Array.isArray(params.email) ? params.email[0] : params.email;
  const parsedEmail = waterlooEmailSchema.safeParse(rawEmail);

  if (!parsedEmail.success) redirect('/signup');

  const requestedNext = Array.isArray(params.next) ? params.next[0] : params.next;
  const nextPath = getSafeNextPath(requestedNext);

  return (
    <div>
      <p className="text-sm font-semibold tracking-[0.02em] text-um-gold-700">
        02 / Waterloo access · Verification
      </p>
      <h1
        aria-label="Verify your Waterloo email"
        className="mt-5 text-[clamp(2.6rem,5.5vw,3.75rem)] font-bold leading-[1.02] tracking-[-0.028em] text-um-text-strong"
      >
        Check your Waterloo
        <span className="block text-um-gold-600">inbox.</span>
      </h1>
      <p className="mt-5 text-lg font-semibold tracking-[-0.02em] text-um-text">
        Your campus is one click away.
      </p>
      <p className="mt-3 text-sm leading-6 text-um-text">
        We sent a one-time verification link to{' '}
        <span className="font-bold text-um-text-strong">{parsedEmail.data}</span>.
      </p>

      <EmailVerificationStatus email={parsedEmail.data} nextPath={nextPath} />
    </div>
  );
}
