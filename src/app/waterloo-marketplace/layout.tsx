import type { ReactNode } from 'react';

import { PublicMarketplaceFooter } from '@/features/seo/components/PublicMarketplaceFooter';
import { PublicMarketplaceHeader } from '@/features/seo/components/PublicMarketplaceHeader';

export default function WaterlooMarketplaceLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#070a0f] text-white">
      <PublicMarketplaceHeader />
      <main>{children}</main>
      <PublicMarketplaceFooter />
    </div>
  );
}
