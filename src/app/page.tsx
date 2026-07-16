import type { Metadata } from 'next';

import { App as MarketingPage } from '@/App';

export const metadata: Metadata = {
  title: 'UniMarket — Waterloo buys from Waterloo',
  description:
    'An independent student-built marketplace for verified University of Waterloo students.',
};

export default function HomePage() {
  return <MarketingPage />;
}
