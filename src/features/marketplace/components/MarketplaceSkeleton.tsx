const pulse = 'animate-pulse motion-reduce:animate-none';

export function MarketplaceSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading marketplace" className="min-h-screen bg-um-canvas">
      <div className="border-b border-white/[0.08] bg-um-ink-950">
        <div className="mx-auto max-w-um-content px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-[4.75rem]">
          <div className={`h-2.5 w-36 rounded-full bg-um-gold-300/25 ${pulse}`} />
          <div
            className={`mt-6 h-14 w-[34rem] max-w-full rounded bg-white/[0.09] sm:h-20 ${pulse}`}
          />
          <div className={`mt-3 h-12 w-[28rem] max-w-full rounded bg-white/[0.05] ${pulse}`} />
          <div
            className={`mt-9 h-[4.25rem] w-full max-w-[47rem] rounded-[0.9rem] border border-white/[0.08] bg-white/[0.05] ${pulse}`}
          />
        </div>
      </div>

      <div className="mx-auto max-w-um-content px-4 pb-20 pt-7 sm:px-6 sm:pt-9 lg:px-8">
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-5 sm:gap-3">
          {Array.from({ length: 5 }, (_, index) => (
            <div
              className={`min-h-[6.8rem] rounded-[0.9rem] border border-white/[0.07] bg-white/[0.055] sm:min-h-[8rem] ${pulse} ${
                index === 0 ? 'col-span-2 sm:col-span-1' : ''
              }`}
              key={index}
            />
          ))}
        </div>

        <div className="mt-10 border-b border-white/[0.08] pb-5 sm:mt-12">
          <div className={`h-9 w-48 rounded bg-white/[0.07] ${pulse}`} />
        </div>
        <div className="mt-8 grid grid-cols-1 gap-x-3.5 gap-y-9 min-[500px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-4">
          {Array.from({ length: 8 }, (_, index) => (
            <div key={index}>
              <div
                className={`aspect-[4/3] rounded-[0.9rem] border border-white/[0.06] bg-white/[0.06] ${pulse}`}
              />
              <div className={`mt-4 h-3 w-20 rounded bg-white/[0.05] ${pulse}`} />
              <div className={`mt-2.5 h-5 w-4/5 rounded bg-white/[0.08] ${pulse}`} />
              <div className={`mt-3 h-3 w-2/3 rounded bg-white/[0.045] ${pulse}`} />
            </div>
          ))}
        </div>
      </div>
      <span className="sr-only">Loading listings…</span>
    </div>
  );
}
