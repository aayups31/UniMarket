import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function FinalCTA() {
  return (
    <section
      className="bg-um-gold-500 px-4 py-16 text-um-ink-950 sm:px-6 sm:py-20 lg:py-24"
      id="join"
    >
      <div className="mx-auto grid max-w-um-content gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(22rem,0.9fr)] lg:items-end lg:gap-20">
        <div>
          <p className="font-condensed text-sm font-bold uppercase tracking-[0.15em]">Pass it on</p>
          <h2 className="um-balanced mt-4 max-w-4xl text-[clamp(3rem,7vw,6.5rem)] font-black leading-[0.88] tracking-[-0.07em]">
            Waterloo starts with students willing to list.
          </h2>
        </div>

        <div className="border-l-2 border-um-ink-950/28 pl-5 sm:pl-7">
          <p className="max-w-md text-base leading-7 text-um-ink-950/72 sm:text-lg">
            Create a verified account, browse what is actually available, or give something useful
            another term on campus.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-um-sm bg-um-ink-950 px-5 text-sm font-black text-um-text-inverse transition-colors hover:bg-um-ink-850 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-um-ink-950 focus-visible:ring-offset-2 focus-visible:ring-offset-um-gold-500"
              href="/signup"
            >
              Join with @uwaterloo.ca
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
            <Link
              className="inline-flex min-h-12 items-center justify-center px-5 text-sm font-bold underline decoration-um-ink-950/35 underline-offset-4 transition-colors hover:text-um-ink-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-um-ink-950"
              href="/login"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
