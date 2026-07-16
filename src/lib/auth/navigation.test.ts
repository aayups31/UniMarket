import { describe, expect, it } from 'vitest';

import { getSafeNextPath } from './navigation';

describe('safe post-auth navigation', () => {
  it.each([
    ['/marketplace', '/marketplace'],
    ['/listings/abc?from=search', '/listings/abc?from=search'],
    ['/my-listings?page=2', '/my-listings?page=2'],
    ['/moderation?page=2', '/moderation?page=2'],
  ])('allows authenticated app paths', (value, expected) => {
    expect(getSafeNextPath(value)).toBe(expected);
  });

  it.each([
    'https://example.com',
    '//example.com',
    '/\\example.com',
    '/login',
    '/onboarding',
    '/unrelated',
    null,
  ])('falls back for an unsafe destination: %s', (value) => {
    expect(getSafeNextPath(value)).toBe('/marketplace');
  });
});
