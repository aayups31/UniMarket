import { describe, expect, it, vi } from 'vitest';

import {
  buildProfileAvatarPath,
  PROFILE_AVATAR_MAX_BYTES,
  profileAvatarInputSchema,
  validateProfileAvatarFile,
} from './avatar';

const userId = '11111111-1111-4111-8111-111111111111';
const imageId = '22222222-2222-4222-8222-222222222222';

describe('profile avatar input', () => {
  it('accepts an owner-scoped private Storage path', () => {
    expect(
      profileAvatarInputSchema.safeParse({
        avatarPath: `${userId}/${imageId}.webp`,
        mode: 'photo',
      }).success,
    ).toBe(true);
  });

  it('rejects malformed and remote paths', () => {
    expect(
      profileAvatarInputSchema.safeParse({
        avatarPath: 'https://images.example.com/student.webp',
        mode: 'photo',
      }).success,
    ).toBe(false);
    expect(
      profileAvatarInputSchema.safeParse({ avatarPath: '../student.webp', mode: 'photo' }).success,
    ).toBe(false);
  });

  it('allows a student to restore initials without a photo path', () => {
    expect(profileAvatarInputSchema.safeParse({ mode: 'initials' }).success).toBe(true);
  });
});

describe('profile photo files', () => {
  it('accepts supported images within the size limit', () => {
    const file = new File(['image'], 'student.webp', { type: 'image/webp' });
    expect(validateProfileAvatarFile(file)).toBeNull();
  });

  it('rejects unsupported or oversized files', () => {
    expect(
      validateProfileAvatarFile(new File(['image'], 'student.gif', { type: 'image/gif' })),
    ).toMatch(/JPEG, PNG, or WebP/);

    const largeFile = new File(['image'], 'student.webp', { type: 'image/webp' });
    Object.defineProperty(largeFile, 'size', { value: PROFILE_AVATAR_MAX_BYTES + 1 });
    expect(validateProfileAvatarFile(largeFile)).toMatch(/smaller than 3 MB/);
  });

  it('builds an immutable owner path with a MIME-matched extension', () => {
    vi.spyOn(crypto, 'randomUUID').mockReturnValue(imageId);
    expect(buildProfileAvatarPath(userId, 'image/jpeg')).toBe(`${userId}/${imageId}.jpg`);
    vi.restoreAllMocks();
  });
});
