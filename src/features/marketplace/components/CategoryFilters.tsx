import Link from 'next/link';
import {
  Armchair,
  ArrowUpRight,
  BookOpenText,
  LayoutGrid,
  MonitorSmartphone,
  Shapes,
  Shirt,
  type LucideIcon,
} from 'lucide-react';

import { CATEGORY_PRESENTATION } from '../constants';
import type { MarketplaceCategory } from '../types';
import { marketplaceHref } from '../url';

type CategoryFiltersProps = {
  categories: MarketplaceCategory[];
  activeCategory: string | null;
  query: string;
};

export function CategoryFilters({ categories, activeCategory, query }: CategoryFiltersProps) {
  return (
    <nav aria-label="Listing categories" className="mt-9 sm:mt-11">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <p className="font-condensed text-xs font-bold uppercase tracking-[0.17em] text-um-text-muted">
            Browse the marketplace
          </p>
          <h2 className="mt-1 text-xl font-bold tracking-[-0.03em] text-um-text-strong sm:text-2xl">
            Shop by category
          </h2>
        </div>
        <p className="hidden text-sm text-um-text-muted md:block">Made for everyday campus life</p>
      </div>

      <div className="flex snap-x gap-3 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:grid sm:grid-cols-5 sm:overflow-visible sm:pb-0">
        <CategoryLink
          href={marketplaceHref({ query })}
          active={!activeCategory}
          icon={LayoutGrid}
          label="All listings"
          description="See everything for sale"
        />

        {categories.map((category) => {
          const presentation = CATEGORY_PRESENTATION[category.slug];
          const Icon = CATEGORY_ICONS[category.slug] ?? Shapes;

          return (
            <CategoryLink
              key={category.id}
              href={marketplaceHref({ query, category: category.slug })}
              active={activeCategory === category.slug}
              icon={Icon}
              label={category.label}
              description={presentation?.description ?? `Browse ${category.label.toLowerCase()}`}
            />
          );
        })}
      </div>
    </nav>
  );
}

type CategoryLinkProps = {
  href: string;
  active: boolean;
  icon: LucideIcon;
  label: string;
  description: string;
};

function CategoryLink({ href, active, icon: Icon, label, description }: CategoryLinkProps) {
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      title={description}
      className={`group/category relative flex min-h-[7.5rem] min-w-[10.5rem] snap-start flex-col justify-between overflow-hidden rounded-um-lg border p-4 text-left transition duration-160 ease-um-out focus-visible:ring-2 focus-visible:ring-um-ink-950 focus-visible:ring-offset-2 sm:min-w-0 ${
        active
          ? 'border-um-ink-950 bg-um-ink-950 text-um-text-inverse shadow-um-sm'
          : 'border-black/10 bg-um-surface text-um-text-strong hover:-translate-y-0.5 hover:border-black/20 hover:shadow-um-sm'
      }`}
    >
      <span className="flex items-start justify-between gap-3">
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
            active ? 'bg-um-gold-500 text-um-ink-950' : 'bg-um-surface-warm text-um-text'
          }`}
        >
          <Icon className="h-[1.1rem] w-[1.1rem]" strokeWidth={1.8} aria-hidden="true" />
        </span>
        <ArrowUpRight
          className={`h-4 w-4 transition-transform duration-300 group-hover/category:translate-x-0.5 group-hover/category:-translate-y-0.5 ${
            active ? 'text-white/55' : 'text-um-text-muted/60'
          }`}
          aria-hidden="true"
        />
      </span>
      <span className="mt-4 min-w-0">
        <span className="block text-sm font-semibold tracking-[-0.015em] sm:text-[0.95rem]">
          {label}
        </span>
        <span
          className={`mt-1 block text-[0.68rem] leading-[1.45] ${
            active ? 'text-white/55' : 'text-um-text-muted'
          }`}
        >
          {description}
        </span>
      </span>
    </Link>
  );
}

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  electronics: MonitorSmartphone,
  books: BookOpenText,
  household: Armchair,
  'household-items': Armchair,
  clothing: Shirt,
};
