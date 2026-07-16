export default function ListingLoading() {
  return (
    <div
      className="min-h-screen bg-um-canvas px-4 py-8 sm:px-6 lg:px-8 lg:py-12"
      aria-label="Loading listing"
      aria-busy="true"
    >
      <div className="mx-auto max-w-um-content">
        <div className="h-5 w-36 animate-pulse rounded bg-black/5" />
        <div className="mt-7 grid gap-8 lg:grid-cols-[minmax(0,1.38fr)_minmax(21rem,0.62fr)] lg:gap-12">
          <div>
            <div className="aspect-[4/3] animate-pulse rounded-um-xl bg-black/[0.06]" />
            <div className="mt-10 h-7 w-36 animate-pulse rounded-lg bg-black/10" />
            <div className="mt-4 h-28 animate-pulse rounded-2xl bg-black/5" />
          </div>
          <div className="h-[34rem] animate-pulse rounded-um-xl border border-black/5 bg-white shadow-um-xs" />
        </div>
      </div>
      <span className="sr-only">Loading listing…</span>
    </div>
  );
}
