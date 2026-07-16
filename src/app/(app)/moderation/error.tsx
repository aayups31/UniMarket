'use client';

import Link from 'next/link';
import { CircleAlert, RotateCcw } from 'lucide-react';

export default function ModerationError({ reset }: { reset: () => void }) {
  return (
    <div className="mx-auto grid min-h-[70vh] max-w-xl place-items-center px-5 py-16 text-center">
      <div>
        <div className="mx-auto grid size-12 place-items-center rounded-um-md bg-um-danger/10 text-um-danger">
          <CircleAlert aria-hidden="true" className="size-6" />
        </div>
        <p className="font-condensed mt-5 text-xs font-bold uppercase tracking-[0.16em] text-um-danger">
          Workspace unavailable
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-[-0.03em] text-um-text-strong">
          We could not load the moderation record
        </h1>
        <p className="mt-3 leading-7 text-um-text-muted">
          This workspace is read-only. A loading error does not change the append-only audit. Try
          again, or return to the current marketplace.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            className="inline-flex min-h-11 items-center gap-2 rounded-um-sm bg-um-ink-950 px-5 text-sm font-bold text-um-text-inverse transition-colors duration-160 ease-um-out hover:bg-um-ink-850"
            onClick={reset}
            type="button"
          >
            <RotateCcw aria-hidden="true" className="size-4" />
            Try again
          </button>
          <Link
            className="inline-flex min-h-11 items-center rounded-um-sm border border-black/10 bg-um-surface px-5 text-sm font-bold text-um-text transition-colors duration-160 ease-um-out hover:bg-um-canvas-soft"
            href="/marketplace"
          >
            Browse marketplace
          </Link>
        </div>
      </div>
    </div>
  );
}
