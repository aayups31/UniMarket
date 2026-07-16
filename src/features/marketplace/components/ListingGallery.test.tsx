import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import type { MarketplaceListing } from '../types';
import { ListingGallery } from './ListingGallery';

const listing: MarketplaceListing = {
  id: '51000000-0000-4000-8000-000000000005',
  sellerId: '10000000-0000-4000-8000-000000000001',
  title: 'Desk lamp',
  description: 'A useful lamp.',
  priceCents: 2500,
  condition: 'good',
  openToOffers: false,
  pickupArea: 'Waterloo Campus',
  featuredAt: null,
  publishedAt: '2026-07-15T00:00:00.000Z',
  createdAt: '2026-07-15T00:00:00.000Z',
  category: null,
  seller: null,
  images: [
    {
      id: 'image-one',
      position: 0,
      storagePath: 'seller/listing/one.jpg',
      url: 'https://example.com/one.jpg',
    },
    {
      id: 'image-two',
      position: 1,
      storagePath: 'seller/listing/two.jpg',
      url: 'https://example.com/two.jpg',
    },
  ],
};

describe('ListingGallery', () => {
  it('lets keyboard and pointer users inspect every available listing photo', async () => {
    const user = userEvent.setup();
    render(<ListingGallery listing={listing} />);

    expect(screen.getByRole('img', { name: 'Desk lamp, photo 1 of 2' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Show photo 1 of 2' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );

    await user.click(screen.getByRole('button', { name: 'Show photo 2 of 2' }));

    expect(screen.getByRole('img', { name: 'Desk lamp, photo 2 of 2' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Show photo 2 of 2' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });
});
