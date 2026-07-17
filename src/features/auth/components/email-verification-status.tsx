'use client';

import { ArrowLeft, RotateCw } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState, useTransition } from 'react';

import { resendSignupAction } from '../actions';

type EmailVerificationStatusProps = {
  email: string;
  nextPath: string;
};

const INITIAL_RESEND_DELAY = 60;

export function EmailVerificationStatus({ email, nextPath }: EmailVerificationStatusProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [secondsUntilResend, setSecondsUntilResend] = useState(INITIAL_RESEND_DELAY);
  const [isResending, startResendTransition] = useTransition();
  const signupHref =
    nextPath === '/marketplace' ? '/signup' : `/signup?next=${encodeURIComponent(nextPath)}`;

  useEffect(() => {
    if (secondsUntilResend <= 0) return;

    const timer = window.setTimeout(() => setSecondsUntilResend((seconds) => seconds - 1), 1_000);
    return () => window.clearTimeout(timer);
  }, [secondsUntilResend]);

  const resend = () => {
    if (secondsUntilResend > 0 || isResending) return;

    setServerError(null);
    setNotice(null);
    startResendTransition(async () => {
      try {
        const result = await resendSignupAction({ email, next: nextPath });
        if (result.ok) {
          setNotice(result.message);
          setSecondsUntilResend(INITIAL_RESEND_DELAY);
        } else {
          setServerError(result.message);
        }
      } catch {
        setServerError("We couldn't resend the verification email. Try again in a moment.");
      }
    });
  };

  return (
    <div className="mt-8 space-y-5">
      <div className="border-l-2 border-um-gold-500 bg-um-gold-300/20 px-5 py-4 text-sm leading-6 text-um-text">
        Open the newest verification link in the same browser and device where you signed up. After
        verification, return here and sign in with your email and password.
      </div>

      {serverError ? (
        <div
          aria-live="polite"
          className="border-l-2 border-red-600 bg-red-50/80 px-4 py-3 text-sm font-medium text-red-800"
          role="alert"
        >
          {serverError}
        </div>
      ) : null}

      {notice ? (
        <div
          aria-live="polite"
          className="border-l-2 border-emerald-700 bg-emerald-50/80 px-4 py-3 text-sm font-medium text-emerald-900"
          role="status"
        >
          {notice}
        </div>
      ) : null}

      <p className="text-sm leading-6 text-um-text-muted">
        If the address already has an account, use the sign-in page instead. Check spam if the
        message takes a moment to arrive.
      </p>

      <div className="flex flex-col items-center justify-between gap-3 pt-1 text-sm sm:flex-row">
        <Link
          className="-mx-2 inline-flex min-h-11 items-center gap-1.5 px-2 font-semibold text-um-text-muted transition hover:text-um-text-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-um-gold-500"
          href={signupHref}
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          Change email
        </Link>
        <button
          className="-mx-2 inline-flex min-h-11 items-center gap-1.5 px-2 font-semibold text-um-text-muted transition hover:text-um-text-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-um-gold-500 disabled:cursor-not-allowed disabled:text-black/30"
          disabled={secondsUntilResend > 0 || isResending}
          onClick={resend}
          type="button"
        >
          <RotateCw aria-hidden="true" className={`size-4 ${isResending ? 'animate-spin' : ''}`} />
          {isResending
            ? 'Sending…'
            : secondsUntilResend > 0
              ? `Resend in ${secondsUntilResend}s`
              : 'Resend verification'}
        </button>
      </div>
    </div>
  );
}
