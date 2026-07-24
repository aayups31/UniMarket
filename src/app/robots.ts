import type { MetadataRoute } from 'next';

import { SITE_URL } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/waterloo-marketplace/'],
        disallow: [
          '/api/',
          '/auth/',
          '/login',
          '/signup',
          '/verify',
          '/forgot-password',
          '/update-password',
          '/onboarding',
          '/marketplace',
          '/listings/',
          '/messages',
          '/profile',
          '/my-listings',
          '/moderation',
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
