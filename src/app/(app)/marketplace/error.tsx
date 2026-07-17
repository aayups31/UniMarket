'use client';

import Link from 'next/link';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { CampusRouteGraphic } from '@/components/ui/CampusRouteGraphic';

export default function MarketplaceError({ reset }: { reset: () => void }) {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-um-canvas px-4 py-16 text-um-text-strong">
      <div className="relative isolate w-full max-w-3xl overflow-hidden bg-um-ink-900 px-7 py-14 text-um-text-inverse shadow-[0_22px_60px_rgba(5,7,11,0.17)] sm:px-12">
        <CampusRouteGraphic className="absolute inset-y-0 right-0 -z-10 w-[62%] opacity-[0.42]" />
        <div
          className="absolute inset-0 -z-10 bg-gradient-to-r from-um-ink-900 via-um-ink-900/96 to-um-ink-900/42"
          aria-hidden="true"
        />
        <div className="max-w-md">
          <AlertCircle className="size-7 text-um-gold-300" aria-hidden="true" />
          <p className="font-condensed mt-6 text-xs font-bold uppercase tracking-[0.18em] text-um-gold-300">
            A quiet moment
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.045em]">
            The marketplace took a pause
          </h1>
          <p className="mt-3 max-w-sm text-sm leading-6 text-white/52">
            We couldn’t load listings just now. Your account is fine—try the request again in a
            moment.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={reset}
              className="inline-flex min-h-11 items-center gap-2 rounded-um-sm bg-um-gold-400 px-4 text-sm font-bold text-um-ink-950 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-um-ink-900"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Try again
            </button>
            <Link
              href="/"
              className="inline-flex min-h-11 items-center rounded-um-sm border border-white/12 px-4 text-sm font-semibold text-white/68 hover:bg-white/[0.06]"
            >
              Go home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
