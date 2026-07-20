import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({ signupAction: vi.fn() }));

vi.mock('../actions', () => ({ signupAction: mocks.signupAction }));

import { SignupForm } from './signup-form';

describe('SignupForm', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('shows a sign-in prompt instead of verification for an existing account', async () => {
    mocks.signupAction.mockResolvedValue({
      ok: false,
      message: 'This Waterloo email is already registered.',
      reason: 'account-exists',
    });
    const user = userEvent.setup();

    render(<SignupForm nextPath="/marketplace" />);
    await user.type(screen.getByLabelText('Waterloo email'), 'student@uwaterloo.ca');
    await user.type(screen.getByLabelText('Password'), 'Waterloo8');
    await user.type(screen.getByLabelText('Confirm password'), 'Waterloo8');
    await user.click(screen.getByRole('button', { name: 'Join UniMarket' }));

    const accountNotice = await screen.findByRole('status');
    expect(within(accountNotice).getByText('Email already registered.')).toBeVisible();
    expect(
      within(accountNotice).queryByText(/This Waterloo email already has an account/i),
    ).not.toBeInTheDocument();
    expect(within(accountNotice).getByRole('link', { name: 'Sign in' })).toHaveAttribute(
      'href',
      '/login',
    );
    expect(within(accountNotice).getByRole('link', { name: 'Forgot password?' })).toHaveAttribute(
      'href',
      '/forgot-password',
    );
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
