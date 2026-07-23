import { ProductShell } from '@/components/ui/ProductShell';
import { WebSessionGuard } from '@/features/auth/components/web-session-guard';
import { MessagesDock } from '@/features/messages/components/MessagesDock';
import { getSignedProfileAvatarUrl } from '@/features/profiles/queries';
import { requireMarketplaceViewer } from '@/lib/auth/session';

export default async function MarketplaceLayout({ children }: { children: React.ReactNode }) {
  const viewer = await requireMarketplaceViewer('/marketplace');
  const canSell = viewer.profile.role === 'student';
  const avatarUrl = await getSignedProfileAvatarUrl(viewer.profile.avatar_path);

  return (
    <ProductShell
      avatarUrl={avatarUrl}
      canSell={canSell}
      fullName={viewer.profile.full_name}
      role={viewer.profile.role}
    >
      <WebSessionGuard />
      {children}
      {viewer.profile.role === 'student' ? <MessagesDock viewerId={viewer.id} /> : null}
    </ProductShell>
  );
}
