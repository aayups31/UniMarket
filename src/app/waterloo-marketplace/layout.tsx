import type { ReactNode } from 'react';

import { PublicMarketplaceFooter } from '@/features/seo/components/PublicMarketplaceFooter';
import { PublicMarketplaceHeader } from '@/features/seo/components/PublicMarketplaceHeader';

export default function WaterlooMarketplaceLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#080a0e] text-white">
      <PublicMarketplaceHeader />
      <main>{children}</main>
      <PublicMarketplaceFooter />
    </div>
  );
}
