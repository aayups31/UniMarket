import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { UpdatePasswordForm } from '@/features/auth/components/update-password-form';
import { getCurrentIdentity } from '@/lib/auth/session';

export const metadata: Metadata = {
  title: 'Choose a new password',
  description: 'Set a new password for your UniMarket account.',
};

export default async function UpdatePasswordPage() {
  const identity = await getCurrentIdentity();
  if (!identity) redirect('/forgot-password');

  return (
    <div>
      <p className="font-mono text-[0.64rem] font-bold uppercase tracking-[0.2em] text-emerald-800">
        Recovery link verified
      </p>
      <h1 className="mt-4 text-4xl font-black leading-[1.02] tracking-[-0.05em] text-[#111311] sm:text-[2.75rem]">
        Choose a new password.
      </h1>
      <p className="mt-4 max-w-sm text-base leading-7 text-black/58">
        This updates the password for{' '}
        <span className="font-bold text-black/80">{identity.email}</span> and returns you to sign
        in.
      </p>

      <UpdatePasswordForm />
    </div>
  );
}
