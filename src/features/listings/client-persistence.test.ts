import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  createClient: vi.fn(),
  getClaims: vi.fn(),
  rpc: vi.fn(),
}));

vi.mock('@/lib/supabase/client', () => ({
  createClient: mocks.createClient,
}));

import { publishListingInBrowser, saveListingDraftInBrowser } from './client-persistence';

const listingId = '8c81de20-b1f7-4e1e-9e65-218761468de1';
const sellerId = '8ff70646-5bcb-4c31-9fd1-837f794a2457';

const draft = {
  listingId,
  title: 'Calculus textbook',
  description: 'Clean copy with a few pencil notes.',
  priceCents: 3500,
  categoryId: 7,
  condition: 'good' as const,
  openToOffers: true,
  pickupArea: 'Waterloo Campus',
};

const saveDraftArgs = {
  p_listing_id: listingId,
  p_title: draft.title,
  p_description: draft.description,
  p_price_cents: draft.priceCents,
  p_category_id: draft.categoryId,
  p_condition: draft.condition,
  p_open_to_offers: draft.openToOffers,
  p_pickup_area: draft.pickupArea,
};

describe('browser listing persistence', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.createClient.mockReturnValue({
      auth: { getClaims: mocks.getClaims },
      rpc: mocks.rpc,
    });
    mocks.getClaims.mockResolvedValue({
      data: { claims: { sub: sellerId } },
      error: null,
    });
  });

  it('saves a reserved draft ID through the authenticated workflow', async () => {
    mocks.rpc.mockResolvedValue({
      data: { id: listingId, version: 1 },
      error: null,
    });

    await expect(saveListingDraftInBrowser(draft)).resolves.toEqual({
      ok: true,
      data: { id: listingId, version: 1 },
    });

    expect(mocks.rpc).toHaveBeenCalledWith('save_listing_draft', saveDraftArgs);
  });

  it('saves the listing before publishing it through the database workflow', async () => {
    mocks.rpc
      .mockResolvedValueOnce({ data: { id: listingId, version: 4 }, error: null })
      .mockResolvedValueOnce({ data: { id: listingId }, error: null });

    await expect(publishListingInBrowser(draft)).resolves.toEqual({
      ok: true,
      data: { id: listingId },
    });

    expect(mocks.rpc).toHaveBeenNthCalledWith(1, 'save_listing_draft', saveDraftArgs);
    expect(mocks.rpc).toHaveBeenNthCalledWith(2, 'publish_listing', {
      p_listing_id: listingId,
    });
  });

  it('explains when an unfinished photo is blocking publication', async () => {
    mocks.rpc
      .mockResolvedValueOnce({ data: { id: listingId, version: 4 }, error: null })
      .mockResolvedValueOnce({
        data: null,
        error: {
          code: '22023',
          message: 'Wait for every image upload to finish before publishing.',
        },
      });

    await expect(publishListingInBrowser(draft)).resolves.toEqual({
      ok: false,
      message:
        'One photo did not finish uploading. Remove the photo marked “Needs attention,” then add it again.',
    });
  });

  it('does not write when the browser session has no verified seller claim', async () => {
    mocks.getClaims.mockResolvedValue({ data: { claims: {} }, error: null });

    await expect(saveListingDraftInBrowser(draft)).resolves.toEqual({
      ok: false,
      message: 'Your session expired. Refresh the page and sign in again before saving.',
    });

    expect(mocks.rpc).not.toHaveBeenCalled();
  });
});
