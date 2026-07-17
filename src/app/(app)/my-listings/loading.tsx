export default function MyListingsLoading() {
  return (
    <div aria-label="Loading your listings" className="animate-pulse pb-24" role="status">
      <div className="bg-um-ink-950">
        <div className="mx-auto max-w-um-content px-4 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
          <div className="h-3 w-28 rounded bg-white/15" />
          <div className="mt-5 h-16 w-full max-w-3xl rounded-um-sm bg-white/10" />
          <div className="mt-5 h-4 w-full max-w-xl rounded bg-white/10" />
        </div>
      </div>
      <div className="mx-auto max-w-um-content px-4 sm:px-6 lg:px-8">
        <div className="mt-10 grid grid-cols-3 border-y border-black/10 py-5">
          {[0, 1, 2].map((item) => (
            <div className="px-4" key={item}>
              <div className="h-8 w-12 rounded bg-um-surface-warm" />
              <div className="mt-2 h-3 w-16 rounded bg-um-surface-warm" />
            </div>
          ))}
        </div>
        <div className="mt-14 h-8 w-36 rounded bg-um-surface-warm" />
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-12">
          {[0, 1, 2].map((item) => (
            <div
              className={`overflow-hidden rounded-um-md bg-white ring-1 ring-black/[0.06] ${item === 0 ? 'xl:col-span-6' : 'xl:col-span-3'}`}
              key={item}
            >
              <div className="aspect-[4/3] bg-um-surface-warm" />
              <div className="space-y-4 p-5">
                <div className="h-3 w-24 rounded bg-um-surface-warm" />
                <div className="h-6 w-3/4 rounded bg-um-surface-warm" />
                <div className="h-11 w-full rounded-um-sm bg-um-surface-warm" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <span className="sr-only">Loading your listings…</span>
    </div>
  );
}
