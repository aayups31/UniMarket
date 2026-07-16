import 'server-only';

import { cache } from 'react';
import { redirect } from 'next/navigation';

import { createClient } from '@/lib/supabase/server';
import type { Profile } from '@/lib/supabase/database.types';

import { normalizeEmail } from './email';
import { getSafeNextPath } from './navigation';

export type AuthIdentity = {
  id: string;
  email: string;
};

export type Viewer = AuthIdentity & {
  profile: Profile;
};

export const getCurrentIdentity = cache(async (): Promise<AuthIdentity | null> => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  const claims = data?.claims;

  if (error || !claims) return null;

  const id = typeof claims.sub === 'string' ? claims.sub : null;
  const email = typeof claims.email === 'string' ? claims.email : null;

  if (!id || !email) return null;

  return { email: normalizeEmail(email), id };
});

export const getViewer = cache(async (): Promise<Viewer | null> => {
  const identity = await getCurrentIdentity();
  if (!identity) return null;

  const supabase = await createClient();
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', identity.id)
    .maybeSingle();

  if (error) {
    throw new Error('Unable to load the signed-in profile.', { cause: error });
  }

  if (!profile) return null;

  return { ...identity, profile };
});

export async function requireIdentity(nextPath?: string) {
  const identity = await getCurrentIdentity();

  if (!identity) {
    const next = getSafeNextPath(nextPath);
    redirect(`/login?next=${encodeURIComponent(next)}`);
  }

  return identity;
}

export async function requireMarketplaceViewer(nextPath?: string) {
  const identity = await getCurrentIdentity();

  if (!identity) {
    const next = getSafeNextPath(nextPath);
    redirect(`/login?next=${encodeURIComponent(next)}`);
  }

  const viewer = await getViewer();

  if (!viewer) {
    redirect(`/onboarding?next=${encodeURIComponent(getSafeNextPath(nextPath))}`);
  }

  if (viewer.profile.role === 'student' && !viewer.profile.onboarding_completed_at) {
    redirect(`/onboarding?next=${encodeURIComponent(getSafeNextPath(nextPath))}`);
  }

  return viewer;
}

export async function requireStudentSeller(nextPath?: string) {
  const viewer = await requireMarketplaceViewer(nextPath);

  if (viewer.profile.role !== 'student') {
    redirect('/marketplace?notice=selling-restricted');
  }

  return viewer;
}

export async function requireModerator(nextPath?: string) {
  const viewer = await requireMarketplaceViewer(nextPath);

  if (viewer.profile.role !== 'moderator') {
    redirect('/marketplace?notice=moderator-restricted');
  }

  return viewer;
}
