import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  publishListingAction: vi.fn(),
  publishListingInBrowser: vi.fn(),
  push: vi.fn(),
  refresh: vi.fn(),
  saveListingDraftAction: vi.fn(),
  saveListingDraftInBrowser: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mocks.push, refresh: mocks.refresh }),
}));

vi.mock('../actions', () => ({
  publishListingAction: mocks.publishListingAction,
  saveListingDraftAction: mocks.saveListingDraftAction,
}));

vi.mock('../client-persistence', () => ({
  publishListingInBrowser: mocks.publishListingInBrowser,
  saveListingDraftInBrowser: mocks.saveListingDraftInBrowser,
}));

vi.mock('./ImageUploader', async () => {
  const React = await import('react');
  const uploadedImages = [
    {
      id: 'image-one',
      url: '/images/test-listing.jpg',
      path: 'seller/listing/image-one.jpg',
      progress: 100,
      status: 'uploaded' as const,
      name: 'test-listing.jpg',
    },
  ];

  return {
    ImageUploader: ({
      onImagesChange,
    }: {
      onImagesChange?: (images: typeof uploadedImages) => void;
    }) => {
      React.useEffect(() => onImagesChange?.(uploadedImages), [onImagesChange]);
      return <section id="images">One uploaded photo</section>;
    },
  };
});

import { ListingComposer } from './ListingComposer';

const categories = [{ id: 7, slug: 'books', name: 'Books', icon: 'book' }];
const pickupAreas = ['Waterloo Campus'];

beforeAll(() => {
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
});

afterAll(() => vi.unstubAllGlobals());
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

function renderComposer() {
  return render(
    <ListingComposer
      categories={categories}
      pickupAreas={pickupAreas}
      sellerName="A Waterloo student"
    />,
  );
}

describe('ListingComposer listing actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.saveListingDraftAction.mockImplementation(async (input: { listingId: string }) => ({
      ok: true,
      data: { id: input.listingId, version: 1 },
    }));
    mocks.publishListingAction.mockImplementation(async (input: { listingId: string }) => ({
      ok: true,
      data: { id: input.listingId },
    }));
    mocks.saveListingDraftInBrowser.mockImplementation(async (input: { listingId: string }) => ({
      ok: true,
      data: { id: input.listingId, version: 1 },
    }));
    mocks.publishListingInBrowser.mockImplementation(async (input: { listingId: string }) => ({
      ok: true,
      data: { id: input.listingId },
    }));
  });

  it('saves a new draft and reuses the returned listing id on the next save', async () => {
    const user = userEvent.setup();
    renderComposer();

    await user.click(screen.getAllByRole('button', { name: 'Save draft' })[0]);

    await waitFor(() => expect(mocks.saveListingDraftAction).toHaveBeenCalledTimes(1));
    const reservedId = mocks.saveListingDraftAction.mock.calls[0][0].listingId;
    expect(reservedId).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
    expect(mocks.saveListingDraftAction).toHaveBeenNthCalledWith(1, {
      listingId: reservedId,
      title: '',
      description: '',
      priceCents: null,
      categoryId: null,
      condition: null,
      openToOffers: false,
      pickupArea: '',
    });

    await waitFor(() =>
      expect(screen.getAllByRole('button', { name: 'Save draft' })[0]).toBeEnabled(),
    );
    await user.type(screen.getByLabelText('Title'), 'Desk lamp');
    await user.click(screen.getAllByRole('button', { name: 'Save draft' })[0]);

    await waitFor(() => expect(mocks.saveListingDraftAction).toHaveBeenCalledTimes(2));
    expect(mocks.saveListingDraftAction).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ listingId: reservedId, title: 'Desk lamp' }),
    );
  });

  it('saves a complete new listing before publishing it with the returned id', async () => {
    const user = userEvent.setup();
    renderComposer();

    await user.type(screen.getByLabelText('Title'), 'Calculus textbook');
    await user.type(
      screen.getByLabelText('Description'),
      'Clean copy with no missing pages and only a few pencil notes.',
    );
    await user.type(screen.getByLabelText('Price'), '35');
    await user.click(screen.getByRole('radio', { name: 'Books' }));
    await user.click(screen.getByRole('radio', { name: 'Good' }));
    await user.selectOptions(screen.getByLabelText('Pickup area'), 'Waterloo Campus');

    await user.click(screen.getAllByRole('button', { name: 'Publish listing' })[0]);

    await waitFor(() => expect(mocks.publishListingAction).toHaveBeenCalledTimes(1));

    expect(mocks.saveListingDraftAction).toHaveBeenCalledTimes(1);
    const reservedId = mocks.saveListingDraftAction.mock.calls[0][0].listingId;
    expect(reservedId).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
    expect(mocks.saveListingDraftAction).toHaveBeenCalledWith({
      listingId: reservedId,
      title: 'Calculus textbook',
      description: 'Clean copy with no missing pages and only a few pencil notes.',
      priceCents: 3500,
      categoryId: 7,
      condition: 'good',
      openToOffers: false,
      pickupArea: 'Waterloo Campus',
    });
    expect(mocks.publishListingAction).toHaveBeenCalledWith({
      listingId: reservedId,
      title: 'Calculus textbook',
      description: 'Clean copy with no missing pages and only a few pencil notes.',
      priceCents: 3500,
      categoryId: 7,
      condition: 'good',
      openToOffers: false,
      pickupArea: 'Waterloo Campus',
    });
    expect(mocks.saveListingDraftAction.mock.invocationCallOrder[0]).toBeLessThan(
      mocks.publishListingAction.mock.invocationCallOrder[0],
    );
    expect(mocks.push).toHaveBeenCalledWith(`/listings/${reservedId}?published=1`);
    expect(mocks.refresh).toHaveBeenCalledTimes(1);
  });

  it('uses the signed-in browser session when the Server Action transport fails', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    mocks.saveListingDraftAction.mockRejectedValueOnce(new Error('Server Action request failed'));
    const user = userEvent.setup();
    renderComposer();

    await user.click(screen.getAllByRole('button', { name: 'Save draft' })[0]);

    await waitFor(() => expect(mocks.saveListingDraftInBrowser).toHaveBeenCalledTimes(1));
    const reservedId = mocks.saveListingDraftAction.mock.calls[0][0].listingId;
    expect(mocks.saveListingDraftInBrowser).toHaveBeenCalledWith(
      expect.objectContaining({ listingId: reservedId }),
    );
    await waitFor(() =>
      expect(screen.getAllByText('Draft saved privately.').length).toBeGreaterThan(0),
    );
    expect(consoleError).not.toHaveBeenCalled();
  });
});
