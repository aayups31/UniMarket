'use client';

import Link from 'next/link';
import { AlertCircle, ArrowLeft, RotateCcw } from 'lucide-react';

export default function ListingError({ reset }: { reset: () => void }) {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-um-canvas px-4 py-16 text-um-text-strong">
      <div className="w-full max-w-lg overflow-hidden rounded-um-xl border border-black/10 bg-white text-center shadow-um-sm">
        <div className="h-1.5 bg-um-gold-500" aria-hidden="true" />
        <div className="px-6 py-12 sm:px-10">
          <AlertCircle className="mx-auto size-8 text-um-gold-700" aria-hidden="true" />
          <h1 className="mt-5 text-2xl font-semibold tracking-[-0.035em]">
            This listing didn’t load
          </h1>
          <p className="mt-2 text-sm leading-6 text-um-text-muted">
            It may be a temporary connection issue. Try once more or head back to the marketplace.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={reset}
              className="inline-flex min-h-11 items-center gap-2 rounded-um-sm bg-um-ink-950 px-4 py-2.5 text-sm font-bold text-white"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Try again
            </button>
            <Link
              href="/marketplace"
              className="inline-flex min-h-11 items-center gap-2 rounded-um-sm border border-black/10 px-4 py-2.5 text-sm font-semibold"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Marketplace
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
