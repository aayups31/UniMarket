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
    <article className="group flex min-w-0 flex-col">
      <Link
        href={`/listings/${listing.id}`}
        className="relative block aspect-[5/4] overflow-hidden rounded-[1.05rem] bg-um-surface-warm shadow-[0_9px_26px_rgba(5,7,11,0.09)] transition duration-220 ease-um-out group-hover:-translate-y-0.5 group-hover:shadow-[0_16px_38px_rgba(5,7,11,0.14)] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-um-ink-950"
        aria-label={`View ${listing.title}`}
      >
        {coverImage?.url ? (
          <Image
            src={coverImage.url}
            alt={listing.title}
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 480px) 50vw, 100vw"
            className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-[1.015]"
            priority={priority}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center" aria-hidden="true">
            <div className="text-center text-um-text-muted">
              <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-um-surface/80 shadow-um-xs">
                <ImageIcon className="size-5" strokeWidth={1.7} />
              </span>
              <span className="mt-2.5 block text-xs font-medium">Photo unavailable</span>
            </div>
          </div>
        )}

        <span className="font-condensed absolute left-3 top-3 rounded-full bg-um-ink-950/82 px-2.5 py-1 text-[0.64rem] font-bold uppercase tracking-[0.13em] text-white/78 shadow-um-xs backdrop-blur-sm">
          {listing.category?.label ?? 'Marketplace'}
        </span>
        {listing.featuredAt ? (
          <span className="font-condensed absolute right-3 top-3 rounded-full bg-um-gold-300 px-2.5 py-1 text-[0.64rem] font-bold uppercase tracking-[0.13em] text-um-ink-950 shadow-um-xs">
            Campus pick
          </span>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col px-1 pb-2 pt-4">
        <h3 className="line-clamp-2 min-h-[2.75rem] text-[1.02rem] font-bold leading-[1.36] tracking-[-0.028em] text-um-text-strong sm:text-[1.06rem]">
          <Link
            href={`/listings/${listing.id}`}
            className="rounded-sm focus-visible:ring-2 focus-visible:ring-um-ink-950"
          >
            {listing.title}
          </Link>
        </h3>

        <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <p className="text-[1.22rem] font-bold tracking-[-0.045em] text-um-text-strong">
            {formatPrice(listing.priceCents)}
          </p>
          {listing.openToOffers ? (
            <span className="text-[0.68rem] font-semibold text-um-gold-700">Offers welcome</span>
          ) : null}
        </div>

        <div className="mt-3 min-h-5 text-xs text-um-text-muted">
          <span className="flex min-w-0 items-center gap-1.5">
            <MapPin className="size-3.5 shrink-0" strokeWidth={1.8} aria-hidden="true" />
            <span className="truncate">{listing.pickupArea || 'Pickup arranged with seller'}</span>
            {postedTime ? (
              <>
                <span className="text-um-text-muted/40" aria-hidden="true">
                  ·
                </span>
                <time dateTime={postedAt} className="flex shrink-0 items-center gap-1">
                  <Clock3 className="size-3" strokeWidth={1.8} aria-hidden="true" />
                  {postedTime}
                </time>
              </>
            ) : null}
          </span>
        </div>

        <div className="mt-3 flex min-w-0 items-center justify-between gap-2 text-xs text-um-text-muted">
          <span className="flex min-w-0 items-center gap-1.5" title="Verified Waterloo student">
            <span className="truncate">{listing.seller?.fullName ?? 'Waterloo student'}</span>
            <BadgeCheck
              className="size-3.5 shrink-0 text-um-gold-700"
              aria-label="Verified Waterloo student"
            />
          </span>
          {condition ? <span className="shrink-0 text-[0.68rem]">{condition}</span> : null}
        </div>
      </div>
    </article>
  );
}
