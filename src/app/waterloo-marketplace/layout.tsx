import type { ReactNode } from 'react';

import { PublicMarketplaceFooter } from '@/features/seo/components/PublicMarketplaceFooter';
import { PublicMarketplaceHeader } from '@/features/seo/components/PublicMarketplaceHeader';

export default function WaterlooMarketplaceLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#080a0e] text-white">
      <div aria-hidden="true" className="um-public-atmosphere" />
      <PublicMarketplaceHeader />
      <main className="relative z-10">{children}</main>
      <div className="relative z-10">
        <PublicMarketplaceFooter />
      </div>
    </div>
  );
}
