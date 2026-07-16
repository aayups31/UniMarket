import { MapPin, ShieldCheck } from 'lucide-react';

import { BrandMark } from '@/components/BrandMark';
import { SignOutButton } from '@/features/auth/components/sign-out-button';
import { waterlooTheme } from '@/lib/university-theme';

import {
  CreateListingNavigationButton,
  MobileTabBar,
  ProductNavigation,
} from './ProductNavigation';

type ProductShellProps = {
  canSell: boolean;
  children: React.ReactNode;
  fullName: string | null;
  role: 'student' | 'moderator';
};

export function ProductShell({ canSell, children, fullName, role }: ProductShellProps) {
  const identityName =
    fullName?.trim() || (role === 'moderator' ? 'Moderator' : 'Waterloo student');
  const initial = identityName.charAt(0).toLocaleUpperCase();

  return (
    <div className="min-h-screen bg-um-canvas text-um-text-strong">
      <a className="um-skip-link" href="#main-content">
        Skip to content
      </a>

      <header className="sticky top-0 z-40">
        <CampusStrip />

        <div className="border-b border-black/10 bg-white/[0.97] shadow-[0_1px_0_rgba(255,255,255,0.72)] backdrop-blur-md">
          <div className="mx-auto flex h-[4.25rem] max-w-um-shell items-center gap-4 px-4 sm:px-6 lg:px-8">
            <BrandMark className="shrink-0" href="/marketplace" label="UniMarket marketplace" />

            <div className="ml-auto hidden lg:block">
              <ProductNavigation canSell={canSell} isModerator={role === 'moderator'} />
            </div>

            {canSell ? <CreateListingNavigationButton /> : null}

            <div className="hidden min-w-0 items-center gap-2.5 border-l border-black/10 pl-4 sm:flex">
              <span
                aria-hidden="true"
                className="grid size-9 shrink-0 place-items-center rounded-full bg-um-ink-950 text-xs font-bold text-um-gold-400"
              >
                {initial}
              </span>
              <span className="hidden min-w-0 xl:block">
                <span className="block max-w-40 truncate text-xs font-bold text-um-text-strong">
                  {identityName}
                </span>
                <span className="mt-0.5 flex items-center gap-1 text-[0.67rem] font-medium text-um-text-muted">
                  <ShieldCheck
                    aria-hidden="true"
                    className="size-3 text-um-gold-700"
                    strokeWidth={2}
                  />
                  {role === 'moderator' ? 'Moderator' : 'Verified student'}
                </span>
              </span>
            </div>

            <SignOutButton
              className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-um-sm px-3 text-sm font-semibold text-um-text-muted transition-colors duration-160 ease-um-out hover:bg-um-surface-warm hover:text-um-text-strong"
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

function CampusStrip() {
  return (
    <div className="h-7 border-b border-white/10 bg-um-ink-950 text-um-text-inverse">
      <div className="mx-auto flex h-full max-w-um-shell items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <p className="font-condensed flex min-w-0 items-center gap-1.5 truncate text-[0.66rem] font-semibold uppercase tracking-[0.13em] text-white/[0.72]">
          <MapPin aria-hidden="true" className="size-3 shrink-0 text-um-gold-400" strokeWidth={2} />
          <span>{waterlooTheme.shortName} campus</span>
          <span aria-hidden="true" className="text-um-gold-500">
            /
          </span>
          <span className="truncate">Independent student-built marketplace</span>
        </p>

        <p className="font-condensed hidden shrink-0 items-center gap-1.5 text-[0.66rem] font-semibold uppercase tracking-[0.13em] text-white/[0.72] sm:flex">
          <ShieldCheck aria-hidden="true" className="size-3 text-um-gold-400" strokeWidth={2} />
          {waterlooTheme.copy.verification}
        </p>
      </div>
    </div>
  );
}
