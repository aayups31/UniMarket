import { ListingCard } from '@/features/listings/components/ListingCard';

import type { MarketplaceListing } from '../types';

type ListingGridProps = {
  listings: MarketplaceListing[];
  prioritizeFirst?: boolean;
};

export function ListingGrid({ listings, prioritizeFirst = false }: ListingGridProps) {
  return (
    <div className="grid grid-cols-1 gap-x-4 gap-y-6 min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-5 xl:gap-y-7">
      {listings.map((listing, index) => (
        <ListingCard key={listing.id} listing={listing} priority={prioritizeFirst && index < 2} />
      ))}
    </div>
  );
}
