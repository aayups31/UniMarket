import type { Metadata } from 'next';

import { ProfileSurface } from '@/features/profiles/components/ProfileSurface';
import { getOwnProfileSurface } from '@/features/profiles/queries';
import { requireMarketplaceViewer } from '@/lib/auth/session';

export const metadata: Metadata = {
  title: 'Your profile | UniMarket',
  description: 'Your UniMarket identity and active listings.',
  robots: { follow: false, index: false },
};

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const viewer = await requireMarketplaceViewer('/profile');
  const profile = await getOwnProfileSurface(viewer);

  return <ProfileSurface profile={profile} variant="self" />;
}
