export function MarketplaceSkeleton() {
  return (
    <div className="min-h-screen bg-um-canvas" aria-label="Loading marketplace" aria-busy="true">
      <div className="mx-auto max-w-um-content px-4 pb-20 pt-5 sm:px-6 sm:pt-7 lg:px-8 lg:pt-9">
        <div className="overflow-hidden rounded-um-xl border border-black/10 bg-um-canvas-soft shadow-um-sm lg:grid lg:grid-cols-[minmax(0,1fr)_17.5rem]">
          <div className="px-5 pb-6 pt-7 sm:px-9 sm:pb-8 sm:pt-10 lg:px-12">
            <div className="h-3 w-52 animate-pulse rounded-full bg-um-gold-600/20" />
            <div className="mt-7 h-12 w-[30rem] max-w-full animate-pulse rounded-um-sm bg-black/10 sm:h-16" />
            <div className="mt-3 h-10 w-[38rem] max-w-full animate-pulse rounded-um-sm bg-black/[0.06] sm:h-14" />
            <div className="mt-5 h-4 w-[28rem] max-w-full animate-pulse rounded bg-black/[0.06]" />
            <div className="mt-9 h-[4.25rem] w-full max-w-[58rem] animate-pulse rounded-um-lg bg-um-surface shadow-um-xs" />
            <div className="mt-8 flex flex-wrap gap-4 border-t border-black/10 pt-5">
              <div className="h-3 w-28 animate-pulse rounded bg-um-gold-600/20" />
              <div className="h-3 w-80 max-w-full animate-pulse rounded bg-black/[0.06]" />
            </div>
          </div>
          <div className="hidden animate-pulse bg-um-ink-950 lg:block" />
        </div>

        <div className="mt-10 h-3 w-36 animate-pulse rounded bg-black/[0.06]" />
        <div className="mt-2 h-7 w-48 animate-pulse rounded-um-xs bg-black/10" />
        <div className="mt-4 flex gap-3 overflow-hidden sm:grid sm:grid-cols-5">
          {Array.from({ length: 5 }, (_, index) => (
            <div
              key={index}
              className="h-[7.5rem] min-w-[10.5rem] animate-pulse rounded-um-lg bg-um-surface shadow-um-xs sm:min-w-0"
            />
          ))}
        </div>
        <div className="mt-16 h-3 w-32 animate-pulse rounded bg-black/[0.06]" />
        <div className="mt-2 h-8 w-52 animate-pulse rounded-um-xs bg-black/10" />
        <div className="mt-6 grid grid-cols-1 gap-x-4 gap-y-6 min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-5">
          {Array.from({ length: 8 }, (_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-um-lg border border-black/10 bg-um-surface shadow-um-xs"
            >
              <div className="aspect-[4/3] animate-pulse bg-um-surface-warm" />
              <div className="space-y-3.5 p-4">
                <div className="flex justify-between">
                  <div className="h-3 w-20 animate-pulse rounded bg-black/[0.06]" />
                  <div className="h-3 w-14 animate-pulse rounded bg-black/[0.06]" />
                </div>
                <div className="h-5 w-4/5 animate-pulse rounded bg-black/10" />
                <div className="h-5 w-20 animate-pulse rounded bg-black/10" />
                <div className="h-4 w-2/3 animate-pulse rounded bg-black/[0.06]" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <span className="sr-only">Loading listings…</span>
    </div>
  );
}
