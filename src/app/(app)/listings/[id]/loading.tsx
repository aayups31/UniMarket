export default function ListingLoading() {
  return (
    <div
      className="min-h-screen bg-um-canvas px-4 py-8 sm:px-6 lg:px-8 lg:py-10"
      aria-label="Loading listing"
      aria-busy="true"
    >
      <div className="mx-auto max-w-um-content">
        <div className="h-3 w-36 animate-pulse rounded bg-black/[0.07]" />
        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.42fr)_minmax(21rem,0.58fr)] lg:gap-14">
          <div>
            <div className="aspect-[4/3] animate-pulse rounded-[1.2rem] bg-black/[0.07] shadow-um-xs lg:aspect-[7/5]" />
            <div className="mt-12 h-3 w-28 animate-pulse rounded bg-um-gold-600/20" />
            <div className="mt-3 h-8 w-44 animate-pulse rounded bg-black/[0.09]" />
            <div className="mt-5 h-24 animate-pulse rounded bg-black/[0.045]" />
          </div>
          <div className="h-[36rem] animate-pulse bg-um-ink-900 shadow-[0_22px_58px_rgba(5,7,11,0.18)]" />
        </div>
      </div>
      <span className="sr-only">Loading listing…</span>
    </div>
  );
}
