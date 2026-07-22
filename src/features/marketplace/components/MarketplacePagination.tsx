import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';

import { marketplaceHref, marketplaceScopedHref } from '../url';

type MarketplacePaginationProps = {
  page: number;
  totalPages: number;
  query: string;
  category: string | null;
  scopePath?: string;
};

export function MarketplacePagination({
  page,
  totalPages,
  query,
  category,
  scopePath,
}: MarketplacePaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav
      aria-label="Marketplace pages"
      className="mt-12 flex items-center justify-between border-t border-white/[0.08] pt-6"
    >
      {page > 1 ? (
        <Link
          aria-label="Previous marketplace page"
          className="grid size-11 place-items-center rounded-[0.65rem] border border-white/[0.1] text-white/68 transition duration-160 hover:border-white/25 hover:bg-white/[0.06] hover:text-white focus-visible:ring-2 focus-visible:ring-um-gold-300"
          href={
            scopePath
              ? marketplaceScopedHref(scopePath, { query, page: page - 1 })
              : marketplaceHref({ query, category, page: page - 1 })
          }
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
        </Link>
      ) : (
        <span aria-hidden="true" className="size-11" />
      )}

      <span className="text-xs font-semibold tabular-nums tracking-[0.06em] text-white/48">
        {page} / {totalPages}
      </span>

      {page < totalPages ? (
        <Link
          aria-label="Next marketplace page"
          className="grid size-11 place-items-center rounded-[0.65rem] border border-white/[0.1] text-white/68 transition duration-160 hover:border-white/25 hover:bg-white/[0.06] hover:text-white focus-visible:ring-2 focus-visible:ring-um-gold-300"
          href={
            scopePath
              ? marketplaceScopedHref(scopePath, { query, page: page + 1 })
              : marketplaceHref({ query, category, page: page + 1 })
          }
        >
          <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
      ) : (
        <span aria-hidden="true" className="size-11" />
      )}
    </nav>
  );
}
