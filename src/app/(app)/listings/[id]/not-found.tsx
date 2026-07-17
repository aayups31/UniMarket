import Link from 'next/link';
import { ArrowLeft, PackageSearch } from 'lucide-react';
import { CampusRouteGraphic } from '@/components/ui/CampusRouteGraphic';

export default function ListingNotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-um-canvas px-4 py-16 text-um-text-strong">
      <div className="relative isolate w-full max-w-3xl overflow-hidden bg-um-ink-900 px-7 py-14 text-um-text-inverse shadow-[0_22px_60px_rgba(5,7,11,0.17)] sm:px-12">
        <CampusRouteGraphic className="absolute inset-y-0 right-0 -z-10 w-[62%] opacity-[0.42]" />
        <div
          className="absolute inset-0 -z-10 bg-gradient-to-r from-um-ink-900 via-um-ink-900/96 to-um-ink-900/42"
          aria-hidden="true"
        />
        <div className="max-w-md">
          <PackageSearch className="size-7 text-um-gold-300" aria-hidden="true" />
          <p className="font-condensed mt-6 text-xs font-bold uppercase tracking-[0.18em] text-um-gold-300">
            No longer listed
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.045em]">
            That find is no longer here
          </h1>
          <p className="mt-3 text-sm leading-6 text-white/52">
            The seller may have removed it or marked it unavailable. Head back to see what is
            currently listed around Waterloo.
          </p>
          <Link
            href="/marketplace"
            className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-um-sm bg-um-gold-400 px-4 py-2.5 text-sm font-bold text-um-ink-950"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Browse marketplace
          </Link>
        </div>
      </div>
    </div>
  );
}
