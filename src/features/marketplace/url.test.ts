import { describe, expect, it } from 'vitest';

import { firstSearchParam, marketplaceHref } from './url';

describe('marketplaceHref', () => {
  it('preserves active filters and encodes the page', () => {
    expect(marketplaceHref({ query: 'desk chair', category: 'household-items', page: 3 })).toBe(
      '/marketplace?q=desk+chair&category=household-items&page=3',
    );
  });

  it('omits empty filters and the first page', () => {
    expect(marketplaceHref({ query: ' ', category: null, page: 1 })).toBe('/marketplace');
  });
});

describe('firstSearchParam', () => {
  it('uses the first value when a query parameter is repeated', () => {
    expect(firstSearchParam(['books', 'electronics'])).toBe('books');
  });
});
