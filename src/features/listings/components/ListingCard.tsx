import Link from 'next/link';
import Image from 'next/image';
import { BadgeCheck, Clock3, ImageIcon, MapPin } from 'lucide-react';

import { formatCondition, formatPostedTime, formatPrice } from '@/features/marketplace/format';
import type { MarketplaceListing } from '@/features/marketplace/types';

type ListingCardProps = {
  listing: MarketplaceListing;
  priority?: boolean;
};

export function ListingCard({ listing, priority = false }: ListingCardProps) {
  const coverImage = listing.images[0];
  const condition = formatCondition(listing.condition);
  const postedAt = listing.publishedAt ?? listing.createdAt;
  const postedTime = formatPostedTime(postedAt);

  return (
    <article className="group flex min-w-0 flex-col overflow-hidden rounded-um-lg border border-black/10 bg-um-surface shadow-um-xs transition duration-220 ease-um-out hover:-translate-y-0.5 hover:border-black/20 hover:shadow-um-sm">
      <Link
        href={`/listings/${listing.id}`}
        className="relative block aspect-[4/3] overflow-hidden bg-um-surface-warm focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-um-ink-950"
        aria-label={`View ${listing.title}`}
      >
        {coverImage?.url ? (
          <Image
            src={coverImage.url}
            alt={listing.title}
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 480px) 50vw, 100vw"
            className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-[1.018]"
            priority={priority}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center" aria-hidden="true">
            <div className="text-center text-um-text-muted">
              <span className="mx-auto flex size-12 items-center justify-center rounded-um-md bg-um-surface shadow-um-xs ring-1 ring-black/10">
                <ImageIcon className="size-5" strokeWidth={1.7} />
              </span>
              <span className="mt-2.5 block text-xs font-medium">Photo unavailable</span>
            </div>
          </div>
        )}

        {listing.featuredAt ? (
          <span className="font-condensed absolute left-3 top-3 rounded-full border border-black/10 bg-um-gold-500 px-2.5 py-1 text-[0.67rem] font-bold uppercase tracking-[0.12em] text-um-ink-950 shadow-um-xs">
            Featured
          </span>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col p-4 sm:p-[1.125rem]">
        <div className="flex items-center justify-between gap-3 text-[0.69rem] font-semibold">
          <p className="font-condensed truncate uppercase tracking-[0.12em] text-um-text-muted">
            {listing.category?.label ?? 'Marketplace'}
          </p>
          {postedTime ? (
            <time
              dateTime={postedAt}
              className="flex shrink-0 items-center gap-1.5 font-medium text-um-text-muted"
            >
              <Clock3 className="size-3.5" strokeWidth={1.8} aria-hidden="true" />
              {postedTime}
            </time>
          ) : null}
        </div>

        <h3 className="mt-2 line-clamp-2 min-h-[2.8rem] text-[1.02rem] font-bold leading-[1.4] tracking-[-0.022em] text-um-text-strong">
          <Link
            href={`/listings/${listing.id}`}
            className="rounded-sm focus-visible:ring-2 focus-visible:ring-um-ink-950"
          >
            {listing.title}
          </Link>
        </h3>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <p className="text-[1.15rem] font-bold tracking-[-0.035em] text-um-text-strong">
            {formatPrice(listing.priceCents)}
          </p>
          {listing.openToOffers ? (
            <span className="rounded-full bg-um-gold-300/45 px-2 py-1 text-[0.65rem] font-bold text-um-gold-700">
              Offers welcome
            </span>
          ) : null}
        </div>

        <div className="mt-3 min-h-5 text-xs text-um-text-muted">
          <span className="flex min-w-0 items-center gap-1.5">
            <MapPin className="size-3.5 shrink-0" strokeWidth={1.8} aria-hidden="true" />
            <span className="truncate">{listing.pickupArea || 'Pickup arranged with seller'}</span>
            {condition ? (
              <>
                <span className="text-um-text-muted/40" aria-hidden="true">
                  ·
                </span>
                <span className="shrink-0">{condition}</span>
              </>
            ) : null}
          </span>
        </div>

        <div className="mt-4 flex min-w-0 items-center border-t border-black/10 pt-3.5 text-xs text-um-text-muted">
          <span className="flex min-w-0 items-center gap-1.5">
            <span className="truncate">{listing.seller?.fullName ?? 'Waterloo student'}</span>
            <BadgeCheck
              className="size-3.5 shrink-0 text-um-gold-700"
              aria-label="Verified Waterloo student"
            />
          </span>
        </div>
      </div>
    </article>
  );
}
