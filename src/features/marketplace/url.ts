type MarketplaceHrefOptions = {
  query?: string;
  category?: string | null;
  page?: number;
};

type MarketplaceScopedHrefOptions = Omit<MarketplaceHrefOptions, 'category'>;

export function marketplaceHref({ query, category, page }: MarketplaceHrefOptions) {
  const params = new URLSearchParams();
  const normalizedQuery = normalizeMarketplaceQuery(query);

  if (normalizedQuery) params.set('q', normalizedQuery);
  if (category) params.set('category', category);
  if (page && page > 1) params.set('page', String(page));

  const search = params.toString();
  return search ? `/marketplace?${search}` : '/marketplace';
}

export function marketplaceCategoryHref(
  category: string,
  { query, page }: MarketplaceScopedHrefOptions = {},
) {
  return marketplaceScopedHref(`/marketplace/categories/${encodeURIComponent(category)}`, {
    query,
    page,
  });
}

export function marketplaceScopedHref(
  pathname: string,
  { query, page }: MarketplaceScopedHrefOptions = {},
) {
  const params = new URLSearchParams();
  const normalizedQuery = normalizeMarketplaceQuery(query);

  if (normalizedQuery) params.set('q', normalizedQuery);
  if (page && page > 1) params.set('page', String(page));

  const search = params.toString();
  return search ? `${pathname}?${search}` : pathname;
}

export function firstSearchParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export function normalizeMarketplaceQuery(value: string | undefined) {
  return (value ?? '')
    .normalize('NFKC')
    .replace(/[^\p{L}\p{N}\s-]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 80);
}

export function marketplaceSearchTerms(value: string | undefined) {
  const seen = new Set<string>();
  const terms = normalizeMarketplaceQuery(value)
    .split(' ')
    .filter((term) => {
      if (!term) return false;
      const normalizedTerm = term.toLocaleLowerCase('en-CA');
      if (seen.has(normalizedTerm)) return false;
      seen.add(normalizedTerm);
      return true;
    });
  const meaningfulTerms = terms.filter(
    (term) => !MARKETPLACE_SEARCH_STOP_WORDS.has(term.toLocaleLowerCase('en-CA')),
  );

  return (meaningfulTerms.length > 0 ? meaningfulTerms : terms).slice(0, 6);
}

const MARKETPLACE_SEARCH_STOP_WORDS = new Set([
  'a',
  'an',
  'and',
  'for',
  'in',
  'of',
  'on',
  'or',
  'the',
  'to',
  'with',
]);
