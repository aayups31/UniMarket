import Link from 'next/link';
import { ArrowLeft, ArrowRight, SearchX } from 'lucide-react';

type MarketplaceEmptyStateProps = {
  filtered: boolean;
  canSell: boolean;
  emptyPage?: boolean;
  firstPageHref?: string;
};

export function MarketplaceEmptyState({
  filtered,
  canSell,
  emptyPage = false,
  firstPageHref = '/marketplace',
}: MarketplaceEmptyStateProps) {
  if (filtered || emptyPage) {
    return (
      <div className="grid min-h-[19rem] place-items-center border-y border-white/[0.08] px-5 py-14 text-center">
        <div className="max-w-md">
          <SearchX
            aria-hidden="true"
            className="mx-auto size-6 text-um-gold-300"
            strokeWidth={1.7}
          />
          <h2 className="mt-5 text-2xl font-bold tracking-[-0.035em] text-white">
            {emptyPage ? 'Nothing on this page.' : 'No matches in Waterloo.'}
          </h2>
          <p className="mt-2 text-sm leading-6 text-white/52">
            {emptyPage ? 'Return to the first page.' : 'Try fewer words or another category.'}
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-2.5">
            <Link
              className="inline-flex min-h-11 items-center gap-2 rounded-[0.65rem] bg-um-gold-300 px-4 text-sm font-bold text-um-ink-950 transition duration-160 hover:bg-um-gold-200 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-um-canvas"
              href={emptyPage ? firstPageHref : '/marketplace'}
            >
              <ArrowLeft aria-hidden="true" className="size-4" />
              {emptyPage ? 'First page' : 'Clear search'}
            </Link>
            {canSell ? (
              <Link
                className="inline-flex min-h-11 items-center gap-2 rounded-[0.65rem] px-4 text-sm font-semibold text-white/72 transition duration-160 hover:bg-white/[0.07] hover:text-white focus-visible:ring-2 focus-visible:ring-um-gold-300"
                href="/listings/new"
              >
                Sell an item
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[16rem] items-center border-y border-white/[0.08] px-5 py-12 sm:px-7">
      <div>
        <h2 className="text-2xl font-bold tracking-[-0.035em] text-white">No listings yet.</h2>
        {canSell ? (
          <Link
            className="mt-6 inline-flex min-h-11 w-fit items-center gap-2 rounded-[0.65rem] bg-um-gold-300 px-4 text-sm font-bold text-um-ink-950 transition duration-160 hover:bg-um-gold-200 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-um-canvas"
            href="/listings/new"
          >
            Create a listing
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        ) : null}
      </div>
    </div>
  );
}
