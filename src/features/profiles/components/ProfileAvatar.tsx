'use client';

import { useState } from 'react';

import { cn } from '@/lib/utils';

type ProfileAvatarProps = {
  avatarUrl: string | null;
  className?: string;
  initials: string;
  name: string;
};

export function ProfileAvatar({ avatarUrl, className, initials, name }: ProfileAvatarProps) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null);

  return (
    <span
      className={cn(
        'relative grid shrink-0 place-items-center overflow-hidden rounded-full border border-white/[0.12] bg-[linear-gradient(145deg,#18202c,#0b1018)] font-bold tracking-[-0.06em] text-[#f3efe7] shadow-[0_24px_55px_rgba(0,0,0,0.3)]',
        className,
      )}
    >
      {avatarUrl && failedUrl !== avatarUrl ? (
        // Profile photos are private Supabase objects exposed through a
        // short-lived signed URL, so they bypass a fixed remote-host allowlist.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          alt={`${name}'s profile`}
          className="size-full object-cover"
          decoding="async"
          onError={() => setFailedUrl(avatarUrl)}
          referrerPolicy="no-referrer"
          src={avatarUrl}
        />
      ) : (
        <span aria-hidden="true">{initials}</span>
      )}
    </span>
  );
}
