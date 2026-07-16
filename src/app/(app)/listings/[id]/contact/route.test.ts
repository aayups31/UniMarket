import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({ createClient: vi.fn() }));

vi.mock('@/lib/supabase/server', () => ({ createClient: mocks.createClient }));

import { GET } from './route';

function arrangeSupabase({
  email = 'seller@uwaterloo.ca',
  legacyEmail = null as string | null,
  rpcError = null as Error | null,
  viewerRole = 'student' as 'student' | 'moderator',
  title = 'Desk lamp',
} = {}) {
  const rpc = vi.fn().mockResolvedValue({ data: rpcError ? null : email, error: rpcError });
  const listingMaybeSingle = vi.fn().mockResolvedValue({
    data: title ? { title, seller_id: 'seller-123' } : null,
    error: null,
  });
  const legacyMaybeSingle = vi.fn().mockResolvedValue({
    data: legacyEmail ? { email: legacyEmail } : null,
    error: null,
  });
  const profileMaybeSingle = vi.fn().mockResolvedValue({
    data: {
      email: viewerRole === 'student' ? 'buyer@uwaterloo.ca' : 'moderator@example.com',
      email_verified: true,
      onboarding_completed_at: '2026-07-15T00:00:00.000Z',
      role: viewerRole,
    },
    error: null,
  });
  const listingBuilder = {
    eq: vi.fn(),
    maybeSingle: listingMaybeSingle,
  };
  listingBuilder.eq.mockReturnValue(listingBuilder);
  const legacyBuilder = {
    eq: vi.fn(),
    maybeSingle: legacyMaybeSingle,
  };
  const profileBuilder = {
    eq: vi.fn(),
    maybeSingle: profileMaybeSingle,
  };
  profileBuilder.eq.mockReturnValue(profileBuilder);
  legacyBuilder.eq.mockReturnValue(legacyBuilder);
  const listingSelect = vi.fn(() => listingBuilder);
  const legacySelect = vi.fn(() => legacyBuilder);
  const profileSelect = vi.fn(() => profileBuilder);
  const from = vi.fn((table: string) => ({
    select:
      table === 'listings' ? listingSelect : table === 'profiles' ? profileSelect : legacySelect,
  }));

  const getClaims = vi.fn().mockResolvedValue({
    data: { claims: { sub: 'viewer-123' } },
    error: null,
  });

  mocks.createClient.mockResolvedValue({ auth: { getClaims }, from, rpc });
  return { from, getClaims, legacyMaybeSingle, listingMaybeSingle, profileMaybeSingle, rpc };
}

describe('GET /listings/:id/contact', () => {
  beforeEach(() => vi.clearAllMocks());

  it('resolves one authenticated listing contact without putting the email in listing HTML', async () => {
    const context = arrangeSupabase();
    const id = '51000000-0000-4000-8000-000000000005';

    const response = await GET(new Request(`http://localhost:3000/listings/${id}/contact`), {
      params: Promise.resolve({ id }),
    });

    expect(response.status).toBe(302);
    expect(response.headers.get('location')).toContain('mailto:seller@uwaterloo.ca');
    expect(response.headers.get('location')).toContain('UniMarket%3A%20Desk%20lamp');
    expect(context.rpc).toHaveBeenCalledWith('get_listing_contact_email', {
      p_listing_id: id,
    });
  });

  it('returns safely to the listing when contact lookup fails', async () => {
    arrangeSupabase({ rpcError: new Error('not available') });
    const id = '51000000-0000-4000-8000-000000000005';

    const response = await GET(new Request(`http://localhost:3000/listings/${id}/contact`), {
      params: Promise.resolve({ id }),
    });

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe(
      `http://localhost:3000/listings/${id}?contact=unavailable`,
    );
  });

  it('preserves one-at-a-time contact while a linked project is awaiting the privacy migration', async () => {
    arrangeSupabase({
      legacyEmail: 'legacy.seller@uwaterloo.ca',
      rpcError: new Error('function is not available yet'),
    });
    const id = '51000000-0000-4000-8000-000000000005';

    const response = await GET(new Request(`http://localhost:3000/listings/${id}/contact`), {
      params: Promise.resolve({ id }),
    });

    expect(response.status).toBe(302);
    expect(response.headers.get('location')).toContain('mailto:legacy.seller@uwaterloo.ca');
  });

  it('does not use the compatibility lookup for a non-student account', async () => {
    const context = arrangeSupabase({
      legacyEmail: 'legacy.seller@uwaterloo.ca',
      rpcError: new Error('function is not available yet'),
      viewerRole: 'moderator',
    });
    const id = '51000000-0000-4000-8000-000000000005';

    const response = await GET(new Request(`http://localhost:3000/listings/${id}/contact`), {
      params: Promise.resolve({ id }),
    });

    expect(response.status).toBe(307);
    expect(context.legacyMaybeSingle).not.toHaveBeenCalled();
  });

  it('does not query Supabase for an invalid listing identifier', async () => {
    const response = await GET(
      new Request('http://localhost:3000/listings/not-a-listing/contact'),
      { params: Promise.resolve({ id: 'not-a-listing' }) },
    );

    expect(response.status).toBe(307);
    expect(mocks.createClient).not.toHaveBeenCalled();
  });
});
