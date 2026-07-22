import { describe, expect, it } from 'vitest';

import { GET } from './route';

describe('GET /listings/:id/contact', () => {
  it('moves legacy email contact into the private messaging experience', async () => {
    const id = '51000000-0000-4000-8000-000000000005';
    const response = await GET(new Request(`http://localhost:3000/listings/${id}/contact`), {
      params: Promise.resolve({ id }),
    });

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe(
      `http://localhost:3000/listings/${id}?contact=unavailable`,
    );
    expect(response.headers.get('location')).not.toContain('mailto:');
  });
});
