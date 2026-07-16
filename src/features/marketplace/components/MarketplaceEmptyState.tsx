import Link from 'next/link';
import { SearchX, Sparkles } from 'lucide-react';

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
  return (
    <div className="rounded-um-xl border border-dashed border-black/20 bg-um-surface px-6 py-14 text-center sm:px-10 sm:py-20">
      <div className="mx-auto flex size-14 items-center justify-center rounded-um-md bg-um-gold-300/45 text-um-gold-700">
        {filtered || emptyPage ? (
          <SearchX className="h-6 w-6" aria-hidden="true" />
        ) : (
          <Sparkles className="h-6 w-6" aria-hidden="true" />
        )}
      </div>
      <h2 className="mt-5 text-xl font-bold tracking-[-0.025em] text-um-text-strong">
        {emptyPage
          ? 'There’s nothing on this page'
          : filtered
            ? 'No matches around Waterloo.'
            : 'Waterloo starts here.'}
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-um-text-muted">
        {emptyPage
          ? 'These listings are still available—return to the first page to keep browsing.'
          : filtered
            ? 'Try a broader search or remove a filter.'
            : canSell
              ? 'Be one of the first students to pass something on. Your listing could help another student furnish a room, prepare for class, or move into a new term.'
              : 'New Waterloo student listings will appear here as soon as they are published.'}
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        {emptyPage ? (
          <Link
            href={firstPageHref}
            className="inline-flex min-h-11 items-center rounded-um-sm border border-black/10 bg-um-surface px-4 py-2.5 text-sm font-bold text-um-text-strong shadow-um-xs transition duration-160 ease-um-out hover:border-black/25 focus-visible:ring-2 focus-visible:ring-um-ink-950 focus-visible:ring-offset-2"
          >
            Back to first page
          </Link>
        ) : filtered ? (
          <Link
            href="/marketplace"
            className="inline-flex min-h-11 items-center rounded-um-sm border border-black/10 bg-um-surface px-4 py-2.5 text-sm font-bold text-um-text-strong shadow-um-xs transition duration-160 ease-um-out hover:border-black/25 focus-visible:ring-2 focus-visible:ring-um-ink-950 focus-visible:ring-offset-2"
          >
            Clear filters
          </Link>
        ) : null}
        {canSell ? (
          <Link
            href="/listings/new"
            className="inline-flex min-h-11 items-center rounded-um-sm bg-um-ink-950 px-4 py-2.5 text-sm font-bold text-um-text-inverse shadow-um-xs transition duration-160 ease-um-out hover:bg-um-ink-850 focus-visible:ring-2 focus-visible:ring-um-ink-950 focus-visible:ring-offset-2"
          >
            {filtered ? 'Create a listing' : 'Create the first listing'}
          </Link>
        ) : null}
      </div>
    </div>
  );
}
