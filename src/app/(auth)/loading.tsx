export default function AuthLoading() {
  return (
    <div aria-label="Loading" className="animate-pulse" role="status">
      <div className="h-3 w-36 bg-black/10" />
      <div className="mt-6 h-14 w-4/5 bg-black/10" />
      <div className="mt-3 h-14 w-3/5 bg-black/10" />
      <div className="mt-6 h-5 w-full bg-black/[0.07]" />
      <div className="mt-2 h-5 w-3/4 bg-black/[0.07]" />
      <div className="mt-10 h-12 w-full bg-black/10" />
      <span className="sr-only">Loading sign in…</span>
    </div>
  );
}
