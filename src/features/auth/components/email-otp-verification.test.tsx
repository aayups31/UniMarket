import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  resendSignupAction: vi.fn(),
  verifySignupOtpAction: vi.fn(),
}));

vi.mock('../actions', () => ({
  resendSignupAction: mocks.resendSignupAction,
  verifySignupOtpAction: mocks.verifySignupOtpAction,
}));

import { EmailOtpVerification } from './email-otp-verification';

describe('EmailOtpVerification', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('accepts only six digits and submits the normalized verification request', async () => {
    mocks.verifySignupOtpAction.mockResolvedValue({ ok: true, message: 'Verified.' });
    const user = userEvent.setup();

    render(<EmailOtpVerification email="student@uwaterloo.ca" nextPath="/listings/new" />);

    const input = screen.getByLabelText('Verification code');
    await user.type(input, '12a34567');

    expect(input).toHaveValue('123456');
    expect(input).toHaveAttribute('autocomplete', 'one-time-code');

    await user.click(screen.getByRole('button', { name: 'Verify email' }));

    expect(mocks.verifySignupOtpAction).toHaveBeenCalledWith({
      email: 'student@uwaterloo.ca',
      next: '/listings/new',
      token: '123456',
    });
  });

  it('shows a useful error without sending an incomplete code', async () => {
    const user = userEvent.setup();

    render(<EmailOtpVerification email="student@uwaterloo.ca" nextPath="/marketplace" />);
    await user.type(screen.getByLabelText('Verification code'), '123');
    await user.click(screen.getByRole('button', { name: 'Verify email' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Enter the six-digit code from your email.',
    );
    expect(mocks.verifySignupOtpAction).not.toHaveBeenCalled();
  });

  it('starts with a resend cooldown and keeps the change-email destination', () => {
    render(<EmailOtpVerification email="student@uwaterloo.ca" nextPath="/listings/new" />);

    expect(screen.getByRole('button', { name: 'Resend in 60s' })).toBeDisabled();
    expect(screen.getByRole('link', { name: 'Change email' })).toHaveAttribute(
      'href',
      '/signup?next=%2Flistings%2Fnew',
    );
  });
});
