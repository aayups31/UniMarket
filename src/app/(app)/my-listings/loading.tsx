export default function MyListingsLoading() {
  return (
    <div
      aria-label="Loading your listings"
      className="mx-auto max-w-um-content animate-pulse px-4 pb-24 pt-8 sm:px-6 sm:pt-10 lg:px-8 lg:pt-14"
      role="status"
    >
      <div className="h-3 w-28 rounded bg-um-surface-warm" />
      <div className="mt-5 h-16 w-full max-w-3xl rounded-um-sm bg-um-surface-warm" />
      <div className="mt-5 h-4 w-full max-w-xl rounded bg-um-surface-warm" />
      <div className="mt-10 grid grid-cols-3 border-y border-black/10 py-5">
        {[0, 1, 2].map((item) => (
          <div className="px-4" key={item}>
            <div className="h-8 w-12 rounded bg-um-surface-warm" />
            <div className="mt-2 h-3 w-16 rounded bg-um-surface-warm" />
          </div>
        ))}
      </div>
      <div className="mt-14 h-8 w-36 rounded bg-um-surface-warm" />
      <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <div className="overflow-hidden rounded-um-lg border border-black/10 bg-white" key={item}>
            <div className="aspect-[4/3] bg-um-surface-warm" />
            <div className="space-y-4 p-5">
              <div className="h-3 w-24 rounded bg-um-surface-warm" />
              <div className="h-6 w-3/4 rounded bg-um-surface-warm" />
              <div className="h-11 w-full rounded-um-sm bg-um-surface-warm" />
            </div>
          </div>
        ))}
      </div>
      <span className="sr-only">Loading your listings…</span>
    </div>
  );
}
