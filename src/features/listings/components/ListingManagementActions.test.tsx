import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  archiveOwnListingAction: vi.fn(),
  deleteOwnListingAction: vi.fn(),
  markOwnListingSoldAction: vi.fn(),
  push: vi.fn(),
  refresh: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mocks.push, refresh: mocks.refresh }),
}));
vi.mock('../actions', () => ({
  archiveOwnListingAction: mocks.archiveOwnListingAction,
  deleteOwnListingAction: mocks.deleteOwnListingAction,
  markOwnListingSoldAction: mocks.markOwnListingSoldAction,
}));

import { ListingManagementActions } from './ListingManagementActions';

afterEach(cleanup);

describe('ListingManagementActions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.markOwnListingSoldAction.mockResolvedValue({
      ok: true,
      data: { id: '51000000-0000-4000-8000-000000000005' },
    });
  });

  it('moves focus into confirmation and restores it when the seller cancels', async () => {
    const user = userEvent.setup();
    render(
      <ListingManagementActions
        listingId="51000000-0000-4000-8000-000000000005"
        status="published"
      />,
    );

    const archiveTrigger = screen.getByRole('button', { name: /^Archive$/ });
    await user.click(archiveTrigger);

    const confirmAction = screen.getByRole('button', { name: 'Archive listing' });
    await waitFor(() => expect(confirmAction).toHaveFocus());

    await user.keyboard('{Escape}');

    await waitFor(() => expect(screen.getByRole('button', { name: /^Archive$/ })).toHaveFocus());
  });

  it('marks the owner listing as sold and returns from the live detail view', async () => {
    const user = userEvent.setup();
    render(
      <ListingManagementActions
        listingId="51000000-0000-4000-8000-000000000005"
        redirectAfterAction="/my-listings"
        showView={false}
        status="published"
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Mark as sold' }));
    const confirmation = screen.getByRole('button', { name: 'Mark as sold' });
    await waitFor(() => expect(confirmation).toHaveFocus());
    await user.click(confirmation);

    await waitFor(() =>
      expect(mocks.markOwnListingSoldAction).toHaveBeenCalledWith(
        '51000000-0000-4000-8000-000000000005',
      ),
    );
    expect(mocks.push).toHaveBeenCalledWith('/my-listings');
  });
});
