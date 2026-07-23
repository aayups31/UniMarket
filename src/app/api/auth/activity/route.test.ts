import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  getCurrentIdentity: vi.fn(),
  markWebSessionActivity: vi.fn(),
}));

vi.mock('@/lib/auth/session', () => ({ getCurrentIdentity: mocks.getCurrentIdentity }));
vi.mock('@/lib/auth/web-session-cookies', () => ({
  markWebSessionActivity: mocks.markWebSessionActivity,
}));

import { POST } from './route';

describe('web session activity endpoint', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('refreshes the inactivity marker for an authenticated browser', async () => {
    mocks.getCurrentIdentity.mockResolvedValue({
      email: 'student@uwaterloo.ca',
      id: 'user-123',
    });

    const response = await POST();

    expect(response.status).toBe(204);
    expect(response.headers.get('cache-control')).toBe('private, no-store');
    expect(mocks.markWebSessionActivity).toHaveBeenCalledOnce();
  });

  it('does not refresh activity without a verified session', async () => {
    mocks.getCurrentIdentity.mockResolvedValue(null);

    const response = await POST();

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({ error: 'Your web session has expired.' });
    expect(mocks.markWebSessionActivity).not.toHaveBeenCalled();
  });
});
