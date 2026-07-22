import { describe, expect, it } from 'vitest';

import {
  firstSearchParam,
  marketplaceCategoryHref,
  marketplaceHref,
  marketplaceScopedHref,
  marketplaceSearchTerms,
  normalizeMarketplaceQuery,
} from './url';

describe('marketplaceHref', () => {
  it('preserves active filters and encodes the page', () => {
    expect(marketplaceHref({ query: 'desk chair', category: 'household-items', page: 3 })).toBe(
      '/marketplace?q=desk+chair&category=household-items&page=3',
    );
  });

  it('omits empty filters and the first page', () => {
    expect(marketplaceHref({ query: ' ', category: null, page: 1 })).toBe('/marketplace');
  });

  it('normalizes unsafe search punctuation before building filter links', () => {
    expect(marketplaceHref({ query: '  desk,(chair)%  ', category: 'household-items' })).toBe(
      '/marketplace?q=desk+chair&category=household-items',
    );
  });
});

describe('scoped marketplace links', () => {
  it('builds an independent category route while preserving search and pagination', () => {
    expect(marketplaceCategoryHref('household-items', { query: 'desk lamp', page: 2 })).toBe(
      '/marketplace/categories/household-items?q=desk+lamp&page=2',
    );
  });

  it('builds links for an existing marketplace scope', () => {
    expect(
      marketplaceScopedHref('/marketplace/categories/books', { query: 'calculus', page: 1 }),
    ).toBe('/marketplace/categories/books?q=calculus');
  });
});

describe('firstSearchParam', () => {
  it('uses the first value when a query parameter is repeated', () => {
    expect(firstSearchParam(['books', 'electronics'])).toBe('books');
  });
});

describe('marketplace search normalization', () => {
  it('normalizes unicode, punctuation, and repeated whitespace', () => {
    expect(normalizeMarketplaceQuery('  ＭacBook,   charger! ')).toBe('MacBook charger');
  });

  it('caps the query at the input contract length', () => {
    expect(normalizeMarketplaceQuery('a'.repeat(100))).toHaveLength(80);
  });

  it('builds unique terms so multi-word searches can match across listing fields', () => {
    expect(marketplaceSearchTerms('Desk desk lamp for room')).toEqual(['Desk', 'lamp', 'room']);
  });

  it('keeps a stop word when it is the whole search', () => {
    expect(marketplaceSearchTerms('for')).toEqual(['for']);
  });

  it('limits the number of database filter groups', () => {
    expect(marketplaceSearchTerms('one two three four five six seven eight')).toHaveLength(6);
  });
});
