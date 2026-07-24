import type { MetadataRoute } from 'next';

import {
  ITEM_SEARCH_TARGETS,
  SEARCH_CATEGORIES,
  categoryHref,
  itemHref,
} from '@/features/seo/search-targets';
import { absoluteUrl } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: absoluteUrl('/'),
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: absoluteUrl('/waterloo-marketplace'),
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...SEARCH_CATEGORIES.map((category) => ({
      url: absoluteUrl(categoryHref(category.slug)),
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    ...ITEM_SEARCH_TARGETS.map((item) => ({
      url: absoluteUrl(itemHref(item.slug)),
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
  ];
}
