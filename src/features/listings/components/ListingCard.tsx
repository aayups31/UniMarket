import Image from 'next/image';
import Link from 'next/link';
import { ImageIcon, MapPin } from 'lucide-react';

import { formatCondition, formatPostedTime, formatPrice } from '@/features/marketplace/format';
import type { MarketplaceListing } from '@/features/marketplace/types';
import { WaterlooVerificationBadge } from '@/features/profiles/components/WaterlooVerificationBadge';

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
    <article className="group min-w-0">
      <Link
        aria-label={`View ${listing.title}`}
        className="relative block aspect-[4/3] overflow-hidden rounded-[0.9rem] border border-white/[0.08] bg-um-surface-warm shadow-[0_14px_38px_rgba(0,0,0,0.16)] transition duration-220 ease-um-out group-hover:-translate-y-0.5 group-hover:border-white/[0.16] group-hover:shadow-[0_20px_48px_rgba(0,0,0,0.24)] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-um-gold-300"
        href={`/listings/${listing.id}`}
      >
        {coverImage?.url ? (
          <Image
            alt={listing.title}
            className="object-cover transition duration-500 ease-um-out group-hover:scale-[1.015]"
            fill
            priority={priority}
            sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 500px) 50vw, 100vw"
            src={coverImage.url}
          />
        ) : (
          <div
            className="grid h-full place-items-center bg-[#111923] text-white/38"
            aria-hidden="true"
          >
            <ImageIcon className="size-7" strokeWidth={1.45} />
          </div>
        )}

        <span
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/55 to-transparent opacity-70"
        />
        {listing.featuredAt ? (
          <span className="absolute left-3 top-3 border-l-2 border-um-gold-300 bg-black/70 px-2 py-1 text-[0.63rem] font-bold uppercase tracking-[0.12em] text-white backdrop-blur-sm">
            Campus pick
          </span>
        ) : null}
      </Link>

      <div className="px-0.5 pt-3.5">
        <div className="flex items-center justify-between gap-3 text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-white/46">
          <span className="truncate">{listing.category?.label ?? 'Marketplace'}</span>
          {postedTime ? <time dateTime={postedAt}>{postedTime}</time> : null}
        </div>

        <div className="mt-1.5 flex items-start justify-between gap-3">
          <h3 className="line-clamp-2 min-w-0 text-[1rem] font-semibold leading-[1.35] tracking-[-0.022em] text-white sm:text-[1.05rem]">
            <Link
              className="rounded-sm transition-colors duration-160 hover:text-um-gold-200 focus-visible:ring-2 focus-visible:ring-um-gold-300"
              href={`/listings/${listing.id}`}
            >
              {listing.title}
            </Link>
          </h3>
          <p className="shrink-0 text-[1.08rem] font-bold tracking-[-0.035em] text-um-gold-200">
            {formatPrice(listing.priceCents)}
          </p>
        </div>

        <div className="mt-3 flex min-w-0 items-center gap-2 text-xs text-white/48">
          <MapPin aria-hidden="true" className="size-3.5 shrink-0" strokeWidth={1.8} />
          <span className="truncate">{listing.pickupArea || 'Pickup arranged'}</span>
          {condition ? (
            <>
              <span aria-hidden="true" className="text-white/20">
                /
              </span>
              <span className="shrink-0">{condition}</span>
            </>
          ) : null}
        </div>

        <div className="mt-2 flex min-w-0 items-center gap-1.5 text-[0.72rem] text-white/42">
          {listing.seller ? (
            <Link
              className="flex min-w-0 items-center gap-1.5 rounded-sm transition-colors duration-160 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-um-gold-300"
              href={`/profile/${listing.seller.id}`}
            >
              <span className="truncate">{listing.seller.fullName}</span>
              <WaterlooVerificationBadge iconOnly size="xs" />
            </Link>
          ) : (
            <span className="truncate">Waterloo student</span>
          )}
          {listing.openToOffers ? (
            <>
              <span aria-hidden="true" className="mx-0.5 text-white/18">
                ·
              </span>
              <span className="shrink-0 text-um-gold-300/75">Offers</span>
            </>
          ) : null}
        </div>
      </div>
    </article>
  );
}
