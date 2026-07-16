import { Search } from 'lucide-react';

type MarketplaceSearchProps = {
  query: string;
  category: string | null;
};

export function MarketplaceSearch({ query, category }: MarketplaceSearchProps) {
  return (
    <div className="w-full">
      <form
        action="/marketplace"
        method="get"
        role="search"
        className="relative flex w-full items-center rounded-um-lg bg-um-surface p-1.5 shadow-um-sm ring-1 ring-black/10 transition duration-160 ease-um-out focus-within:ring-4 focus-within:ring-um-gold-500/20"
      >
        <Search
          className="pointer-events-none absolute left-5 top-1/2 size-5 -translate-y-1/2 text-um-text-muted sm:left-6 sm:size-[1.35rem]"
          strokeWidth={1.9}
          aria-hidden="true"
        />
        <label htmlFor="marketplace-search" className="sr-only">
          Search listings by title, description, or category
        </label>
        <input
          id="marketplace-search"
          name="q"
          type="search"
          defaultValue={query}
          autoComplete="off"
          maxLength={80}
          aria-describedby="marketplace-search-hint"
          placeholder="Search monitors, textbooks, chairs…"
          className="h-14 min-w-0 flex-1 rounded-um-md border-0 bg-transparent pl-12 pr-3 text-[0.95rem] font-medium text-um-text-strong outline-none placeholder:font-normal placeholder:text-um-text-muted sm:h-16 sm:pl-14 sm:text-[1.05rem]"
        />
        {category ? <input type="hidden" name="category" value={category} /> : null}
        <button
          type="submit"
          className="h-11 shrink-0 rounded-um-sm bg-um-gold-500 px-4 text-sm font-bold text-um-ink-950 shadow-um-xs transition duration-160 ease-um-out hover:bg-um-gold-400 focus-visible:ring-2 focus-visible:ring-um-ink-950 focus-visible:ring-offset-2 sm:h-[3.25rem] sm:px-6"
        >
          Search
        </button>
      </form>
      <p
        id="marketplace-search-hint"
        className="mt-2.5 text-xs text-um-text-muted sm:text-[0.8rem]"
      >
        Search listing titles, descriptions, and categories
      </p>
    </div>
  );
}
