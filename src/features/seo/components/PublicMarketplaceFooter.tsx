import Link from 'next/link';

import { BrandMark } from '@/components/BrandMark';
import { SEARCH_CATEGORIES, categoryHref } from '@/features/seo/search-targets';

export function PublicMarketplaceFooter() {
  return (
    <footer className="border-t border-white/[0.08] bg-[#06080c] text-white">
      <div className="mx-auto grid max-w-um-content gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1fr_auto] lg:px-8">
        <div>
          <BrandMark tone="light" />
          <p className="mt-5 max-w-lg text-sm leading-6 text-white/48">
            An independent student-built marketplace. UniMarket is not affiliated with or endorsed
            by the University of Waterloo.
          </p>
        </div>
        <nav aria-label="Search categories">
          <p className="font-condensed text-[0.65rem] font-bold uppercase tracking-[0.17em] text-um-gold-300">
            Browse by category
          </p>
          <ul className="mt-4 grid grid-cols-2 gap-x-8 gap-y-1 text-sm text-white/58">
            {SEARCH_CATEGORIES.map((category) => (
              <li key={category.slug}>
                <Link
                  className="inline-flex min-h-10 items-center transition hover:text-white"
                  href={categoryHref(category.slug)}
                >
                  {category.shortName}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
