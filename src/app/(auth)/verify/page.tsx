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
      <p className="font-mono text-[0.64rem] font-bold uppercase tracking-[0.2em] text-[#856800]">
        Waterloo access · Verification
      </p>
      <h1
        aria-label="Verify your Waterloo email"
        className="mt-4 text-4xl font-black leading-[1.02] tracking-[-0.05em] text-[#111311] sm:text-[2.75rem]"
      >
        Check your Waterloo inbox.
      </h1>
      <p className="mt-4 text-lg font-semibold tracking-[-0.02em] text-black/78">
        Your campus is one click away.
      </p>
      <p className="mt-3 text-sm leading-6 text-black/55">
        We sent a one-time verification link to{' '}
        <span className="font-bold">{parsedEmail.data}</span>.
      </p>

      <EmailVerificationStatus email={parsedEmail.data} nextPath={nextPath} />
    </div>
  );
}
