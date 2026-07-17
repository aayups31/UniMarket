import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import {
  Archive,
  Armchair,
  BookOpenText,
  FileEdit,
  ImageIcon,
  MonitorSmartphone,
  Plus,
  Radio,
  BadgeCheck,
  Shapes,
  Shirt,
  Store,
  type LucideIcon,
} from 'lucide-react';

import { CampusRouteGraphic } from '@/components/ui/CampusRouteGraphic';
import { ListingManagementActions } from '@/features/listings/components/ListingManagementActions';
import { getManagedListings, type ManagedListing } from '@/features/listings/editor-queries';
import { requireStudentSeller } from '@/lib/auth/session';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'My listings',
  description: 'Manage your UniMarket drafts and published listings.',
};

export const dynamic = 'force-dynamic';

const GROUPS = [
  {
    status: 'draft' as const,
    label: 'Drafts',
    description: 'Private works in progress. Only you can see these.',
    icon: FileEdit,
  },
  {
    status: 'published' as const,
    label: 'Live on campus',
    description: 'Listings visible to verified Waterloo students.',
    icon: Radio,
  },
  {
    status: 'sold' as const,
    label: 'Sold',
    description: 'Completed exchanges, kept here until you are ready to delete them.',
    icon: BadgeCheck,
  },
  {
    status: 'archived' as const,
    label: 'Archived',
    description: 'Listings you have taken off the marketplace.',
    icon: Archive,
  },
];

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  electronics: MonitorSmartphone,
  books: BookOpenText,
  household: Armchair,
  'household-items': Armchair,
  clothing: Shirt,
};

export default async function MyListingsPage() {
  const viewer = await requireStudentSeller('/my-listings');
  const listings = await getManagedListings(viewer.id);
  const counts = Object.fromEntries(
    GROUPS.map((group) => [
      group.status,
      listings.filter((listing) => listing.status === group.status).length,
    ]),
  ) as Record<ManagedListing['status'], number>;

  return (
    <div className="bg-um-canvas pb-24 lg:pb-28">
      <header className="relative isolate overflow-hidden bg-um-ink-950 text-white">
        <CampusRouteGraphic className="pointer-events-none absolute inset-y-0 right-0 hidden w-[48%] opacity-35 lg:block" />
        <div className="relative mx-auto grid max-w-um-content gap-8 px-4 py-12 sm:px-6 sm:py-14 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:px-8 lg:py-16">
          <div>
            <p className="font-condensed flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-um-gold-400">
              <span aria-hidden="true" className="h-0.5 w-8 bg-um-gold-500" />
              Seller workspace
            </p>
            <h1 className="mt-4 max-w-4xl text-[clamp(2.7rem,7vw,5.5rem)] font-bold leading-[0.92] tracking-[-0.06em] text-white">
              Your listings.
              <span className="font-editorial ml-2 font-normal italic text-white/55">
                All in one place.
              </span>
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/58 sm:text-base">
              Continue a draft, keep a live listing accurate, or make space before the next term.
            </p>
          </div>

          <Link
            className="inline-flex min-h-12 w-fit shrink-0 items-center justify-center gap-2 rounded-um-sm bg-um-gold-400 px-5 text-sm font-bold text-um-ink-950 shadow-um-xs transition duration-160 ease-um-out hover:-translate-y-0.5 hover:bg-um-gold-300 hover:shadow-um-sm"
            href="/listings/new"
          >
            <Plus aria-hidden="true" className="size-[1.1rem]" strokeWidth={2.1} />
            Create listing
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-um-content px-4 sm:px-6 lg:px-8">
        <section aria-label="Listing totals" className="grid grid-cols-3 border-b border-black/10">
          {GROUPS.map((group, index) => {
            const Icon = group.icon;
            return (
              <div
                className={cn(
                  'py-5 sm:flex sm:items-center sm:gap-3',
                  index > 0 && 'border-l border-black/10 pl-4 sm:pl-6',
                )}
                key={group.status}
              >
                <span className="hidden size-9 shrink-0 place-items-center rounded-full bg-um-surface-warm text-um-text-muted sm:grid">
                  <Icon aria-hidden="true" className="size-4" strokeWidth={1.8} />
                </span>
                <span>
                  <strong className="block text-xl font-bold tabular-nums text-um-text-strong sm:text-2xl">
                    {counts[group.status]}
                  </strong>
                  <span className="font-condensed mt-0.5 block text-[0.66rem] font-semibold uppercase tracking-[0.11em] text-um-text-muted sm:text-xs">
                    {group.status === 'published' ? 'Live' : group.label}
                  </span>
                </span>
              </div>
            );
          })}
        </section>

        {listings.length === 0 ? (
          <EmptyListings />
        ) : (
          <div className="space-y-16 pt-12 sm:pt-14 lg:space-y-20">
            {GROUPS.map((group) => {
              const groupListings = listings.filter((listing) => listing.status === group.status);
              if (groupListings.length === 0) return null;

              const Icon = group.icon;
              return (
                <section aria-labelledby={`${group.status}-heading`} key={group.status}>
                  <div className="mb-6 flex items-end justify-between gap-5">
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-full bg-um-gold-300/[0.35] text-um-gold-700">
                        <Icon aria-hidden="true" className="size-4" strokeWidth={1.8} />
                      </span>
                      <div>
                        <h2
                          className="text-2xl font-bold tracking-[-0.035em] text-um-text-strong"
                          id={`${group.status}-heading`}
                        >
                          {group.label}
                        </h2>
                        <p className="mt-1 text-sm leading-6 text-um-text-muted">
                          {group.description}
                        </p>
                      </div>
                    </div>
                    <span className="font-condensed shrink-0 text-xs font-bold uppercase tracking-[0.12em] text-um-text-muted">
                      {groupListings.length} {groupListings.length === 1 ? 'item' : 'items'}
                    </span>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-12">
                    {groupListings.map((listing, index) => (
                      <ManagedListingCard
                        featured={index === 0}
                        key={listing.id}
                        listing={listing}
                      />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function ManagedListingCard({ featured, listing }: { featured: boolean; listing: ManagedListing }) {
  const title = listing.title.trim() || 'Untitled draft';
  const CategoryIcon = listing.category
    ? (CATEGORY_ICONS[listing.category.slug] ?? Shapes)
    : Shapes;

  return (
    <article
      className={cn(
        'group overflow-hidden rounded-um-md bg-um-surface shadow-um-xs ring-1 ring-black/[0.06] transition duration-220 ease-um-out hover:-translate-y-0.5 hover:shadow-um-sm',
        featured ? 'xl:col-span-6' : 'xl:col-span-3',
      )}
    >
      <div
        className={cn(
          'relative overflow-hidden bg-um-surface-warm',
          featured ? 'aspect-[16/10]' : 'aspect-[4/3]',
        )}
      >
        {listing.coverUrl ? (
          <Image
            alt={`Cover for ${title}`}
            className="object-cover transition duration-300 ease-um-out group-hover:scale-[1.015]"
            fill
            sizes="(min-width: 1280px) 30vw, (min-width: 768px) 46vw, 100vw"
            src={listing.coverUrl}
            unoptimized
          />
        ) : (
          <div className="grid h-full place-items-center text-um-text-muted/[0.45]">
            <div className="text-center">
              <ImageIcon aria-hidden="true" className="mx-auto size-8" strokeWidth={1.5} />
              <p className="mt-2 text-xs font-medium">No cover photo yet</p>
            </div>
          </div>
        )}

        <span
          className={cn(
            'font-condensed absolute left-3 top-3 rounded-full px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-[0.12em] shadow-um-xs',
            statusBadgeClassName(listing.status),
          )}
        >
          {listing.status === 'published'
            ? 'Live'
            : listing.status === 'sold'
              ? 'Sold'
              : listing.status}
        </span>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 truncate font-condensed text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-um-text-muted">
              <CategoryIcon aria-hidden="true" className="size-3.5 shrink-0" strokeWidth={1.8} />
              {listing.category?.name ?? 'Category not set'}
            </p>
            <h3 className="mt-2 line-clamp-2 text-lg font-bold leading-6 tracking-[-0.025em] text-um-text-strong">
              {title}
            </h3>
          </div>
          <p className="shrink-0 text-sm font-bold tabular-nums text-um-text-strong">
            {formatManagedPrice(listing.priceCents)}
          </p>
        </div>

        <p className="mt-3 text-xs text-um-text-muted">
          {listing.status === 'published' && listing.publishedAt
            ? `Published ${formatDate(listing.publishedAt)}`
            : `Updated ${formatDate(listing.updatedAt)}`}
        </p>

        <div className="mt-5 border-t border-black/[0.08] pt-4">
          <ListingManagementActions listingId={listing.id} status={listing.status} />
        </div>
      </div>
    </article>
  );
}

function EmptyListings() {
  return (
    <section className="relative my-12 overflow-hidden rounded-um-lg bg-um-ink-900 px-6 py-16 text-white shadow-um-md sm:my-16 sm:px-10 sm:py-20 lg:px-14">
      <CampusRouteGraphic className="pointer-events-none absolute inset-y-0 right-0 w-full opacity-25 sm:w-[62%]" />
      <div className="relative max-w-xl">
        <span className="grid size-12 place-items-center border border-white/10 bg-white/[0.06] text-um-gold-400">
          <Store aria-hidden="true" className="size-5" strokeWidth={1.8} />
        </span>
        <p className="font-condensed mt-6 text-xs font-bold uppercase tracking-[0.16em] text-um-gold-400">
          Your first listing
        </p>
        <h2 className="font-editorial mt-2 text-4xl tracking-[-0.035em] text-white sm:text-5xl">
          Pass something on.
        </h2>
        <p className="mt-4 max-w-lg leading-7 text-white/58">
          Start privately. Add a few clear photos, set a campus pickup area, and publish when it is
          ready for another student.
        </p>
        <Link
          className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-um-sm bg-um-gold-400 px-5 text-sm font-bold text-um-ink-950 shadow-um-xs transition duration-160 ease-um-out hover:-translate-y-0.5 hover:bg-um-gold-300 hover:shadow-um-sm"
          href="/listings/new"
        >
          <Plus aria-hidden="true" className="size-4" />
          Create your first listing
        </Link>
      </div>
    </section>
  );
}

function statusBadgeClassName(status: ManagedListing['status']) {
  if (status === 'published') return 'bg-um-success text-white';
  if (status === 'sold') return 'bg-um-gold-400 text-um-ink-950';
  if (status === 'archived') return 'bg-um-ink-900 text-white';
  return 'bg-um-gold-400 text-um-ink-950';
}

function formatManagedPrice(priceCents: number | null) {
  if (priceCents === null) return 'Price not set';
  if (priceCents === 0) return 'Free';
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    maximumFractionDigits: priceCents % 100 === 0 ? 0 : 2,
  }).format(priceCents / 100);
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'recently';

  return new Intl.DateTimeFormat('en-CA', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() === new Date().getFullYear() ? undefined : 'numeric',
  }).format(date);
}
