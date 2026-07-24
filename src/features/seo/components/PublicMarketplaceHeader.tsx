import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

import { BrandMark } from '@/components/BrandMark';

export function PublicMarketplaceHeader() {
  return (
    <header className="border-b border-white/[0.08] bg-[#070a0f]/92 backdrop-blur-xl">
      <nav
        aria-label="Marketplace guide navigation"
        className="mx-auto flex min-h-20 max-w-um-content items-center gap-4 px-4 sm:px-6 lg:px-8"
      >
        <BrandMark tone="light" />
        <Link
          className="ml-auto hidden min-h-11 items-center rounded-full px-4 text-sm font-semibold text-white/62 transition hover:bg-white/[0.06] hover:text-white focus-visible:ring-2 focus-visible:ring-um-gold-300 sm:inline-flex"
          href="/waterloo-marketplace"
        >
          Search guide
        </Link>
        <Link
          className="inline-flex min-h-11 items-center rounded-full px-4 text-sm font-semibold text-white/70 transition hover:bg-white/[0.06] hover:text-white focus-visible:ring-2 focus-visible:ring-um-gold-300"
          href="/login"
          prefetch={false}
        >
          Sign in
        </Link>
        <Link
          className="group inline-flex min-h-11 items-center gap-2 rounded-full bg-um-gold-300 px-5 text-sm font-black text-um-ink-950 transition hover:bg-um-gold-200 focus-visible:ring-2 focus-visible:ring-white"
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
