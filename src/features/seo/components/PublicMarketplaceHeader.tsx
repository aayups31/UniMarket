import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

import { BrandMark } from '@/components/BrandMark';
import { SEARCH_CATEGORIES, categoryHref } from '@/features/seo/search-targets';

export function PublicMarketplaceHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#080a0e]/88 backdrop-blur-2xl">
      <nav
        aria-label="Marketplace guide navigation"
        className="mx-auto flex min-h-[4.5rem] max-w-um-content items-center gap-2 px-4 sm:px-6 lg:px-8"
      >
        <BrandMark
          className="[&>span:last-child>span:first-child]:text-base"
          href="/waterloo-marketplace"
          tone="light"
        />

        <div className="ml-auto hidden items-center gap-0.5 lg:flex">
          {SEARCH_CATEGORIES.map((category) => (
            <Link
              className="inline-flex min-h-10 items-center rounded-full px-3.5 text-[0.82rem] font-medium text-white/52 transition hover:bg-white/[0.055] hover:text-white"
              href={categoryHref(category.slug)}
              key={category.slug}
            >
              {category.shortName}
            </Link>
          ))}
        </div>

        <span aria-hidden="true" className="mx-2 hidden h-4 w-px bg-white/10 lg:block" />

        <Link
          className="ml-auto inline-flex min-h-10 items-center rounded-full px-3.5 text-[0.82rem] font-semibold text-white/68 transition hover:bg-white/[0.055] hover:text-white focus-visible:ring-2 focus-visible:ring-um-gold-300 lg:ml-0"
          href="/login"
          prefetch={false}
        >
          Sign in
        </Link>
        <Link
          className="group inline-flex min-h-10 items-center gap-2 rounded-full bg-um-gold-300 px-4 text-[0.82rem] font-bold text-um-ink-950 transition hover:bg-[#ffe48d] focus-visible:ring-2 focus-visible:ring-white sm:px-5"
          href="/signup"
        >
          Join
          <ArrowRight
            aria-hidden="true"
            className="size-3.5 transition-transform group-hover:translate-x-0.5"
          />
        </Link>
      </nav>
    </header>
  );
}
