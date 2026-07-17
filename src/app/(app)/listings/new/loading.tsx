export default function NewListingLoading() {
  return (
    <div
      aria-label="Loading listing editor"
      className="animate-pulse bg-um-ink-950 pb-24"
      role="status"
    >
      <div className="mx-auto max-w-um-content px-5 py-12 sm:px-8 sm:py-14 lg:px-10 lg:py-16">
        <div className="h-3 w-28 rounded bg-white/[0.15]" />
        <div className="mt-5 h-14 w-72 max-w-full rounded bg-white/[0.15]" />
        <div className="mt-5 h-4 w-full max-w-xl rounded bg-white/10" />
      </div>
      <div className="h-14 border-y border-white/10" />
      <div className="mx-auto mt-8 grid max-w-um-content items-start gap-7 px-3 sm:px-6 lg:grid-cols-[minmax(0,1.72fr)_minmax(18.5rem,0.82fr)] lg:px-8">
        <div className="space-y-10 rounded-[1.35rem] bg-um-surface-warm p-5 sm:p-8 lg:p-10">
          <div className="h-80 rounded-um-md bg-um-ink-850" />
          <div className="h-px bg-black/10" />
          <div className="h-[30rem] rounded-um-md bg-white/60" />
        </div>
        <div className="hidden h-[30rem] rounded-um-md bg-um-ink-850 lg:block" />
      </div>
      <span className="sr-only">Loading listing editor…</span>
    </div>
  );
}
