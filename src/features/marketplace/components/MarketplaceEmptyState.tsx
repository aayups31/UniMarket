import Link from 'next/link';
import { ArrowLeft, ArrowRight, SearchX } from 'lucide-react';

import { CampusRouteGraphic } from '@/components/ui/CampusRouteGraphic';

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
      <div className="relative isolate overflow-hidden border-y border-black/[0.08] bg-um-surface-warm px-6 py-12 sm:px-10 sm:py-16">
        <CampusRouteGraphic
          className="absolute inset-y-0 right-0 -z-10 hidden w-[50%] opacity-25 md:block"
          tone="light"
        />
        <div className="max-w-xl">
          <span className="grid size-11 place-items-center rounded-full bg-um-surface text-um-gold-700 shadow-um-xs">
            <SearchX className="size-5" aria-hidden="true" />
          </span>
          <p className="font-condensed mt-6 text-xs font-bold uppercase tracking-[0.18em] text-um-gold-700">
            Search the whole campus
          </p>
          <h2 className="mt-1.5 text-2xl font-bold tracking-[-0.04em] text-um-text-strong sm:text-3xl">
            {emptyPage ? 'There’s nothing on this page.' : 'No matches around Waterloo.'}
          </h2>
          <p className="mt-3 max-w-md text-sm leading-6 text-um-text-muted">
            {emptyPage
              ? 'These listings are still available—return to the first page to keep browsing.'
              : 'Try a shorter phrase, search another category, or clear your filters.'}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href={emptyPage ? firstPageHref : '/marketplace'}
              className="inline-flex min-h-11 items-center gap-2 rounded-um-sm bg-um-ink-950 px-4 py-2.5 text-sm font-bold text-um-text-inverse transition duration-160 ease-um-out hover:bg-um-ink-850 focus-visible:ring-2 focus-visible:ring-um-ink-950 focus-visible:ring-offset-2"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              {emptyPage ? 'Back to first page' : 'Clear filters'}
            </Link>
            {canSell ? (
              <Link
                href="/listings/new"
                className="inline-flex min-h-11 items-center rounded-um-sm px-4 py-2.5 text-sm font-bold text-um-text-strong underline decoration-um-gold-500/60 underline-offset-4"
              >
                Create a listing
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative isolate min-h-[23rem] overflow-hidden bg-um-ink-900 px-7 py-12 text-um-text-inverse shadow-[0_20px_58px_rgba(5,7,11,0.16)] sm:px-12 sm:py-16 lg:px-20">
      <CampusRouteGraphic className="absolute inset-y-0 right-0 -z-10 w-[68%] opacity-[0.62]" />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-r from-um-ink-900 via-um-ink-900/96 to-um-ink-900/32"
      />
      <p
        aria-hidden="true"
        className="font-condensed absolute bottom-8 right-5 hidden origin-bottom-right -rotate-90 text-[0.68rem] font-bold uppercase tracking-[0.34em] text-white/28 sm:block"
      >
        First listing / Waterloo
      </p>

      <div className="flex min-h-[15rem] max-w-xl flex-col justify-between">
        <p className="font-condensed text-xs font-bold uppercase tracking-[0.19em] text-um-gold-300">
          The founding feed
        </p>
        <div className="mt-16">
          <h2 className="font-editorial text-4xl leading-none tracking-[-0.045em] sm:text-5xl">
            Waterloo starts here.
          </h2>
          <p className="mt-4 max-w-lg text-sm leading-6 text-white/55 sm:text-base sm:leading-7">
            {canSell
              ? 'Be one of the first students to pass something on. One useful listing is enough to help someone settle into a room, a course, or a new term.'
              : 'New Waterloo student listings will appear here as soon as they are published.'}
          </p>
          {canSell ? (
            <Link
              href="/listings/new"
              className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-um-sm bg-um-gold-400 px-5 text-sm font-bold text-um-ink-950 transition duration-160 ease-um-out hover:-translate-y-0.5 hover:bg-um-gold-300 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-um-ink-900"
            >
              Create the first listing
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
