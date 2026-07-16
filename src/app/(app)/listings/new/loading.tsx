export default function NewListingLoading() {
  return (
    <div
      aria-label="Loading listing editor"
      className="mx-auto max-w-um-content animate-pulse px-4 pb-24 pt-6 sm:px-6 sm:pt-8 lg:px-8 lg:pt-10"
      role="status"
    >
      <div className="rounded-um-xl bg-um-ink-950 px-6 py-9 sm:px-9">
        <div className="h-3 w-28 rounded bg-white/[0.15]" />
        <div className="mt-5 h-14 w-72 max-w-full rounded bg-white/[0.15]" />
        <div className="mt-5 h-4 w-full max-w-xl rounded bg-white/10" />
      </div>
      <div className="mt-5 h-12 border-b border-black/10" />
      <div className="mt-10 grid items-start gap-12 lg:grid-cols-[minmax(0,1.72fr)_minmax(18.5rem,0.82fr)]">
        <div className="space-y-10">
          <div className="h-80 rounded-um-lg bg-um-surface-warm" />
          <div className="h-px bg-black/10" />
          <div className="h-[30rem] rounded-um-lg bg-um-surface-warm" />
        </div>
        <div className="hidden h-[30rem] rounded-um-lg bg-um-surface-warm lg:block" />
      </div>
      <span className="sr-only">Loading listing editor…</span>
    </div>
  );
}
