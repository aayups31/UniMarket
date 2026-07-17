import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

import { BrandMark } from '@/components/BrandMark';

export function Nav() {
  return (
    <header className="sticky top-0 z-50 -mb-20 h-20 border-b border-white/[0.09] bg-um-ink-950/72 text-um-text-inverse shadow-[0_10px_35px_rgba(5,7,11,0.12)] backdrop-blur-xl">
      <nav
        aria-label="Public navigation"
        className="mx-auto flex h-20 max-w-um-content items-center gap-5 px-4 sm:px-6"
      >
        <BrandMark className="shrink-0" tone="light" />

        <div className="hidden items-center gap-4 lg:flex">
          <span aria-hidden="true" className="h-5 w-px bg-white/12" />
          <div>
            <p className="font-condensed text-[0.6rem] font-bold uppercase tracking-[0.17em] text-um-gold-300">
              Waterloo, Ontario
            </p>
            <p className="mt-0.5 font-mono text-[0.5rem] uppercase tracking-[0.14em] text-white/38">
              Independent student marketplace
            </p>
          </div>
        </div>

        <div className="ml-auto hidden items-center gap-7 text-sm font-semibold text-white/64 md:flex">
          <Link
            className="inline-flex min-h-11 items-center rounded-sm px-1 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-um-gold-300"
            href="#why-waterloo"
          >
            Why Waterloo
          </Link>
          <Link
            className="inline-flex min-h-11 items-center rounded-sm px-1 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-um-gold-300"
            href="#how-it-works"
          >
            How it works
          </Link>
          <Link
            className="inline-flex min-h-11 items-center rounded-sm px-1 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-um-gold-300"
            href="#categories"
          >
            Categories
          </Link>
        </div>

        <div className="ml-auto flex items-center gap-2 md:ml-5">
          <Link
            className="hidden min-h-11 items-center px-3 text-sm font-bold text-white/72 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-um-gold-300 sm:inline-flex"
            href="/login"
          >
            Sign in
          </Link>
          <Link
            className="group inline-flex min-h-11 items-center justify-center gap-2 rounded-sm bg-um-gold-400 px-4 text-sm font-black text-um-ink-950 transition-colors hover:bg-um-gold-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-um-ink-950"
            href="/signup"
          >
            <span className="sm:hidden">Join</span>
            <span className="hidden sm:inline">Join with Waterloo</span>
            <ArrowRight
              aria-hidden="true"
              className="size-3.5 transition-transform duration-220 ease-um-out group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </nav>
    </header>
  );
}
