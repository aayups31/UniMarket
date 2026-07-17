import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

import { CATEGORY_PRESENTATION } from '../constants';
import type { MarketplaceCategory } from '../types';
import { marketplaceHref } from '../url';

type CategoryFiltersProps = {
  categories: MarketplaceCategory[];
  activeCategory: string | null;
  query: string;
};

const MOSAIC_LAYOUTS = [
  'lg:col-span-4 lg:row-span-1',
  'lg:col-span-3 lg:row-span-1',
  'lg:col-span-3 lg:row-span-1',
  'lg:col-span-4 lg:row-span-1',
];

export function CategoryFilters({ categories, activeCategory, query }: CategoryFiltersProps) {
  return (
    <nav
      aria-label="Listing categories"
      className="mx-auto max-w-um-content px-4 pt-12 sm:px-6 sm:pt-16 lg:px-8 lg:pt-20"
    >
      <div className="mb-6 flex items-end justify-between gap-6 sm:mb-8">
        <div>
          <p className="font-condensed text-xs font-bold uppercase tracking-[0.18em] text-um-gold-700">
            Find your way in
          </p>
          <h2 className="mt-1.5 text-2xl font-bold tracking-[-0.045em] text-um-text-strong sm:text-[2rem]">
            Built around student life.
          </h2>
        </div>
        <p className="hidden max-w-xs text-right text-sm leading-6 text-um-text-muted md:block">
          From course notes to the chair that survives your next sublet.
        </p>
      </div>

      <div className="grid auto-rows-[8.75rem] grid-cols-2 gap-3 sm:auto-rows-[10rem] lg:grid-cols-12 lg:auto-rows-[9.5rem] lg:gap-4">
        <CategoryLink
          active={!activeCategory}
          description="Everything currently available around Waterloo"
          href={marketplaceHref({ query })}
          label="All listings"
          layout="col-span-2 row-span-2 lg:col-span-5 lg:row-span-2"
          slug="all"
        />

        {categories.map((category, index) => (
          <CategoryLink
            active={activeCategory === category.slug}
            description={
              CATEGORY_PRESENTATION[category.slug]?.description ??
              `Browse ${category.label.toLowerCase()}`
            }
            href={marketplaceHref({ query, category: category.slug })}
            key={category.id}
            label={category.label}
            layout={MOSAIC_LAYOUTS[index] ?? 'lg:col-span-3 lg:row-span-1'}
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
  label: string;
  description: string;
  layout: string;
  slug: string;
};

function CategoryLink({ href, active, label, description, layout, slug }: CategoryLinkProps) {
  const dark = slug === 'all' || slug === 'electronics' || slug === 'household';

  return (
    <Link
      aria-current={active ? 'page' : undefined}
      className={`group/category relative isolate min-w-0 overflow-hidden rounded-[1.15rem] p-4 shadow-[0_10px_30px_rgba(8,12,19,0.08)] transition duration-220 ease-um-out hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(8,12,19,0.13)] focus-visible:ring-2 focus-visible:ring-um-ink-950 focus-visible:ring-offset-2 sm:p-5 ${layout} ${categoryTone(slug)} ${
        active ? 'ring-2 ring-um-gold-500 ring-offset-2 ring-offset-um-canvas' : ''
      }`}
      href={href}
      title={description}
    >
      <CategoryArt slug={slug} />
      <span
        aria-hidden="true"
        className={`absolute inset-0 bg-gradient-to-r ${
          dark
            ? 'from-black/55 via-black/20 to-transparent'
            : 'from-white/50 via-white/10 to-transparent'
        }`}
      />

      <span className="relative z-10 flex h-full max-w-[72%] flex-col justify-between">
        <span
          className={`font-condensed text-[0.65rem] font-bold uppercase tracking-[0.17em] ${
            dark ? 'text-white/58' : 'text-um-ink-950/55'
          }`}
        >
          {slug === 'all' ? 'Waterloo marketplace' : 'Browse category'}
        </span>

        <span>
          <span className="flex items-end gap-2">
            <span className="block text-lg font-bold leading-tight tracking-[-0.035em] sm:text-xl">
              {label}
            </span>
            <ArrowUpRight
              aria-hidden="true"
              className="mb-0.5 size-4 shrink-0 opacity-[0.55] transition-transform duration-220 group-hover/category:-translate-y-0.5 group-hover/category:translate-x-0.5"
            />
          </span>
          <span
            className={`mt-1.5 hidden max-w-[18rem] text-xs leading-5 sm:block ${
              dark ? 'text-white/58' : 'text-um-ink-950/58'
            }`}
          >
            {description}
          </span>
        </span>
      </span>
    </Link>
  );
}

function categoryTone(slug: string) {
  switch (slug) {
    case 'all':
      return 'bg-[#101823] text-white';
    case 'electronics':
      return 'bg-[#263b48] text-white';
    case 'books':
      return 'bg-[#d3c6ad] text-um-ink-950';
    case 'household':
    case 'household-items':
      return 'bg-[#39463f] text-white';
    case 'clothing':
      return 'bg-[#b98255] text-um-ink-950';
    default:
      return 'bg-[#d7d0c3] text-um-ink-950';
  }
}

function CategoryArt({ slug }: { slug: string }) {
  if (slug === 'all') {
    return (
      <svg
        aria-hidden="true"
        className="absolute inset-y-0 right-0 h-full w-[74%] text-um-gold-400"
        fill="none"
        viewBox="0 0 520 320"
      >
        <path
          d="M-30 258C74 253 73 128 176 134s101 111 203 93 74-102 178-96"
          stroke="currentColor"
          strokeOpacity=".68"
          strokeWidth="3"
        />
        <path
          d="M-18 283C87 278 87 153 190 159s101 111 203 93 74-102 177-96"
          stroke="currentColor"
          strokeOpacity=".32"
          strokeWidth="1.5"
        />
        <path
          d="M152-12v344M259-12v344M366-12v344M473-12v344M-10 52h550M-10 132h550M-10 212h550"
          stroke="white"
          strokeOpacity=".055"
        />
        <circle cx="177" cy="134" r="7" fill="currentColor" />
        <circle cx="379" cy="227" r="5" fill="currentColor" />
        <path
          d="M401 72h84v50h-84zM287 25h60v76h-60zM209 211h73v48h-73z"
          fill="white"
          fillOpacity=".055"
          stroke="white"
          strokeOpacity=".14"
        />
        <text
          x="296"
          y="61"
          fill="white"
          fillOpacity=".38"
          fontFamily="Arial Narrow, sans-serif"
          fontSize="13"
          letterSpacing="2"
        >
          DC
        </text>
        <text
          x="426"
          y="103"
          fill="white"
          fillOpacity=".38"
          fontFamily="Arial Narrow, sans-serif"
          fontSize="13"
          letterSpacing="2"
        >
          SLC
        </text>
        <text
          x="231"
          y="242"
          fill="white"
          fillOpacity=".38"
          fontFamily="Arial Narrow, sans-serif"
          fontSize="13"
          letterSpacing="2"
        >
          E7
        </text>
      </svg>
    );
  }

  if (slug === 'electronics') {
    return (
      <svg
        aria-hidden="true"
        className="absolute -bottom-7 right-1 h-[125%] w-[58%] text-white"
        fill="none"
        viewBox="0 0 220 180"
      >
        <rect
          x="34"
          y="24"
          width="154"
          height="102"
          rx="7"
          fill="currentColor"
          fillOpacity=".1"
          stroke="currentColor"
          strokeOpacity=".38"
          strokeWidth="2"
        />
        <path d="M46 38h130v73H46z" fill="#0d131d" fillOpacity=".52" />
        <path
          d="M96 127v17m30-17v17m-48 1h66"
          stroke="currentColor"
          strokeOpacity=".44"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M60 57h54M60 69h77M60 81h41"
          stroke="#f2d56f"
          strokeOpacity=".76"
          strokeWidth="3"
        />
      </svg>
    );
  }

  if (slug === 'books') {
    return (
      <svg
        aria-hidden="true"
        className="absolute -bottom-4 right-0 h-[120%] w-[60%] text-um-ink-950"
        fill="none"
        viewBox="0 0 220 180"
      >
        <path
          d="M47 129h143v25H47z"
          fill="currentColor"
          fillOpacity=".12"
          stroke="currentColor"
          strokeOpacity=".35"
          strokeWidth="2"
        />
        <path
          d="M28 101h139v28H28z"
          fill="#f7f4ee"
          fillOpacity=".5"
          stroke="currentColor"
          strokeOpacity=".35"
          strokeWidth="2"
        />
        <path
          d="M58 70h138v31H58z"
          fill="currentColor"
          fillOpacity=".08"
          stroke="currentColor"
          strokeOpacity=".35"
          strokeWidth="2"
        />
        <path
          d="M73 82h67M42 112h78M64 140h88"
          stroke="currentColor"
          strokeOpacity=".42"
          strokeWidth="2"
        />
      </svg>
    );
  }

  if (slug === 'household' || slug === 'household-items') {
    return (
      <svg
        aria-hidden="true"
        className="absolute -bottom-4 right-0 h-[120%] w-[58%] text-white"
        fill="none"
        viewBox="0 0 220 180"
      >
        <path
          d="M66 73h93c11 0 20 9 20 20v48H48V91c0-10 8-18 18-18Z"
          fill="currentColor"
          fillOpacity=".12"
          stroke="currentColor"
          strokeOpacity=".38"
          strokeWidth="2"
        />
        <path
          d="M48 105h131M76 74v67m75-67v67M61 142v13m104-13v13"
          stroke="currentColor"
          strokeOpacity=".38"
          strokeWidth="2"
        />
        <path
          d="M178 33v72M153 34h50l-10 27h-30l-10-27Z"
          stroke="#f2d56f"
          strokeOpacity=".8"
          strokeWidth="2"
        />
      </svg>
    );
  }

  if (slug === 'clothing') {
    return (
      <svg
        aria-hidden="true"
        className="absolute -bottom-6 right-0 h-[130%] w-[60%] text-um-ink-950"
        fill="none"
        viewBox="0 0 220 180"
      >
        <path
          d="M92 39c4 10 30 10 35 0l43 25-19 35-18-10v65H85V89L67 99 48 64l44-25Z"
          fill="currentColor"
          fillOpacity=".08"
          stroke="currentColor"
          strokeOpacity=".4"
          strokeWidth="2"
        />
        <path
          d="M91 39c2 25 36 25 38 0M108 62v91"
          stroke="currentColor"
          strokeOpacity=".35"
          strokeWidth="2"
        />
        <path d="M96 78h24" stroke="#f7f4ee" strokeOpacity=".72" strokeWidth="3" />
      </svg>
    );
  }

  return (
    <svg
      aria-hidden="true"
      className="absolute inset-y-0 right-0 h-full w-[55%] text-um-ink-950"
      fill="none"
      viewBox="0 0 220 180"
    >
      <path
        d="M27 142 92 37l99 104M48 142l72-84 50 84"
        stroke="currentColor"
        strokeOpacity=".25"
        strokeWidth="2"
      />
    </svg>
  );
}
