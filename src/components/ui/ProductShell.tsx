import Link from 'next/link';

import { BrandMark } from '@/components/BrandMark';
import { SignOutButton } from '@/features/auth/components/sign-out-button';
import { ProfileAvatar } from '@/features/profiles/components/ProfileAvatar';
import { WaterlooVerificationBadge } from '@/features/profiles/components/WaterlooVerificationBadge';
import { getProfileInitials } from '@/features/profiles/format';

import {
  CreateListingNavigationButton,
  MessagesNavigationButton,
  MobileTabBar,
  ProductNavigation,
  SearchNavigationButton,
} from './ProductNavigation';

type ProductShellProps = {
  avatarUrl: string | null;
  canSell: boolean;
  children: React.ReactNode;
  fullName: string | null;
  role: 'student' | 'moderator';
};

export function ProductShell({ avatarUrl, canSell, children, fullName, role }: ProductShellProps) {
  const identityName =
    fullName?.trim() || (role === 'moderator' ? 'Moderator' : 'Waterloo student');
  const initials = getProfileInitials(identityName) || 'UM';

  return (
    <div className="um-product-dark min-h-screen bg-um-canvas text-um-text-strong">
      <a className="um-skip-link" href="#main-content">
        Skip to content
      </a>

      <header className="sticky top-0 z-40 border-b border-white/[0.075] bg-[#070a0f]/92 text-white shadow-[0_12px_36px_rgba(0,0,0,0.13)] backdrop-blur-xl">
        <div className="mx-auto flex h-[4.35rem] max-w-um-shell items-center gap-2 px-4 sm:gap-3 sm:px-6 lg:px-8">
          <BrandMark
            className="shrink-0"
            href="/marketplace"
            label="UniMarket marketplace"
            showCampusLabel={false}
            tone="light"
          />

          <span aria-hidden="true" className="mx-3 hidden h-5 w-px bg-white/[0.09] lg:block" />

          <ProductNavigation canSell={canSell} isModerator={role === 'moderator'} />

          <div className="ml-auto flex items-center gap-2">
            <SearchNavigationButton />
            {canSell ? <MessagesNavigationButton /> : null}
            {canSell ? <CreateListingNavigationButton /> : null}

            <Link
              aria-label={`Open profile for ${identityName}`}
              className="ml-1 hidden min-w-0 items-center gap-2.5 rounded-full border-l border-white/[0.09] py-1 pl-3 pr-2 transition-colors duration-200 hover:bg-white/[0.045] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-um-gold-300 lg:flex"
              href="/profile"
              title="Your profile"
            >
              <span className="relative shrink-0">
                <ProfileAvatar
                  avatarUrl={avatarUrl}
                  className="size-8 text-[0.66rem] shadow-none"
                  initials={initials}
                  name={identityName}
                />
                {role === 'student' ? (
                  <WaterlooVerificationBadge
                    className="absolute -bottom-1 -right-1 bg-[#090d14] ring-1 ring-[#090d14]"
                    iconOnly
                    size="xs"
                  />
                ) : null}
              </span>
              <span className="hidden min-w-0 xl:block">
                <span className="block max-w-36 truncate text-xs font-bold text-white/88">
                  {identityName}
                </span>
                <span className="mt-0.5 block text-[0.64rem] font-medium text-white/38">
                  {role === 'moderator' ? 'Moderator' : 'Student'}
                </span>
              </span>
            </Link>

            <SignOutButton
              className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-full px-3 text-xs font-semibold text-white/42 transition-colors duration-220 ease-um-out hover:bg-white/[0.055] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-um-gold-300 max-[420px]:px-2 max-[420px]:text-[0px] max-[420px]:[&_svg]:size-[1.05rem]"
              label="Sign out"
            />
          </div>
        </div>
      </header>

      <main className="pb-20 lg:pb-0" id="main-content" tabIndex={-1}>
        {children}
      </main>

      <MobileTabBar canSell={canSell} isModerator={role === 'moderator'} />
    </div>
  );
}
