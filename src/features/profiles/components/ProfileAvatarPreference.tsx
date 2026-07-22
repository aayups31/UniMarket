'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ImagePlus, LoaderCircle, RotateCcw } from 'lucide-react';

import { createClient } from '@/lib/supabase/client';

import { updateProfileAvatarAction } from '../actions';
import {
  buildProfileAvatarPath,
  PROFILE_AVATAR_BUCKET,
  validateProfileAvatarFile,
} from '../avatar';

type ProfileAvatarPreferenceProps = {
  hasAvatar: boolean;
  userId: string;
};

export function ProfileAvatarPreference({ hasAvatar, userId }: ProfileAvatarPreferenceProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [notice, setNotice] = useState<{ kind: 'error' | 'success'; message: string } | null>(null);

  async function choosePhoto(file: File | undefined) {
    if (!file || isPending) return;

    const validationMessage = validateProfileAvatarFile(file);
    if (validationMessage) {
      setNotice({ kind: 'error', message: validationMessage });
      return;
    }

    setIsPending(true);
    setNotice(null);
    const path = buildProfileAvatarPath(userId, file.type);
    const supabase = createClient();
    const { error: uploadError } = await supabase.storage
      .from(PROFILE_AVATAR_BUCKET)
      .upload(path, file, { cacheControl: '3600', contentType: file.type, upsert: false });

    if (uploadError) {
      setNotice({ kind: 'error', message: 'That photo could not be uploaded. Try another image.' });
      setIsPending(false);
      return;
    }

    try {
      const result = await updateProfileAvatarAction({ avatarPath: path, mode: 'photo' });
      if (!result.ok) {
        await supabase.storage.from(PROFILE_AVATAR_BUCKET).remove([path]);
        setNotice({ kind: 'error', message: result.message });
        return;
      }

      setNotice({ kind: 'success', message: result.message });
      router.refresh();
    } catch {
      await supabase.storage.from(PROFILE_AVATAR_BUCKET).remove([path]);
      setNotice({ kind: 'error', message: 'That photo could not be saved. Please try again.' });
    } finally {
      setIsPending(false);
    }
  }

  async function restoreInitials() {
    if (isPending) return;
    setIsPending(true);
    setNotice(null);

    try {
      const result = await updateProfileAvatarAction({ mode: 'initials' });
      setNotice({ kind: result.ok ? 'success' : 'error', message: result.message });
      if (result.ok) router.refresh();
    } catch {
      setNotice({ kind: 'error', message: 'Initials could not be restored. Please try again.' });
    } finally {
      setIsPending(false);
    }
  }

  return (
    <details className="group relative mt-3 w-[6.75rem] text-center">
      <summary className="cursor-pointer list-none text-[0.68rem] font-semibold text-white/46 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-um-gold-300 [&::-webkit-details-marker]:hidden">
        {hasAvatar ? 'Change photo' : 'Add photo'}
      </summary>

      <div className="absolute left-0 top-7 z-20 w-[min(18rem,calc(100vw-2rem))] rounded-2xl border border-white/[0.1] bg-[#111722] p-3 text-left shadow-[0_24px_64px_rgba(0,0,0,0.5)]">
        <p className="text-[0.68rem] font-bold uppercase tracking-[0.12em] text-white/48">
          Profile image
        </p>
        <p className="mt-1 text-[0.7rem] leading-5 text-white/34">JPEG, PNG or WebP · 3 MB max</p>

        <input
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          disabled={isPending}
          onChange={(event) => {
            void choosePhoto(event.target.files?.[0]);
            event.target.value = '';
          }}
          ref={inputRef}
          type="file"
        />

        {notice ? (
          <p
            aria-live="polite"
            className={
              notice.kind === 'error'
                ? 'mt-2 text-[0.7rem] text-red-300'
                : 'mt-2 text-[0.7rem] text-emerald-300'
            }
          >
            {notice.message}
          </p>
        ) : null}

        <div className="mt-3 flex items-center gap-2">
          <button
            className="inline-flex min-h-9 flex-1 items-center justify-center gap-1.5 rounded-full bg-um-gold-300 px-3 text-xs font-bold text-um-ink-950 transition-colors hover:bg-um-gold-200 disabled:cursor-wait disabled:opacity-55"
            disabled={isPending}
            onClick={() => inputRef.current?.click()}
            type="button"
          >
            {isPending ? (
              <LoaderCircle aria-hidden="true" className="size-3.5 animate-spin" />
            ) : (
              <ImagePlus aria-hidden="true" className="size-3.5" />
            )}
            Choose photo
          </button>
          <button
            className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-full border border-white/[0.12] px-3 text-xs font-bold text-white/66 transition-colors hover:bg-white/[0.06] hover:text-white disabled:cursor-wait disabled:opacity-55"
            disabled={isPending || !hasAvatar}
            onClick={() => void restoreInitials()}
            type="button"
          >
            <RotateCcw aria-hidden="true" className="size-3.5" />
            Initials
          </button>
        </div>
      </div>
    </details>
  );
}
