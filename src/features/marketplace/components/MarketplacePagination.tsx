import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';

import { marketplaceHref } from '../url';

type MarketplacePaginationProps = {
  page: number;
  totalPages: number;
  query: string;
  category: string | null;
};

export function MarketplacePagination({
  page,
  totalPages,
  query,
  category,
}: MarketplacePaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav
      className="mt-10 flex items-center justify-between border-t border-black/[0.08] pt-6"
      aria-label="Marketplace pages"
    >
      {page > 1 ? (
        <Link
          href={marketplaceHref({ query, category, page: page - 1 })}
          className="inline-flex min-h-11 items-center gap-2 rounded-um-sm border border-black/10 bg-um-surface px-3.5 py-2.5 text-sm font-bold text-um-text-strong shadow-um-xs transition duration-160 ease-um-out hover:border-black/25 focus-visible:ring-2 focus-visible:ring-um-ink-950 focus-visible:ring-offset-2"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Previous
        </Link>
      ) : (
        <span />
      )}

      <span className="text-xs font-medium tabular-nums text-um-text-muted">
        Page {page} of {totalPages}
      </span>

      {page < totalPages ? (
        <Link
          href={marketplaceHref({ query, category, page: page + 1 })}
          className="inline-flex min-h-11 items-center gap-2 rounded-um-sm border border-black/10 bg-um-surface px-3.5 py-2.5 text-sm font-bold text-um-text-strong shadow-um-xs transition duration-160 ease-um-out hover:border-black/25 focus-visible:ring-2 focus-visible:ring-um-ink-950 focus-visible:ring-offset-2"
        >
          Next
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
