import type { Metadata } from 'next';
import Link from 'next/link';
import { Check, ShieldAlert, X } from 'lucide-react';

import { CategoryFilters } from '@/features/marketplace/components/CategoryFilters';
import { ListingGrid } from '@/features/marketplace/components/ListingGrid';
import { MarketplaceEmptyState } from '@/features/marketplace/components/MarketplaceEmptyState';
import { MarketplacePagination } from '@/features/marketplace/components/MarketplacePagination';
import { MarketplaceSearch } from '@/features/marketplace/components/MarketplaceSearch';
import { getTorontoGreeting } from '@/features/marketplace/format';
import { getMarketplacePage } from '@/features/marketplace/queries';
import { firstSearchParam, marketplaceHref } from '@/features/marketplace/url';
import { requireMarketplaceViewer } from '@/lib/auth/session';

export const metadata: Metadata = {
  title: 'Marketplace | UniMarket',
  description: 'Buy and sell with verified University of Waterloo students.',
};

export const dynamic = 'force-dynamic';

type MarketplacePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function MarketplacePage({ searchParams }: MarketplacePageProps) {
  const viewer = await requireMarketplaceViewer('/marketplace');
  const canSell = viewer.profile.role === 'student';
  const firstName = getFirstName(viewer.profile.full_name);
  const params = await searchParams;
  const query = firstSearchParam(params.q) ?? '';
  const category = firstSearchParam(params.category);
  const didPublish = firstSearchParam(params.published) === '1';
  const restrictionNotice = getRestrictionNotice(firstSearchParam(params.notice));
  const pageParam = Number.parseInt(firstSearchParam(params.page) ?? '1', 10);
  const data = await getMarketplacePage({
    query,
    category,
    page: Number.isNaN(pageParam) ? 1 : pageParam,
  });
  const activeCategory = data.categories.find((item) => item.slug === data.category);
  const isFiltered = Boolean(data.query || data.category);
  const rangeStart = data.total === 0 ? 0 : (data.page - 1) * data.pageSize + 1;
  const rangeEnd = Math.min(data.page * data.pageSize, data.total);
  const clearHref = marketplaceHref({});

  return (
    <div className="min-h-screen bg-um-canvas text-um-text-strong">
      <section className="relative isolate overflow-hidden border-b border-white/[0.08] bg-[#070a0f]">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_15%_-20%,rgba(242,205,82,0.16),transparent_28rem),radial-gradient(circle_at_86%_115%,rgba(113,135,174,0.12),transparent_32rem)]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-y-0 left-[44%] -z-10 hidden w-px bg-gradient-to-b from-transparent via-white/[0.08] to-transparent lg:block"
        />

        <div className="mx-auto grid max-w-um-content items-end gap-6 px-4 py-7 sm:px-6 sm:py-9 lg:grid-cols-[minmax(17rem,0.72fr)_minmax(32rem,1.28fr)] lg:gap-12 lg:px-8 lg:py-10">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-[0.64rem] font-bold uppercase tracking-[0.19em] text-um-gold-300/88">
              <span className="relative flex size-2" aria-hidden="true">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-um-gold-300/45 motion-reduce:animate-none" />
                <span className="relative inline-flex size-2 rounded-full bg-um-gold-300" />
              </span>
              Live at Waterloo
            </div>
            <h1 className="mt-3 truncate text-[clamp(2rem,3.3vw,3.15rem)] font-bold leading-none tracking-[-0.052em] text-white">
              {firstName ? `${getTorontoGreeting()}, ${firstName}.` : 'Made for Waterloo.'}
            </h1>
            <p className="mt-3 text-sm text-white/45">
              <span className="font-semibold tabular-nums text-white/72">{data.total}</span>{' '}
              {data.query || data.category
                ? data.total === 1
                  ? 'result'
                  : 'results'
                : `${data.total === 1 ? 'listing' : 'listings'} in the exchange`}
            </p>
          </div>
          <MarketplaceSearch category={data.category} query={data.query} />
        </div>
      </section>

      {(didPublish || restrictionNotice) && (
        <div className="mx-auto max-w-um-content px-4 pt-5 sm:px-6 lg:px-8">
          {didPublish ? (
            <div
              aria-live="polite"
              className="flex items-center gap-2.5 border border-emerald-400/20 bg-emerald-500/[0.08] px-4 py-3 text-sm font-semibold text-emerald-200"
              role="status"
            >
              <Check aria-hidden="true" className="size-4" strokeWidth={2.2} />
              Your listing is live.
            </div>
          ) : null}
          {restrictionNotice ? (
            <div
              aria-live="polite"
              className="flex items-start gap-2.5 border border-amber-300/20 bg-amber-400/[0.08] px-4 py-3 text-amber-100"
              role="status"
            >
              <ShieldAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" strokeWidth={2} />
              <div>
                <p className="text-sm font-semibold">{restrictionNotice.title}</p>
                <p className="mt-0.5 text-xs leading-5 text-white/58">
                  {restrictionNotice.message}
                </p>
              </div>
            </div>
          ) : null}
        </div>
      )}

      <CategoryFilters
        activeCategory={data.category}
        categories={data.categories}
        query={data.query}
      />

      <div className="mx-auto max-w-um-content px-4 pb-20 sm:px-6 lg:px-8 lg:pb-28">
        <section aria-labelledby="marketplace-results-heading" className="mt-11 sm:mt-14">
          <div className="mb-6 flex items-end justify-between gap-4 border-b border-white/[0.08] pb-5 sm:mb-8">
            <div className="min-w-0">
              <h2
                className="truncate text-[1.75rem] font-bold leading-tight tracking-[-0.038em] text-white sm:text-[2.1rem]"
                id="marketplace-results-heading"
              >
                {data.query
                  ? `“${data.query}”`
                  : activeCategory
                    ? activeCategory.label
                    : 'Just listed'}
              </h2>
              <p className="sr-only" role="status">
                {data.total} {data.total === 1 ? 'listing' : 'listings'} found
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-3 text-xs font-medium text-white/48 sm:text-sm">
              {data.total > 0 ? (
                <span className="tabular-nums">
                  {rangeStart}–{rangeEnd} of {data.total}
                </span>
              ) : null}
              {isFiltered ? (
                <Link
                  className="inline-flex min-h-11 items-center gap-1.5 rounded-[0.6rem] px-2.5 text-white/62 transition duration-160 hover:bg-white/[0.07] hover:text-white focus-visible:ring-2 focus-visible:ring-um-gold-300"
                  href={clearHref}
                >
                  <X aria-hidden="true" className="size-3.5" />
                  Clear
                </Link>
              ) : null}
            </div>
          </div>

          {data.listings.length > 0 ? (
            <>
              <ListingGrid listings={data.listings} prioritizeFirst />
              <MarketplacePagination
                category={data.category}
                page={data.page}
                query={data.query}
                totalPages={data.totalPages}
              />
            </>
          ) : (
            <MarketplaceEmptyState
              canSell={canSell}
              emptyPage={data.total > 0}
              filtered={isFiltered}
              firstPageHref={marketplaceHref({ query: data.query, category: data.category })}
            />
          )}
        </section>
      </div>
    </div>
  );
}

function getRestrictionNotice(value: string | null | undefined) {
  if (value === 'selling-restricted') {
    return {
      title: 'Seller tools are unavailable for this account.',
      message: 'Selling is reserved for verified student profiles.',
    };
  }

  if (value === 'moderator-restricted') {
    return {
      title: 'Moderator access is restricted.',
      message: 'Only authorized moderator accounts can open that workspace.',
    };
  }

  return null;
}

function getFirstName(fullName: string | null) {
  return fullName?.trim().split(/\s+/)[0] || null;
}
