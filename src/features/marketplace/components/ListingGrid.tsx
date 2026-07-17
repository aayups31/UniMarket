import { Fragment } from 'react';
import { MapPin } from 'lucide-react';

import { CampusRouteGraphic } from '@/components/ui/CampusRouteGraphic';
import { ListingCard } from '@/features/listings/components/ListingCard';

import type { MarketplaceListing } from '../types';

type ListingGridProps = {
  listings: MarketplaceListing[];
  prioritizeFirst?: boolean;
};

export function ListingGrid({ listings, prioritizeFirst = false }: ListingGridProps) {
  return (
    <div className="grid grid-cols-1 gap-x-4 gap-y-8 min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-5 xl:gap-y-10">
      {listings.map((listing, index) => (
        <Fragment key={listing.id}>
          <ListingCard listing={listing} priority={prioritizeFirst && index < 2} />
          {index === 5 && listings.length > 7 ? <CampusPickupInterlude /> : null}
        </Fragment>
      ))}
    </div>
  );
}

function CampusPickupInterlude() {
  return (
    <aside className="relative isolate min-h-[14rem] overflow-hidden bg-um-ink-900 px-5 py-6 text-um-text-inverse shadow-[0_12px_34px_rgba(5,7,11,0.13)] min-[480px]:col-span-2 sm:px-7 lg:min-h-0 xl:px-8">
      <CampusRouteGraphic className="absolute inset-y-0 right-0 -z-10 w-[70%] opacity-[0.55]" />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-r from-um-ink-900 via-um-ink-900/95 to-um-ink-900/35"
      />
      <div className="flex h-full max-w-sm flex-col justify-between">
        <p className="font-condensed flex items-center gap-2 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-um-gold-300">
          <MapPin className="size-3.5" aria-hidden="true" />
          Pickup, close to where you already are
        </p>
        <div className="mt-10">
          <p className="text-xl font-bold leading-tight tracking-[-0.035em] sm:text-2xl">
            DC after class. SLC between meetings. Ring Road on the way home.
          </p>
          <p className="mt-2 text-xs leading-5 text-white/48">
            Meet publicly. Inspect first. Keep it simple.
          </p>
        </div>
      </div>
    </aside>
  );
}
