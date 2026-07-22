import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, X } from 'lucide-react';

import { ListingGrid } from '@/features/marketplace/components/ListingGrid';
import { MarketplaceEmptyState } from '@/features/marketplace/components/MarketplaceEmptyState';
import { MarketplacePagination } from '@/features/marketplace/components/MarketplacePagination';
import { MarketplaceSearch } from '@/features/marketplace/components/MarketplaceSearch';
import { getMarketplacePage } from '@/features/marketplace/queries';
import {
  firstSearchParam,
  marketplaceCategoryHref,
  marketplaceHref,
} from '@/features/marketplace/url';
import { requireMarketplaceViewer } from '@/lib/auth/session';

export const metadata: Metadata = {
  title: 'Browse by category | UniMarket',
  description: 'New listings from verified University of Waterloo students.',
};

export const dynamic = 'force-dynamic';

type MarketplaceCategoryPageProps = {
  params: Promise<{ category: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function MarketplaceCategoryPage({
  params,
  searchParams,
}: MarketplaceCategoryPageProps) {
  const { category: categorySlug } = await params;
  const viewer = await requireMarketplaceViewer(
    `/marketplace/categories/${encodeURIComponent(categorySlug)}`,
  );
  const queryParams = await searchParams;
  const query = firstSearchParam(queryParams.q) ?? '';
  const pageParam = Number.parseInt(firstSearchParam(queryParams.page) ?? '1', 10);
  const data = await getMarketplacePage({
    query,
    category: categorySlug,
    page: Number.isNaN(pageParam) ? 1 : pageParam,
  });
  const activeCategory = data.categories.find((category) => category.slug === data.category);

  if (!activeCategory) notFound();

  const canSell = viewer.profile.role === 'student';
  const scopePath = `/marketplace/categories/${encodeURIComponent(activeCategory.slug)}`;
  const isFiltered = Boolean(data.query);
  const rangeStart = data.total === 0 ? 0 : (data.page - 1) * data.pageSize + 1;
  const rangeEnd = Math.min(data.page * data.pageSize, data.total);

  return (
    <div className="min-h-screen bg-um-canvas text-um-text-strong">
      <div className="mx-auto max-w-um-content px-4 pt-4 sm:px-6 sm:pt-5 lg:px-8">
        <header className="border-b border-white/[0.08] pb-5 sm:pb-6">
          <div className="flex items-center">
            <Link
              className="inline-flex min-h-10 w-fit items-center gap-2 rounded-full px-2.5 text-xs font-semibold text-white/58 transition duration-160 hover:bg-white/[0.07] hover:text-white focus-visible:ring-2 focus-visible:ring-um-gold-300"
              href={marketplaceHref({})}
            >
              <ArrowLeft aria-hidden="true" className="size-3.5" />
              Back to marketplace
            </Link>
          </div>

          <div className="mt-3 grid items-center gap-4 lg:grid-cols-[minmax(12rem,0.4fr)_minmax(28rem,0.6fr)] lg:gap-8">
            <div className="min-w-0 py-1">
              <h1 className="text-[clamp(2.25rem,4vw,3.75rem)] font-bold leading-[1.02] tracking-[-0.055em] text-white">
                {activeCategory.label}
              </h1>
            </div>
            <MarketplaceSearch category={null} query={data.query} scopePath={scopePath} />
          </div>
        </header>

        <section
          aria-labelledby="category-listings-heading"
          className="pb-20 pt-6 sm:pt-7 lg:pb-28"
        >
          <div className="mb-5 flex items-center justify-between gap-4 sm:mb-6">
            <div className="min-w-0">
              <h2
                className="truncate text-xl font-bold leading-tight tracking-[-0.03em] text-white sm:text-2xl"
                id="category-listings-heading"
              >
                {data.query ? `“${data.query}”` : 'Just listed'}
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
                  href={scopePath}
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
                category={activeCategory.slug}
                page={data.page}
                query={data.query}
                scopePath={scopePath}
                totalPages={data.totalPages}
              />
            </>
          ) : (
            <MarketplaceEmptyState
              canSell={canSell}
              emptyPage={data.total > 0}
              filtered={isFiltered}
              firstPageHref={marketplaceCategoryHref(activeCategory.slug, { query: data.query })}
            />
          )}
        </section>
      </div>
    </div>
  );
}
