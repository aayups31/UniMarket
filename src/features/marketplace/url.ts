type MarketplaceHrefOptions = {
  query?: string;
  category?: string | null;
  page?: number;
};

export function marketplaceHref({ query, category, page }: MarketplaceHrefOptions) {
  const params = new URLSearchParams();

  if (query?.trim()) params.set('q', query.trim());
  if (category) params.set('category', category);
  if (page && page > 1) params.set('page', String(page));

  const search = params.toString();
  return search ? `/marketplace?${search}` : '/marketplace';
}

export function firstSearchParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
