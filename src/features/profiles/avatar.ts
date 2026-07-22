import { z } from 'zod';

export const PROFILE_AVATAR_BUCKET = 'profile-images';
export const PROFILE_AVATAR_MAX_BYTES = 3 * 1_024 * 1_024;
export const PROFILE_AVATAR_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;

const avatarPathSchema = z
  .string()
  .min(42)
  .max(220)
  .regex(
    /^[0-9a-f-]{36}\/[0-9a-f-]{36}\.(?:jpg|jpeg|png|webp)$/,
    'That profile photo path is invalid.',
  );

export const profileAvatarInputSchema = z.discriminatedUnion('mode', [
  z.object({ avatarPath: avatarPathSchema, mode: z.literal('photo') }),
  z.object({ mode: z.literal('initials') }),
]);

export function validateProfileAvatarFile(file: File): string | null {
  if (
    !PROFILE_AVATAR_MIME_TYPES.includes(file.type as (typeof PROFILE_AVATAR_MIME_TYPES)[number])
  ) {
    return 'Choose a JPEG, PNG, or WebP image.';
  }
  if (file.size < 1 || file.size > PROFILE_AVATAR_MAX_BYTES) {
    return 'Choose an image smaller than 3 MB.';
  }
  return null;
}

export function buildProfileAvatarPath(userId: string, mimeType: string) {
  const extension = mimeType === 'image/jpeg' ? 'jpg' : mimeType === 'image/png' ? 'png' : 'webp';
  return `${userId}/${crypto.randomUUID()}.${extension}`;
}

export type ProfileAvatarInput = z.infer<typeof profileAvatarInputSchema>;
