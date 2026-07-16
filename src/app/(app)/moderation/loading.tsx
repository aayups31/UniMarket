export default function ModerationLoading() {
  return (
    <div
      aria-label="Loading moderator workspace"
      className="mx-auto max-w-um-content animate-pulse px-4 pb-24 pt-6 sm:px-6 sm:pt-9 lg:px-8 lg:pt-12"
      role="status"
    >
      <div className="overflow-hidden rounded-um-xl border border-black/10 bg-um-canvas-soft lg:grid lg:grid-cols-[minmax(0,1fr)_21rem]">
        <div className="px-6 py-10 sm:px-9 lg:px-11 lg:py-12">
          <div className="h-3 w-36 rounded bg-black/[0.07]" />
          <div className="mt-6 h-20 max-w-3xl rounded-um-sm bg-black/10 sm:h-28" />
          <div className="mt-6 h-4 max-w-2xl rounded bg-black/[0.07]" />
          <div className="mt-3 h-4 max-w-xl rounded bg-black/[0.07]" />
          <div className="mt-7 h-11 w-48 rounded-um-sm bg-black/10" />
        </div>
        <div className="hidden bg-um-ink-950 lg:block" />
      </div>

      <div className="mt-14 h-8 w-56 rounded-um-xs bg-black/10" />
      <div className="mt-5 grid overflow-hidden rounded-um-lg border border-black/10 bg-um-surface md:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <div className="border-black/10 p-6 md:border-l md:first:border-0" key={item}>
            <div className="h-10 w-10 rounded-um-md bg-um-surface-warm" />
            <div className="mt-5 h-4 w-28 rounded bg-um-surface-warm" />
            <div className="mt-3 h-3 w-full rounded bg-um-surface-warm" />
          </div>
        ))}
      </div>

      <div className="mt-20 h-8 w-44 rounded-um-xs bg-black/10" />
      <div className="mt-6 overflow-hidden rounded-um-lg border border-black/10 bg-um-surface">
        <div className="h-14 border-b border-black/10 bg-um-canvas-soft" />
        {[0, 1, 2].map((item) => (
          <div className="grid grid-cols-4 gap-6 border-b border-black/10 p-6" key={item}>
            <div className="h-4 rounded bg-um-surface-warm" />
            <div className="h-4 rounded bg-um-surface-warm" />
            <div className="h-4 rounded bg-um-surface-warm" />
            <div className="h-4 rounded bg-um-surface-warm" />
          </div>
        ))}
      </div>
      <span className="sr-only">Loading moderator workspace…</span>
    </div>
  );
}
