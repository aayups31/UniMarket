export function MarketplaceSkeleton() {
  return (
    <div className="min-h-screen bg-um-canvas" aria-label="Loading marketplace" aria-busy="true">
      <div className="bg-um-ink-950 text-white">
        <div className="mx-auto grid max-w-um-content gap-12 px-4 pb-12 pt-12 sm:px-6 lg:grid-cols-[minmax(0,1.42fr)_minmax(18rem,0.58fr)] lg:px-8 lg:pb-14 lg:pt-16">
          <div>
            <div className="h-3 w-44 animate-pulse rounded-full bg-um-gold-400/30" />
            <div className="mt-7 h-14 w-[31rem] max-w-full animate-pulse rounded bg-white/10 sm:h-20" />
            <div className="mt-3 h-12 w-[42rem] max-w-full animate-pulse rounded bg-white/[0.055] sm:h-16" />
            <div className="mt-7 h-4 w-[30rem] max-w-full animate-pulse rounded bg-white/[0.055]" />
            <div className="mt-10 h-[4.75rem] w-full max-w-[50rem] animate-pulse rounded-[1rem] bg-white/[0.075] ring-1 ring-white/10" />
          </div>
          <div className="hidden self-end border-l border-white/10 pl-7 lg:block">
            <div className="h-3 w-36 animate-pulse rounded bg-um-gold-400/25" />
            <div className="mt-5 h-16 w-52 animate-pulse rounded bg-white/[0.07]" />
            <div className="mt-4 h-10 w-56 animate-pulse rounded bg-white/[0.04]" />
          </div>
        </div>
        <div className="h-10 animate-pulse border-t border-white/[0.07] bg-white/[0.025]" />
      </div>

      <div className="mx-auto max-w-um-content px-4 pb-20 pt-14 sm:px-6 sm:pt-16 lg:px-8 lg:pt-20">
        <div className="h-3 w-36 animate-pulse rounded bg-um-gold-600/18" />
        <div className="mt-3 h-8 w-72 max-w-full animate-pulse rounded bg-black/[0.08]" />
        <div className="mt-8 grid auto-rows-[9.5rem] grid-cols-2 gap-3 lg:grid-cols-12 lg:gap-4">
          <div className="col-span-2 row-span-2 animate-pulse rounded-[1.15rem] bg-um-ink-900 lg:col-span-5" />
          <div className="animate-pulse rounded-[1.15rem] bg-[#263b48] lg:col-span-4" />
          <div className="animate-pulse rounded-[1.15rem] bg-[#d3c6ad] lg:col-span-3" />
          <div className="animate-pulse rounded-[1.15rem] bg-[#39463f] lg:col-span-3" />
          <div className="animate-pulse rounded-[1.15rem] bg-[#b98255] lg:col-span-4" />
        </div>

        <div className="mt-20 h-3 w-28 animate-pulse rounded bg-um-gold-600/18" />
        <div className="mt-3 h-10 w-56 animate-pulse rounded bg-black/[0.08]" />
        <div className="mt-8 grid grid-cols-1 gap-x-4 gap-y-10 min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-5">
          {Array.from({ length: 8 }, (_, index) => (
            <div key={index}>
              <div className="aspect-[5/4] animate-pulse rounded-[1.05rem] bg-black/[0.07]" />
              <div className="mt-4 h-5 w-4/5 animate-pulse rounded bg-black/[0.08]" />
              <div className="mt-3 h-5 w-20 animate-pulse rounded bg-black/[0.08]" />
              <div className="mt-3 h-3 w-2/3 animate-pulse rounded bg-black/[0.05]" />
            </div>
          ))}
        </div>
      </div>
      <span className="sr-only">Loading listings…</span>
    </div>
  );
}
