'use server';

import { revalidatePath } from 'next/cache';

import { getCurrentIdentity } from '@/lib/auth/session';
import { createClient } from '@/lib/supabase/server';

import { PROFILE_AVATAR_BUCKET, profileAvatarInputSchema } from './avatar';

export type ProfileAvatarActionResult =
  { ok: true; message: string } | { ok: false; message: string };

export async function updateProfileAvatarAction(
  input: unknown,
): Promise<ProfileAvatarActionResult> {
  const parsed = profileAvatarInputSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? 'Choose a valid profile photo.',
    };
  }

  const identity = await getCurrentIdentity();
  if (!identity) return { ok: false, message: 'Sign in again to update your profile.' };

  const avatarPath = parsed.data.mode === 'photo' ? parsed.data.avatarPath : null;
  if (avatarPath && !avatarPath.startsWith(`${identity.id}/`)) {
    return { ok: false, message: 'That profile photo does not belong to your account.' };
  }

  const supabase = await createClient();
  if (avatarPath) {
    const [folder, fileName] = avatarPath.split('/');
    const { data: objects, error: objectError } = await supabase.storage
      .from(PROFILE_AVATAR_BUCKET)
      .list(folder, { limit: 2, search: fileName });

    if (objectError || !objects.some((object) => object.name === fileName)) {
      return { ok: false, message: 'Upload the profile photo before selecting it.' };
    }
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('avatar_path,role')
    .eq('id', identity.id)
    .maybeSingle();

  if (profileError || !profile || profile.role !== 'student') {
    return { ok: false, message: "We couldn't update your profile image." };
  }

  const previousPath = profile.avatar_path;
  const { error } = await supabase
    .from('profiles')
    .update({ avatar_path: avatarPath })
    .eq('id', identity.id);

  if (error) return { ok: false, message: "We couldn't update your profile image." };

  if (previousPath && previousPath !== avatarPath) {
    await supabase.storage.from(PROFILE_AVATAR_BUCKET).remove([previousPath]);
  }

  revalidatePath('/profile');
  revalidatePath(`/profile/${identity.id}`);

  return {
    ok: true,
    message: avatarPath ? 'Profile photo updated.' : 'Initials restored.',
  };
}
