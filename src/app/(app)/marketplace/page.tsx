import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CircleCheckBig, MapPin, Plus, ShieldAlert, Sparkles } from 'lucide-react';

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
  const greeting = getTorontoGreeting();
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
  const recentIds = new Set(data.listings.map((listing) => listing.id));
  const additionalFeatured = data.featured.filter((listing) => !recentIds.has(listing.id));

  return (
    <div className="min-h-screen bg-um-canvas text-um-text-strong">
      <div className="mx-auto max-w-um-content px-4 pb-20 pt-5 sm:px-6 sm:pt-7 lg:px-8 lg:pb-28 lg:pt-9">
        <header>
          <section
            className="relative isolate overflow-hidden rounded-um-xl border border-black/10 bg-um-canvas-soft shadow-um-sm"
            aria-labelledby="marketplace-heading"
          >
            <div className="absolute inset-x-0 top-0 h-1 bg-um-gold-500" aria-hidden="true" />

            <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_17.5rem]">
              <div className="relative px-5 pb-6 pt-7 sm:px-9 sm:pb-8 sm:pt-10 lg:px-12 lg:pb-9 lg:pt-11">
                <div className="max-w-[48rem]">
                  <p className="font-condensed flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-um-gold-700">
                    <MapPin className="size-3.5" strokeWidth={2} aria-hidden="true" />
                    Marketplace for Waterloo students
                  </p>
                  <h1
                    id="marketplace-heading"
                    className="um-balanced mt-5 text-[clamp(2.25rem,5vw,4rem)] font-bold leading-[0.99] tracking-[-0.055em] text-um-text-strong"
                  >
                    {firstName ? `${greeting}, ${firstName}.` : 'Waterloo’s marketplace.'}
                    <span className="mt-1 block text-um-text-muted">
                      {firstName
                        ? 'What do you need before your next co-op?'
                        : 'Built for students, not strangers.'}
                    </span>
                  </h1>
                  <p className="mt-5 max-w-2xl text-sm leading-6 text-um-text sm:text-[0.98rem] sm:leading-7">
                    Browse useful things from verified Waterloo students, then arrange a simple
                    pickup that works for both of you.
                  </p>
                </div>

                <div className="mt-8 max-w-[58rem] sm:mt-10">
                  <MarketplaceSearch query={data.query} category={data.category} />
                </div>

                <div className="mt-7 border-t border-black/10 pt-5 sm:mt-9 sm:flex sm:items-center sm:gap-6 sm:pt-6">
                  <p className="font-condensed flex shrink-0 items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-um-gold-700">
                    <MapPin className="size-3.5" strokeWidth={1.9} aria-hidden="true" />
                    Around Waterloo
                  </p>
                  <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5 font-condensed text-xs font-semibold tracking-[0.08em] text-um-text-muted sm:mt-0">
                    {CAMPUS_PLACES.map((place) => (
                      <li key={place}>{place}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <aside className="relative hidden overflow-hidden bg-um-ink-950 p-7 text-um-text-inverse lg:flex lg:flex-col lg:justify-between">
                <div>
                  <p className="font-condensed text-xs font-bold uppercase tracking-[0.18em] text-um-gold-400">
                    Black / Gold
                  </p>
                  <span
                    className="mt-3 block select-none font-condensed text-[7.5rem] font-bold leading-none text-white/[0.06]"
                    aria-hidden="true"
                  >
                    W
                  </span>
                </div>
                <div>
                  <div className="mb-5 space-y-1.5" aria-hidden="true">
                    <div className="h-1.5 w-3/5 bg-um-gold-300" />
                    <div className="h-1.5 w-4/5 bg-um-gold-400" />
                    <div className="h-1.5 w-full bg-um-gold-500" />
                    <div className="h-1.5 w-2/5 bg-um-gold-600" />
                  </div>
                  <p className="text-lg font-bold leading-6 tracking-[-0.025em]">
                    Waterloo buys from Waterloo.
                  </p>
                  <p className="mt-2 text-xs leading-5 text-white/55">
                    A verified student marketplace for everyday campus life.
                  </p>
                </div>
              </aside>
            </div>
          </section>

          {didPublish ? (
            <div
              role="status"
              aria-live="polite"
              className="mt-4 flex items-start gap-3 rounded-um-md border border-um-success/25 bg-um-success/10 px-4 py-3.5 text-um-success shadow-um-xs sm:px-5"
            >
              <CircleCheckBig
                className="mt-0.5 size-5 shrink-0"
                strokeWidth={2}
                aria-hidden="true"
              />
              <div>
                <p className="text-sm font-semibold">Listed for Waterloo.</p>
                <p className="mt-0.5 text-xs leading-5 text-um-text">
                  Your listing is live and ready for verified students to find.
                </p>
              </div>
            </div>
          ) : null}

          {restrictionNotice ? (
            <div
              aria-live="polite"
              className="mt-4 flex items-start gap-3 rounded-um-md border border-um-warning/25 bg-um-warning/10 px-4 py-3.5 text-um-warning shadow-um-xs sm:px-5"
              role="status"
            >
              <ShieldAlert aria-hidden="true" className="mt-0.5 size-5 shrink-0" strokeWidth={2} />
              <div>
                <p className="text-sm font-semibold">{restrictionNotice.title}</p>
                <p className="mt-0.5 text-xs leading-5 text-um-text">{restrictionNotice.message}</p>
              </div>
            </div>
          ) : null}

          <CategoryFilters
            categories={data.categories}
            activeCategory={data.category}
            query={data.query}
          />
        </header>

        <section className="mt-14 sm:mt-16 lg:mt-20" aria-labelledby="recent-heading">
          <div className="mb-5 flex flex-col items-start gap-3 border-b border-black/[0.08] pb-5 sm:mb-6 sm:flex-row sm:items-end sm:justify-between sm:gap-5 sm:pb-6">
            <div>
              <p className="font-condensed text-xs font-bold uppercase tracking-[0.16em] text-um-text-muted">
                {activeCategory
                  ? 'Category'
                  : data.query
                    ? 'Marketplace search'
                    : 'Waterloo marketplace'}
              </p>
              <h2
                id="recent-heading"
                className="mt-1.5 text-2xl font-bold tracking-[-0.04em] text-um-text-strong sm:text-[1.9rem]"
              >
                {data.query
                  ? `Results for “${data.query}”`
                  : activeCategory
                    ? `Newest in ${activeCategory.label}`
                    : 'Recently listed'}
              </h2>
              {!data.query && !activeCategory ? (
                <p className="mt-1.5 text-sm text-um-text-muted">
                  Newly published by verified students
                </p>
              ) : null}
            </div>
            {data.total > 0 ? (
              <p className="shrink-0 text-xs font-medium tabular-nums text-um-text-muted sm:text-sm">
                Showing {rangeStart}–{rangeEnd} of {data.total}
              </p>
            ) : null}
          </div>

          {data.listings.length > 0 ? (
            <>
              <ListingGrid listings={data.listings} prioritizeFirst />
              <MarketplacePagination
                page={data.page}
                totalPages={data.totalPages}
                query={data.query}
                category={data.category}
              />
            </>
          ) : (
            <MarketplaceEmptyState
              filtered={isFiltered}
              canSell={canSell}
              emptyPage={data.total > 0}
              firstPageHref={marketplaceHref({ query: data.query, category: data.category })}
            />
          )}
        </section>

        {additionalFeatured.length > 0 && !isFiltered && data.page === 1 ? (
          <section className="mt-14 sm:mt-16 lg:mt-20" aria-labelledby="featured-heading">
            <div className="mb-5 flex items-end justify-between gap-4 sm:mb-6">
              <div>
                <p className="font-condensed flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.16em] text-um-gold-700">
                  <Sparkles className="size-3.5" aria-hidden="true" />
                  Featured by UniMarket
                </p>
                <h2
                  id="featured-heading"
                  className="mt-1.5 text-2xl font-bold tracking-[-0.04em] text-um-text-strong sm:text-[1.9rem]"
                >
                  Worth a closer look
                </h2>
              </div>
              <p className="hidden max-w-xs text-right text-sm leading-6 text-um-text-muted sm:block">
                Selected from listings currently available to the Waterloo community
              </p>
            </div>
            <ListingGrid listings={additionalFeatured} />
          </section>
        ) : null}

        {canSell ? (
          <section
            className="mt-14 overflow-hidden rounded-um-xl border border-black/10 bg-um-surface px-6 py-7 shadow-um-xs sm:flex sm:items-center sm:justify-between sm:px-8 sm:py-8 lg:mt-20"
            aria-labelledby="sell-cta-heading"
          >
            <div className="flex items-start gap-4">
              <span className="hidden size-11 shrink-0 items-center justify-center rounded-um-md bg-um-gold-300/45 text-um-gold-700 sm:flex">
                <Plus className="size-5" aria-hidden="true" />
              </span>
              <div>
                <h2
                  id="sell-cta-heading"
                  className="text-xl font-bold tracking-[-0.03em] text-um-text-strong"
                >
                  Ready to pass something on?
                </h2>
                <p className="mt-1.5 text-sm leading-6 text-um-text-muted">
                  Create a clear listing and reach other Waterloo students.
                </p>
              </div>
            </div>
            <Link
              href="/listings/new"
              className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-um-sm bg-um-ink-950 px-4 py-2.5 text-sm font-bold text-um-text-inverse shadow-um-xs transition duration-160 ease-um-out hover:-translate-y-0.5 hover:bg-um-ink-850 focus-visible:ring-2 focus-visible:ring-um-ink-950 focus-visible:ring-offset-2 sm:mt-0"
            >
              Create a listing
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </section>
        ) : null}
      </div>
    </div>
  );
}

function getRestrictionNotice(value: string | null | undefined) {
  if (value === 'selling-restricted') {
    return {
      title: 'Seller tools are unavailable for this account.',
      message:
        'Selling is reserved for verified student profiles; moderator accounts stay read-only.',
    };
  }

  if (value === 'moderator-restricted') {
    return {
      title: 'Moderator access is restricted.',
      message: 'Only authorized moderator accounts can open the moderation workspace.',
    };
  }

  return null;
}

const CAMPUS_PLACES = ['DC', 'SLC', 'E7', 'UWP', 'ICON', 'LESTER', 'COLUMBIA', 'PHILLIP'];

function getFirstName(fullName: string | null) {
  return fullName?.trim().split(/\s+/)[0] || null;
}
