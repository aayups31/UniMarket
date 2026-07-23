import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

import { BrandMark } from '@/components/BrandMark';

export function Nav() {
  return (
    <header className="sticky top-0 z-50 -mb-20 h-20 border-b border-white/[0.08] bg-[#06090e]/62 text-um-text-inverse shadow-[0_14px_45px_rgba(0,0,0,0.16)] backdrop-blur-2xl">
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
            className="hidden min-h-11 items-center rounded-full px-4 text-sm font-bold text-white/72 transition-colors hover:bg-white/[0.055] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-um-gold-300 sm:inline-flex"
            href="/marketplace"
            prefetch={false}
          >
            Sign in
          </Link>
          <Link
            className="group inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-um-gold-300 px-5 text-sm font-black text-um-ink-950 shadow-[0_10px_30px_rgba(201,152,18,0.16)] transition-[background-color,transform,box-shadow] duration-300 ease-um-out hover:-translate-y-0.5 hover:bg-um-gold-200 hover:shadow-[0_14px_38px_rgba(201,152,18,0.22)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-um-ink-950"
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
