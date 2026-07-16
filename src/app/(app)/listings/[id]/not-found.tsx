import Link from 'next/link';
import { ArrowLeft, PackageSearch } from 'lucide-react';

export default function ListingNotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-um-canvas px-4 py-16 text-um-text-strong">
      <div className="max-w-md text-center">
        <div className="mx-auto grid size-16 place-items-center rounded-um-lg bg-um-gold-300/45 text-um-gold-700">
          <PackageSearch className="h-7 w-7" aria-hidden="true" />
        </div>
        <h1 className="mt-5 text-3xl font-semibold tracking-[-0.045em]">
          That find is no longer here
        </h1>
        <p className="mt-3 text-sm leading-6 text-um-text-muted">
          The seller may have removed it or marked it unavailable. Head back to see what is
          currently listed around Waterloo.
        </p>
        <Link
          href="/marketplace"
          className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-um-sm bg-um-ink-950 px-4 py-2.5 text-sm font-bold text-white"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Browse marketplace
        </Link>
      </div>
    </div>
  );
}
