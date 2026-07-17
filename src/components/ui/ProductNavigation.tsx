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
    <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
      {items.map((item) => {
        const Icon = item.icon;
        const isCurrent = item.current(pathname);

        return (
          <Link
            aria-current={isCurrent ? 'page' : undefined}
            className={cn(
              'relative inline-flex min-h-11 items-center gap-2 px-0.5 text-sm font-semibold transition-colors duration-160 ease-um-out after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:bg-um-gold-400 after:transition-transform after:duration-220 after:ease-um-out',
              isCurrent
                ? 'text-white after:scale-x-100'
                : 'text-white/55 after:scale-x-0 hover:text-white after:hover:scale-x-100',
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
        'hidden min-h-11 shrink-0 items-center justify-center gap-2 rounded-um-sm border px-4 text-sm font-bold transition duration-160 ease-um-out hover:-translate-y-0.5 lg:inline-flex',
        isCurrent
          ? 'border-um-gold-300 bg-um-gold-300 text-um-ink-950'
          : 'border-um-gold-500/80 bg-um-gold-500 text-um-ink-950 shadow-[0_8px_28px_rgba(201,152,18,0.14)] hover:bg-um-gold-400',
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
      className="fixed inset-x-0 bottom-0 z-50 border-t border-white/[0.08] bg-um-ink-950/95 px-3 pb-[max(0.45rem,env(safe-area-inset-bottom))] pt-1.5 shadow-[0_-14px_40px_rgba(5,7,11,0.24)] backdrop-blur-md lg:hidden"
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
                isCurrent ? 'text-white' : 'text-white/48 hover:text-white',
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
                    isCurrent && 'bg-um-gold-300 ring-1 ring-inset ring-white/35',
                  )}
                />
              ) : isCurrent ? (
                <span
                  aria-hidden="true"
                  className="absolute top-0 h-0.5 w-8 rounded-full bg-um-gold-400"
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
