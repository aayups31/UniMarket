'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Plus, Search, ShieldCheck, Store } from 'lucide-react';

import { cn } from '@/lib/utils';

type ProductNavigationProps = {
  canSell: boolean;
  isModerator: boolean;
};

type NavigationItem = {
  href: string;
  label: string;
  icon: typeof Search;
  current: (pathname: string) => boolean;
};

const browseItem: NavigationItem = {
  href: '/marketplace',
  label: 'Browse',
  icon: Search,
  current: (pathname) =>
    pathname === '/marketplace' ||
    (/^\/listings\/[^/]+$/.test(pathname) && pathname !== '/listings/new'),
};

const sellerItems: NavigationItem[] = [
  {
    href: '/my-listings',
    label: 'My listings',
    icon: Store,
    current: (pathname) =>
      pathname === '/my-listings' || /^\/listings\/[^/]+\/edit$/.test(pathname),
  },
];

const createItem: NavigationItem = {
  href: '/listings/new',
  label: 'Sell',
  icon: Plus,
  current: (pathname) => pathname === '/listings/new',
};

const moderatorItem: NavigationItem = {
  href: '/moderation',
  label: 'Moderation',
  icon: ShieldCheck,
  current: (pathname) => pathname === '/moderation' || pathname.startsWith('/moderation/'),
};

export function ProductNavigation({ canSell, isModerator }: ProductNavigationProps) {
  const pathname = usePathname();
  const items = canSell
    ? [browseItem, ...sellerItems]
    : isModerator
      ? [browseItem, moderatorItem]
      : [browseItem];

  return (
    <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
      {items.map((item) => {
        const Icon = item.icon;
        const isCurrent = item.current(pathname);

        return (
          <Link
            aria-current={isCurrent ? 'page' : undefined}
            className={cn(
              'inline-flex min-h-11 items-center gap-2 rounded-um-sm px-3.5 text-sm font-semibold transition-colors duration-160 ease-um-out',
              isCurrent
                ? 'bg-um-surface-warm text-um-text-strong'
                : 'text-um-text-muted hover:bg-um-canvas-soft hover:text-um-text-strong',
            )}
            href={item.href}
            key={item.href}
          >
            <Icon aria-hidden="true" className="size-[1.05rem]" strokeWidth={1.9} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function CreateListingNavigationButton() {
  const pathname = usePathname();
  const isCurrent = createItem.current(pathname);

  return (
    <Link
      aria-current={isCurrent ? 'page' : undefined}
      className={cn(
        'hidden min-h-11 shrink-0 items-center justify-center gap-2 rounded-um-sm px-4 text-sm font-bold text-um-ink-950 shadow-um-xs transition duration-160 ease-um-out hover:-translate-y-0.5 lg:inline-flex',
        isCurrent ? 'bg-um-gold-300 ring-2 ring-um-ink-950' : 'bg-um-gold-500 hover:bg-um-gold-400',
      )}
      href={createItem.href}
    >
      <Plus aria-hidden="true" className="size-[1.05rem]" strokeWidth={2.1} />
      Create listing
    </Link>
  );
}

export function MobileTabBar({ canSell, isModerator }: ProductNavigationProps) {
  const pathname = usePathname();
  const items = canSell
    ? [browseItem, ...sellerItems, createItem]
    : isModerator
      ? [browseItem, moderatorItem]
      : [browseItem];

  return (
    <nav
      aria-label="Mobile primary"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-black/10 bg-white/95 px-3 pb-[max(0.45rem,env(safe-area-inset-bottom))] pt-1.5 shadow-[0_-10px_35px_rgba(8,11,18,0.08)] backdrop-blur-md lg:hidden"
    >
      <div
        className={cn(
          'mx-auto grid max-w-md gap-1',
          items.length === 1 ? 'grid-cols-1' : items.length === 2 ? 'grid-cols-2' : 'grid-cols-3',
        )}
      >
        {items.map((item) => {
          const Icon = item.icon;
          const isCurrent = item.current(pathname);
          const isCreate = item.href === createItem.href;

          return (
            <Link
              aria-current={isCurrent ? 'page' : undefined}
              className={cn(
                'relative flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-um-sm px-2 text-[0.69rem] font-semibold transition-colors duration-160 ease-um-out',
                isCurrent ? 'text-um-ink-950' : 'text-um-text-muted hover:text-um-text-strong',
                isCreate && 'text-um-ink-950',
              )}
              href={item.href}
              key={item.href}
            >
              {isCreate ? (
                <span
                  aria-hidden="true"
                  className={cn(
                    'absolute inset-x-2 inset-y-0.5 -z-10 rounded-um-sm bg-um-gold-500',
                    isCurrent && 'ring-2 ring-inset ring-um-ink-950',
                  )}
                />
              ) : isCurrent ? (
                <span
                  aria-hidden="true"
                  className="absolute top-0 h-0.5 w-8 rounded-full bg-um-gold-600"
                />
              ) : null}
              <Icon aria-hidden="true" className="size-5" strokeWidth={isCurrent ? 2.2 : 1.8} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
