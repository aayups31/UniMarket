import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

import { getMarketplaceCategoryPresentation } from '../category-presentation';
import type { MarketplaceCategory } from '../types';
import { marketplaceCategoryHref, marketplaceHref } from '../url';

type CategoryFiltersProps = {
  categories: MarketplaceCategory[];
  activeCategory: string | null;
  query: string;
};

export function CategoryFilters({ categories, activeCategory, query }: CategoryFiltersProps) {
  return (
    <nav
      aria-label="Listing categories"
      className="mx-auto max-w-um-content px-4 pt-8 sm:px-6 sm:pt-10 lg:px-8"
    >
      <div className="mb-4 flex items-end justify-between gap-4 sm:mb-5">
        <div>
          <p className="text-[0.64rem] font-bold uppercase tracking-[0.2em] text-um-gold-300/80">
            Marketplace index
          </p>
          <h2 className="mt-1.5 text-xl font-bold tracking-[-0.035em] text-white sm:text-2xl">
            Browse Waterloo
          </h2>
        </div>
        <Link
          aria-current={!activeCategory ? 'page' : undefined}
          className="group/all inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-xs font-semibold text-white/56 transition duration-160 hover:bg-white/[0.06] hover:text-white focus-visible:ring-2 focus-visible:ring-um-gold-300 sm:text-sm"
          href={marketplaceHref({ query })}
        >
          All listings
          <ArrowRight
            aria-hidden="true"
            className="size-3.5 transition-transform duration-160 group-hover/all:translate-x-0.5"
          />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-[1.15rem] border border-white/[0.1] bg-white/[0.08] shadow-[0_24px_70px_rgba(0,0,0,0.18)] sm:grid-cols-4">
        {categories.map((category, index) => (
          <CategoryLink
            active={activeCategory === category.slug}
            href={marketplaceCategoryHref(category.slug, { query })}
            index={index}
            key={category.id}
            label={category.label}
            slug={category.slug}
          />
        ))}
      </div>
    </nav>
  );
}

type CategoryLinkProps = {
  href: string;
  active: boolean;
  index: number;
  label: string;
  slug: string;
};

function CategoryLink({ href, active, index, label, slug }: CategoryLinkProps) {
  const presentation = getMarketplaceCategoryPresentation(slug);

  return (
    <Link
      aria-current={active ? 'page' : undefined}
      aria-label={label}
      className={`group/category relative isolate min-h-[9.5rem] overflow-hidden bg-[#090d13] transition duration-300 ease-um-out focus-visible:z-20 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-um-gold-300 sm:min-h-[12rem] lg:min-h-[13rem] ${
        active ? 'ring-1 ring-inset ring-um-gold-300/60' : ''
      }`}
      href={href}
    >
      <Image
        alt=""
        className={`object-cover opacity-50 saturate-[0.72] transition duration-700 ease-um-out group-hover/category:scale-[1.035] group-hover/category:opacity-72 group-focus-visible/category:scale-[1.035] group-focus-visible/category:opacity-72 ${presentation.imagePosition}`}
        fill
        quality={92}
        sizes="(min-width: 640px) 25vw, 50vw"
        src={presentation.image}
      />
      <span
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,6,10,0.05)_0%,rgba(4,6,10,0.16)_38%,rgba(4,6,10,0.92)_100%)]"
      />
      <span
        aria-hidden="true"
        className={`absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t ${presentation.accent} via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover/category:opacity-100 group-focus-visible/category:opacity-100`}
      />

      <span className="absolute inset-x-0 top-0 z-10 flex items-center justify-between p-3.5 sm:p-4">
        <span className="font-mono text-[0.6rem] font-semibold tabular-nums tracking-[0.16em] text-white/44">
          {String(index + 1).padStart(2, '0')}
        </span>
        <span className="grid size-8 place-items-center rounded-full border border-white/[0.12] bg-black/20 text-white/50 backdrop-blur-md transition duration-300 group-hover/category:border-um-gold-300/45 group-hover/category:bg-um-gold-300 group-hover/category:text-um-ink-950 group-focus-visible/category:border-um-gold-300/45 group-focus-visible/category:bg-um-gold-300 group-focus-visible/category:text-um-ink-950 sm:size-9">
          <ArrowUpRight aria-hidden="true" className="size-3.5" strokeWidth={1.8} />
        </span>
      </span>

      <span className="absolute inset-x-0 bottom-0 z-10 p-3.5 sm:p-4">
        <span className="block text-[1.05rem] font-bold leading-none tracking-[-0.035em] text-white sm:text-xl lg:text-[1.35rem]">
          {label}
        </span>
      </span>
    </Link>
  );
}
