'use client';

import { ArrowLeft, MailCheck, RotateCw } from 'lucide-react';
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
      <div className="flex items-start gap-4 border-y border-white/10 py-5">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-um-gold-400/30 bg-um-gold-400/10 text-um-gold-300">
          <MailCheck aria-hidden="true" className="size-[1.1rem]" />
        </span>
        <div>
          <p className="text-sm font-bold text-um-text-strong">Check the newest email we sent.</p>
          <p className="mt-1 text-sm leading-6 text-um-text-muted">
            Open it on this device, then come back and sign in.
          </p>
        </div>
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

      <div className="flex flex-col items-center justify-between gap-3 pt-1 text-sm sm:flex-row">
        <Link
          className="um-auth-change-email -mx-3 inline-flex min-h-11 items-center gap-2 rounded-full px-3 font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-um-gold-500"
          href={signupHref}
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          Change email
        </Link>
        <button
          className="group inline-flex min-h-11 items-center gap-2 rounded-full border border-um-gold-300/50 bg-um-gold-300 px-5 font-bold text-um-ink-950 shadow-[0_10px_28px_rgba(242,192,40,0.12)] transition hover:-translate-y-px hover:bg-um-gold-200 hover:shadow-[0_14px_34px_rgba(242,192,40,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-um-gold-500 focus-visible:ring-offset-2 focus-visible:ring-offset-um-ink-950 disabled:cursor-wait disabled:border-white/15 disabled:bg-white/[0.06] disabled:text-white/65 disabled:shadow-none disabled:hover:translate-y-0"
          disabled={secondsUntilResend > 0 || isResending}
          onClick={resend}
          type="button"
        >
          <RotateCw
            aria-hidden="true"
            className={`size-4 transition-transform group-hover:rotate-[-35deg] ${isResending ? 'animate-spin' : ''}`}
          />
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
