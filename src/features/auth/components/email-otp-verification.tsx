'use client';

import { ArrowLeft, ArrowRight, LoaderCircle, RotateCw } from 'lucide-react';
import Link from 'next/link';
import { type FormEvent, useEffect, useState, useTransition } from 'react';

import { resendSignupAction, verifySignupOtpAction } from '../actions';

type EmailOtpVerificationProps = {
  email: string;
  nextPath: string;
};

const INITIAL_RESEND_DELAY = 60;

export function EmailOtpVerification({ email, nextPath }: EmailOtpVerificationProps) {
  const [token, setToken] = useState('');
  const [serverError, setServerError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [secondsUntilResend, setSecondsUntilResend] = useState(INITIAL_RESEND_DELAY);
  const [isVerifying, startVerificationTransition] = useTransition();
  const [isResending, startResendTransition] = useTransition();
  const signupHref =
    nextPath === '/marketplace' ? '/signup' : `/signup?next=${encodeURIComponent(nextPath)}`;

  useEffect(() => {
    if (secondsUntilResend <= 0) return;

    const timer = window.setTimeout(() => setSecondsUntilResend((seconds) => seconds - 1), 1_000);
    return () => window.clearTimeout(timer);
  }, [secondsUntilResend]);

  const verify = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isVerifying) return;

    setServerError(null);
    setNotice(null);

    if (!/^\d{6}$/.test(token)) {
      setServerError('Enter the six-digit code from your email.');
      return;
    }

    startVerificationTransition(async () => {
      try {
        const result = await verifySignupOtpAction({ email, next: nextPath, token });
        if (result && !result.ok) setServerError(result.message);
      } catch {
        setServerError("We couldn't verify the code. Try again in a moment.");
      }
    });
  };

  const resend = () => {
    if (secondsUntilResend > 0 || isResending) return;

    setServerError(null);
    setNotice(null);
    startResendTransition(async () => {
      try {
        const result = await resendSignupAction({ email, next: nextPath });
        if (result.ok) {
          setToken('');
          setNotice(result.message);
          setSecondsUntilResend(INITIAL_RESEND_DELAY);
        } else {
          setServerError(result.message);
        }
      } catch {
        setServerError("We couldn't send a new code. Try again in a moment.");
      }
    });
  };

  return (
    <div className="mt-8">
      <form className="space-y-4" noValidate onSubmit={verify}>
        <div className="space-y-2">
          <label className="text-sm font-bold text-um-text-strong" htmlFor="signup-otp">
            Verification code
          </label>
          <input
            aria-describedby="signup-otp-hint"
            aria-invalid={Boolean(serverError)}
            autoComplete="one-time-code"
            autoFocus
            className="h-[4rem] w-full rounded-sm border border-white/15 bg-white/[0.055] px-5 text-center font-mono text-2xl font-bold tabular-nums tracking-[0.34em] text-um-text-strong outline-none transition placeholder:text-white/20 hover:border-white/25 focus:border-um-gold-500 focus:ring-4 focus:ring-um-gold-400/15 disabled:cursor-wait disabled:opacity-60"
            disabled={isVerifying}
            enterKeyHint="done"
            id="signup-otp"
            inputMode="numeric"
            maxLength={6}
            onChange={(event) => setToken(event.target.value.replace(/\D/g, '').slice(0, 6))}
            pattern="[0-9]*"
            placeholder="000000"
            value={token}
          />
          <p className="text-sm text-um-text-muted" id="signup-otp-hint">
            Six digits · expires in 15 minutes
          </p>
        </div>

        {serverError ? (
          <div
            aria-live="polite"
            className="border-l-2 border-red-500 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-100"
            role="alert"
          >
            {serverError}
          </div>
        ) : null}

        {notice ? (
          <div
            aria-live="polite"
            className="border-l-2 border-emerald-400 bg-emerald-400/10 px-4 py-3 text-sm font-medium text-emerald-100"
            role="status"
          >
            {notice}
          </div>
        ) : null}

        <button
          className="group flex h-[3.35rem] w-full items-center justify-center gap-3 rounded-sm bg-um-gold-300 px-5 text-sm font-black text-um-ink-950 transition hover:bg-um-gold-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-um-gold-400/35 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isVerifying}
          type="submit"
        >
          {isVerifying ? (
            <>
              <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
              Verifying…
            </>
          ) : (
            <>
              Verify email
              <ArrowRight
                aria-hidden="true"
                className="size-4 transition-transform group-hover:translate-x-1"
              />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-5 text-sm sm:flex-row">
        <Link
          className="um-auth-change-email -mx-3 inline-flex min-h-11 items-center gap-2 rounded-full px-3 font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-um-gold-500"
          href={signupHref}
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          Change email
        </Link>
        <button
          className="group inline-flex min-h-11 items-center gap-2 rounded-full border border-um-gold-300/35 px-4 font-bold text-um-gold-200 transition hover:border-um-gold-300/65 hover:bg-um-gold-300/10 hover:text-um-gold-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-um-gold-500 disabled:cursor-wait disabled:border-white/10 disabled:text-white/45"
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
              : 'Send new code'}
        </button>
      </div>
    </div>
  );
}
