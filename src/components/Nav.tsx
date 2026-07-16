import Link from 'next/link';

import { BrandMark } from '@/components/BrandMark';

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-um-canvas-soft">
      <nav
        aria-label="Public navigation"
        className="mx-auto flex h-[4.5rem] max-w-um-content items-center gap-5 px-4 sm:px-6"
      >
        <BrandMark className="shrink-0" />

        <div className="ml-auto hidden items-center gap-7 text-sm font-semibold text-um-text md:flex">
          <Link
            className="inline-flex min-h-11 items-center rounded-sm px-1 transition-colors hover:text-um-text-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-um-gold-600"
            href="#why-waterloo"
          >
            Why Waterloo
          </Link>
          <Link
            className="inline-flex min-h-11 items-center rounded-sm px-1 transition-colors hover:text-um-text-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-um-gold-600"
            href="#how-it-works"
          >
            How it works
          </Link>
          <Link
            className="inline-flex min-h-11 items-center rounded-sm px-1 transition-colors hover:text-um-text-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-um-gold-600"
            href="#categories"
          >
            Categories
          </Link>
        </div>

        <div className="ml-auto flex items-center gap-2 md:ml-5">
          <Link
            className="hidden min-h-11 items-center px-3 text-sm font-bold text-um-text transition-colors hover:text-um-text-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-um-gold-600 sm:inline-flex"
            href="/login"
          >
            Sign in
          </Link>
          <Link
            className="inline-flex min-h-11 items-center justify-center rounded-um-sm bg-um-ink-950 px-4 text-sm font-bold text-um-text-inverse transition-colors hover:bg-um-ink-850 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-um-gold-600 focus-visible:ring-offset-2"
            href="/signup"
          >
            Join Waterloo
          </Link>
        </div>
      </nav>
    </header>
  );
}
