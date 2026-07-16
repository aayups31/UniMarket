import type { Metadata } from 'next';

import { ForgotPasswordForm } from '@/features/auth/components/forgot-password-form';

export const metadata: Metadata = {
  title: 'Recover password',
  description: 'Request a password recovery email for UniMarket.',
};

type ForgotPasswordPageProps = {
  searchParams: Promise<{ error?: string | string[] }>;
};

export default async function ForgotPasswordPage({ searchParams }: ForgotPasswordPageProps) {
  const params = await searchParams;
  const requestedError = Array.isArray(params.error) ? params.error[0] : params.error;

  return (
    <div>
      <p className="font-mono text-[0.64rem] font-bold uppercase tracking-[0.2em] text-[#856800]">
        Waterloo access · Recovery
      </p>
      <h1
        aria-label="Reset your password"
        className="mt-4 text-4xl font-black leading-[1.02] tracking-[-0.05em] text-[#111311] sm:text-[2.75rem]"
      >
        Reset your password.
      </h1>
      <p className="mt-4 max-w-sm text-base leading-7 text-black/58">
        We’ll email a private recovery link if the address belongs to an eligible account.
      </p>

      {requestedError === 'invalid-link' ? (
        <div
          className="mt-6 border-l-2 border-red-600 bg-red-50 px-4 py-3 text-sm font-medium text-red-800"
          role="alert"
        >
          That recovery link is invalid or expired. Request a new one below.
        </div>
      ) : null}

      <ForgotPasswordForm />
    </div>
  );
}
