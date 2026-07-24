import type { Metadata } from 'next';

import { App as MarketingPage } from '@/App';
import { JsonLd } from '@/features/seo/components/JsonLd';
import { absoluteUrl, SITE_DESCRIPTION, SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: {
    absolute: 'UniMarket Waterloo | University Marketplace for Students',
  },
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'UniMarket Waterloo | University Marketplace for Students',
    description: SITE_DESCRIPTION,
    url: '/',
  },
};

export default function HomePage() {
  return (
    <>
      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            '@id': `${SITE_URL}/#website`,
            url: SITE_URL,
            name: 'UniMarket',
            alternateName: ['UniMarket Waterloo', 'Waterloo student marketplace'],
            description: SITE_DESCRIPTION,
            inLanguage: 'en-CA',
            publisher: {
              '@id': `${SITE_URL}/#organization`,
            },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            '@id': `${SITE_URL}/#organization`,
            name: 'UniMarket',
            alternateName: 'UniMarket Waterloo',
            url: SITE_URL,
            logo: {
              '@type': 'ImageObject',
              url: absoluteUrl('/brand/unimarket-mark.png'),
              width: 1024,
              height: 1024,
            },
            description:
              'An independent student-built marketplace for the University of Waterloo community.',
          },
        ]}
      />
      <MarketingPage />
    </>
  );
}
