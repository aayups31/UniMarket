'use client';

import Link from 'next/link';
import { AlertCircle, RotateCcw } from 'lucide-react';

export default function MarketplaceError({ reset }: { reset: () => void }) {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-[#faf9f5] px-4 py-16 text-[#171714]">
      <div className="w-full max-w-lg rounded-[1.75rem] border border-black/[0.08] bg-white px-6 py-12 text-center shadow-[0_18px_55px_rgba(30,30,24,0.06)] sm:px-10">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff4c5] text-[#806400]">
          <AlertCircle className="h-6 w-6" aria-hidden="true" />
        </div>
        <h1 className="mt-5 text-2xl font-semibold tracking-[-0.035em]">
          The marketplace took a pause
        </h1>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-um-text-muted">
          We couldn’t load listings just now. Your account is fine—try the request again in a
          moment.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#171714] px-4 text-sm font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d5a900] focus-visible:ring-offset-2"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex min-h-11 items-center rounded-xl border border-black/10 px-4 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d5a900] focus-visible:ring-offset-2"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
