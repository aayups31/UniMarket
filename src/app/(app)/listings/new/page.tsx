import type { Metadata } from 'next';

import { ListingComposer } from '@/features/listings/components/ListingComposer';
import { getListingEditorOptions } from '@/features/listings/editor-queries';
import { requireStudentSeller } from '@/lib/auth/session';

export const metadata: Metadata = {
  title: 'Create a listing',
  description: 'List an item for verified University of Waterloo students.',
};

export const dynamic = 'force-dynamic';

export default async function NewListingPage() {
  const [viewer, options] = await Promise.all([
    requireStudentSeller('/listings/new'),
    getListingEditorOptions(),
  ]);

  return (
    <ListingComposer
      categories={options.categories}
      pickupAreas={options.pickupAreas}
      sellerName={viewer.profile.full_name ?? 'Waterloo student'}
    />
  );
}
