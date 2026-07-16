import { ProductShell } from '@/components/ui/ProductShell';
import { requireMarketplaceViewer } from '@/lib/auth/session';

export default async function MarketplaceLayout({ children }: { children: React.ReactNode }) {
  const viewer = await requireMarketplaceViewer('/marketplace');
  const canSell = viewer.profile.role === 'student';

  return (
    <ProductShell canSell={canSell} fullName={viewer.profile.full_name} role={viewer.profile.role}>
      {children}
    </ProductShell>
  );
}
