import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  archiveOwnListingAction: vi.fn(),
  deleteOwnListingAction: vi.fn(),
  refresh: vi.fn(),
}));

vi.mock('next/navigation', () => ({ useRouter: () => ({ refresh: mocks.refresh }) }));
vi.mock('../actions', () => ({
  archiveOwnListingAction: mocks.archiveOwnListingAction,
  deleteOwnListingAction: mocks.deleteOwnListingAction,
}));

import { ListingManagementActions } from './ListingManagementActions';

describe('ListingManagementActions', () => {
  beforeEach(() => vi.clearAllMocks());

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
});
