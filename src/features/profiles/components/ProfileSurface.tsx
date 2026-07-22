import Link from 'next/link';
import { ArrowLeft, Mail, Plus, ShieldCheck, Store } from 'lucide-react';

import { ListingGrid } from '@/features/marketplace/components/ListingGrid';
import { cn } from '@/lib/utils';

import { formatProfileJoinedDate, getProfileInitials, getProfileStudyLine } from '../format';
import type { StudentProfileSurface } from '../types';
import { ProfileAvatar } from './ProfileAvatar';
import { ProfileAvatarPreference } from './ProfileAvatarPreference';
import { WaterlooVerificationBadge } from './WaterlooVerificationBadge';

type ProfileSurfaceProps = {
  profile: StudentProfileSurface;
  variant: 'public' | 'self';
};

export function ProfileSurface({ profile, variant }: ProfileSurfaceProps) {
  const isSelf = variant === 'self';
  const canSell = profile.role === 'student';
  const listingCount = profile.listings.length;
  const initials = getProfileInitials(profile.name) || 'UM';

  return (
    <div className="min-h-[calc(100vh-4.35rem)] bg-[#080c13] pb-24 text-um-text-strong lg:pb-28">
      <section className="relative isolate overflow-hidden border-b border-white/[0.075] bg-[#070a0f]">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_17%_-20%,rgba(242,205,82,0.13),transparent_30rem),radial-gradient(circle_at_84%_120%,rgba(88,111,151,0.11),transparent_34rem)]"
        />
        <div
          aria-hidden="true"
          className="absolute -right-24 top-1/2 -z-10 size-[25rem] -translate-y-1/2 rounded-full border border-um-gold-300/[0.055] opacity-80 sm:-right-12 sm:size-[32rem]"
        />

        <div className="mx-auto max-w-um-content px-4 pb-10 pt-6 sm:px-6 sm:pb-12 sm:pt-8 lg:px-8 lg:pb-14">
          <Link
            className="inline-flex min-h-10 items-center gap-2 rounded-full px-2 text-xs font-semibold text-white/46 transition-colors duration-200 hover:bg-white/[0.045] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-um-gold-300"
            href="/marketplace"
          >
            <ArrowLeft aria-hidden="true" className="size-4" strokeWidth={1.8} />
            Marketplace
          </Link>

          <div className="mt-7 grid items-end gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-12">
            <div className="flex min-w-0 flex-col gap-5 sm:flex-row sm:items-center sm:gap-7">
              <div className="w-fit shrink-0">
                <div className="relative w-fit">
                  <ProfileAvatar
                    avatarUrl={profile.avatarUrl}
                    className="size-[5.75rem] text-2xl sm:size-[6.75rem] sm:text-[1.8rem]"
                    initials={initials}
                    name={profile.name}
                  />
                  {profile.verified ? (
                    <WaterlooVerificationBadge
                      className="absolute -bottom-1 -right-1 bg-[#090d14] p-1 ring-1 ring-white/[0.1]"
                      iconOnly
                      size="md"
                    />
                  ) : null}
                </div>
                {isSelf && profile.role === 'student' ? (
                  <ProfileAvatarPreference hasAvatar={profile.hasAvatar} userId={profile.id} />
                ) : null}
              </div>

              <div className="min-w-0">
                <div className="flex min-w-0 flex-wrap items-center gap-2.5">
                  <h1 className="max-w-full break-words pb-[0.08em] text-[clamp(2.15rem,4.5vw,4rem)] font-bold leading-[1.03] tracking-[-0.048em] text-[#f3efe7] [overflow-wrap:anywhere]">
                    {profile.name}
                  </h1>
                  {profile.role === 'moderator' ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.1] bg-white/[0.045] px-3 py-1.5 text-[0.68rem] font-bold text-white/68">
                      <ShieldCheck aria-hidden="true" className="size-3.5" strokeWidth={1.9} />
                      Moderator
                    </span>
                  ) : null}
                </div>

                <p className="mt-3 text-sm font-medium text-white/48 sm:text-base">
                  {getProfileStudyLine(profile.program, profile.academicYear)}
                </p>
                {isSelf && profile.email ? (
                  <p className="mt-2 flex min-w-0 items-center gap-2 text-xs text-white/34 sm:text-sm">
                    <Mail aria-hidden="true" className="size-3.5 shrink-0" strokeWidth={1.7} />
                    <span className="truncate">{profile.email}</span>
                  </p>
                ) : null}
              </div>
            </div>

            {isSelf && canSell ? (
              <Link
                className="inline-flex min-h-11 w-fit shrink-0 items-center justify-center gap-2 rounded-full bg-um-gold-300 px-5 text-sm font-bold text-um-ink-950 shadow-[0_12px_32px_rgba(201,152,18,0.14)] transition-[background-color,box-shadow,transform] duration-220 ease-um-out hover:-translate-y-px hover:bg-um-gold-200 hover:shadow-[0_15px_38px_rgba(201,152,18,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                href="/listings/new"
              >
                <Plus aria-hidden="true" className="size-4" strokeWidth={2.1} />
                New listing
              </Link>
            ) : null}
          </div>

          <dl className="mt-9 grid max-w-3xl grid-cols-3 divide-x divide-white/[0.08] border-y border-white/[0.08] sm:mt-11">
            <ProfileStat label="Joined" value={formatProfileJoinedDate(profile.joinedAt)} />
            <ProfileStat label="Active" value={String(listingCount)} />
            <ProfileStat label="Rating" value="No ratings yet" />
          </dl>
        </div>
      </section>

      <section
        aria-labelledby="profile-listings-heading"
        className="mx-auto max-w-um-content px-4 pt-10 sm:px-6 sm:pt-12 lg:px-8 lg:pt-14"
      >
        <div className="mb-7 flex items-end justify-between gap-4 border-b border-white/[0.075] pb-5 sm:mb-8">
          <div>
            <p className="font-condensed text-[0.62rem] font-bold uppercase tracking-[0.18em] text-um-gold-300/70">
              On UniMarket
            </p>
            <h2
              className="mt-1.5 text-[1.8rem] font-bold tracking-[-0.042em] text-[#f0ece4] sm:text-[2.2rem]"
              id="profile-listings-heading"
            >
              Active listings
            </h2>
          </div>
          {listingCount > 0 ? (
            <span className="font-mono text-[0.64rem] font-semibold tracking-[0.13em] text-white/32">
              {String(listingCount).padStart(2, '0')}
            </span>
          ) : null}
        </div>

        {listingCount > 0 ? (
          <ListingGrid listings={profile.listings} prioritizeFirst />
        ) : (
          <EmptyProfileListings canSell={canSell && isSelf} />
        )}
      </section>
    </div>
  );
}

function ProfileStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 px-3 py-4 first:pl-0 sm:px-6 sm:py-5 sm:first:pl-0">
      <dt className="font-condensed text-[0.58rem] font-bold uppercase tracking-[0.15em] text-white/30 sm:text-[0.62rem]">
        {label}
      </dt>
      <dd
        className={cn(
          'mt-1 truncate text-sm font-bold tracking-[-0.02em] text-[#f0ece4] sm:text-base',
          value === 'No ratings yet' && 'font-medium text-white/46',
        )}
      >
        {value}
      </dd>
    </div>
  );
}

function EmptyProfileListings({ canSell }: { canSell: boolean }) {
  return (
    <div className="grid min-h-[20rem] place-items-center rounded-[1.2rem] border border-white/[0.075] bg-[#0d131d] px-6 py-12 text-center">
      <div>
        <span className="mx-auto grid size-11 place-items-center rounded-full bg-white/[0.045] text-um-gold-300 ring-1 ring-inset ring-white/[0.08]">
          <Store aria-hidden="true" className="size-5" strokeWidth={1.7} />
        </span>
        <h3 className="mt-4 text-xl font-bold tracking-[-0.035em] text-[#f0ece4]">
          Nothing live right now.
        </h3>
        {canSell ? (
          <Link
            className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.04] px-4 text-sm font-bold text-white/72 transition-[background-color,color,transform] duration-220 ease-um-out hover:-translate-y-px hover:bg-white/[0.08] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-um-gold-300"
            href="/listings/new"
          >
            <Plus aria-hidden="true" className="size-4" />
            List something
          </Link>
        ) : null}
      </div>
    </div>
  );
}
