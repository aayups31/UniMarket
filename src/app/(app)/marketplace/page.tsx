import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CircleCheckBig, MapPin, Plus, ShieldAlert, Sparkles } from 'lucide-react';

import { CampusRouteGraphic } from '@/components/ui/CampusRouteGraphic';
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
      <header className="relative isolate overflow-hidden bg-um-ink-950 text-um-text-inverse">
        <div
          className="absolute inset-y-0 right-0 hidden w-[58%] opacity-75 lg:block"
          aria-hidden="true"
        >
          <CampusRouteGraphic />
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(90deg,#080c13_0%,rgba(8,12,19,0.98)_42%,rgba(8,12,19,0.72)_70%,rgba(8,12,19,0.25)_100%)]"
        />
        <div className="absolute inset-x-0 bottom-0 h-px bg-um-gold-400/60" aria-hidden="true" />

        <div className="relative mx-auto grid max-w-um-content gap-12 px-4 pb-10 pt-10 sm:px-6 sm:pb-12 sm:pt-14 lg:grid-cols-[minmax(0,1.42fr)_minmax(18rem,0.58fr)] lg:gap-16 lg:px-8 lg:pb-14 lg:pt-16">
          <div className="max-w-[52rem]">
            <p className="flex items-center gap-2 text-sm font-semibold tracking-[0.02em] text-um-gold-300">
              <MapPin className="size-3.5" strokeWidth={2} aria-hidden="true" />
              Listed for Waterloo
            </p>
            <h1
              id="marketplace-heading"
              className="um-balanced mt-6 text-[clamp(2.65rem,5vw,4.5rem)] font-bold leading-[1] tracking-[-0.03em]"
            >
              {firstName ? `${greeting}, ${firstName}.` : 'Waterloo’s marketplace.'}
              <span className="mt-2 block max-w-3xl text-white/68">
                {firstName
                  ? 'What do you need before your next co-op?'
                  : 'Built for students, not strangers.'}
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-sm leading-6 text-white/72 sm:text-base sm:leading-7">
              Useful things, verified Waterloo sellers, and pickup points that already make sense.
            </p>

            <div className="mt-8 max-w-[50rem] sm:mt-10">
              <MarketplaceSearch query={data.query} category={data.category} />
            </div>
          </div>

          <aside className="hidden self-end border-l border-white/14 pb-1 pl-7 lg:block">
            <p className="text-sm font-semibold tracking-[0.02em] text-um-gold-300">
              Built around Waterloo terms
            </p>
            <p className="mt-5 max-w-[15rem] text-2xl font-bold leading-[1.1] tracking-[-0.02em]">
              Waterloo buys from Waterloo.
            </p>
            <p className="mt-3 max-w-[16rem] text-sm leading-6 text-white/68">
              From one study term to the next, keep good things moving locally.
            </p>
            <div className="mt-7 space-y-1.5" aria-hidden="true">
              <div className="h-1 w-12 bg-um-gold-200" />
              <div className="h-1 w-20 bg-um-gold-300" />
              <div className="h-1 w-28 bg-um-gold-400" />
              <div className="h-1 w-16 bg-um-gold-500" />
            </div>
          </aside>
        </div>

        <div className="relative border-t border-white/[0.07] bg-black/20">
          <div className="mx-auto flex max-w-um-content items-center gap-5 overflow-hidden px-4 py-3 sm:px-6 lg:px-8">
            <p className="flex shrink-0 items-center gap-2 text-xs font-semibold tracking-[0.02em] text-um-gold-300">
              <MapPin className="size-3" strokeWidth={2} aria-hidden="true" />
              Around your Waterloo
            </p>
            <ul className="flex min-w-max items-center gap-5 text-xs font-medium tracking-normal text-white/65">
              {CAMPUS_PLACES.map((place) => (
                <li className="flex items-center gap-5" key={place}>
                  <span className="size-1 rounded-full bg-um-gold-400/60" aria-hidden="true" />
                  {place}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </header>

      {(didPublish || restrictionNotice) && (
        <div className="mx-auto max-w-um-content px-4 pt-5 sm:px-6 lg:px-8">
          {didPublish ? (
            <div
              role="status"
              aria-live="polite"
              className="flex items-start gap-3 border-l-2 border-um-success bg-um-success/[0.07] px-4 py-3.5 text-um-success"
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
              className="flex items-start gap-3 border-l-2 border-um-warning bg-um-warning/[0.07] px-4 py-3.5 text-um-warning"
              role="status"
            >
              <ShieldAlert aria-hidden="true" className="mt-0.5 size-5 shrink-0" strokeWidth={2} />
              <div>
                <p className="text-sm font-semibold">{restrictionNotice.title}</p>
                <p className="mt-0.5 text-xs leading-5 text-um-text">{restrictionNotice.message}</p>
              </div>
            </div>
          ) : null}
        </div>
      )}

      <CategoryFilters
        categories={data.categories}
        activeCategory={data.category}
        query={data.query}
      />

      <div className="mx-auto max-w-um-content px-4 pb-20 sm:px-6 lg:px-8 lg:pb-28">
        <section className="mt-14 sm:mt-20 lg:mt-24" aria-labelledby="recent-heading">
          <div className="mb-6 flex flex-col items-start gap-3 sm:mb-8 sm:flex-row sm:items-end sm:justify-between sm:gap-5">
            <div>
              <p className="text-xs font-semibold tracking-[0.06em] text-um-gold-700">
                {activeCategory
                  ? 'Category'
                  : data.query
                    ? 'Marketplace search'
                    : 'Latest on campus'}
              </p>
              <h2
                id="recent-heading"
                className="mt-1.5 text-[2rem] font-bold leading-[1.08] tracking-[-0.025em] text-um-text-strong sm:text-[2.5rem]"
              >
                {data.query
                  ? `Results for “${data.query}”`
                  : activeCategory
                    ? `Newest in ${activeCategory.label}`
                    : 'Recently listed'}
              </h2>
              {!data.query && !activeCategory ? (
                <p className="mt-1.5 text-sm text-um-text">
                  The newest things passed on by verified students.
                </p>
              ) : null}
            </div>
            {data.total > 0 ? (
              <p className="shrink-0 text-xs font-medium tracking-[0.02em] text-um-text sm:text-sm">
                {rangeStart}–{rangeEnd} / {data.total}
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
          <section
            className="mt-16 border-t border-black/[0.08] pt-12 sm:mt-20 sm:pt-14"
            aria-labelledby="featured-heading"
          >
            <div className="mb-6 flex items-end justify-between gap-4 sm:mb-8">
              <div>
                <p className="flex items-center gap-1.5 text-xs font-semibold tracking-[0.06em] text-um-gold-700">
                  <Sparkles className="size-3.5" aria-hidden="true" />
                  Featured by UniMarket
                </p>
                <h2
                  id="featured-heading"
                  className="mt-1.5 text-[2rem] font-bold leading-[1.08] tracking-[-0.025em] text-um-text-strong sm:text-[2.5rem]"
                >
                  Worth a closer look.
                </h2>
              </div>
              <p className="hidden max-w-xs text-right text-sm leading-6 text-um-text sm:block">
                Selected from listings currently available to the Waterloo community.
              </p>
            </div>
            <ListingGrid listings={additionalFeatured} />
          </section>
        ) : null}

        {canSell ? (
          <section
            className="relative isolate mt-16 overflow-hidden bg-um-ink-950 px-6 py-9 text-um-text-inverse shadow-[0_22px_60px_rgba(5,7,11,0.16)] sm:px-9 sm:py-10 lg:mt-24 lg:px-12"
            aria-labelledby="sell-cta-heading"
          >
            <CampusRouteGraphic className="absolute inset-y-0 right-0 -z-10 w-[62%] opacity-[0.45]" />
            <div
              className="absolute inset-0 -z-10 bg-gradient-to-r from-um-ink-950 via-um-ink-950/95 to-um-ink-950/45"
              aria-hidden="true"
            />
            <div className="sm:flex sm:items-center sm:justify-between sm:gap-8">
              <div className="max-w-xl">
                <p className="text-xs font-semibold tracking-[0.06em] text-um-gold-300">
                  Heading out for co-op?
                </p>
                <h2
                  id="sell-cta-heading"
                  className="mt-2 text-3xl font-bold leading-[1.08] tracking-[-0.025em] sm:text-4xl"
                >
                  Pass on what you won’t need.
                </h2>
                <p className="mt-2 text-sm leading-6 text-white/70">
                  A clear photo and a familiar pickup point is enough to get started.
                </p>
              </div>
              <Link
                href="/listings/new"
                className="mt-6 inline-flex min-h-12 shrink-0 items-center gap-2 rounded-um-sm bg-um-gold-400 px-5 py-2.5 text-sm font-bold text-um-ink-950 transition duration-160 ease-um-out hover:-translate-y-0.5 hover:bg-um-gold-300 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-um-ink-950 sm:mt-0"
              >
                <Plus className="size-4" aria-hidden="true" />
                Create a listing
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
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
