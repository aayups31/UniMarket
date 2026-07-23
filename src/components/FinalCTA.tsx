import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export function FinalCTA() {
  return (
    <section
      className="relative isolate overflow-hidden bg-transparent px-4 pb-20 pt-6 text-[#ece8df] sm:px-6 sm:pb-24 lg:pb-32"
      id="join"
    >
      <div className="relative mx-auto min-h-[42rem] max-w-um-content overflow-hidden rounded-[1.75rem] border border-white/[0.1] bg-um-ink-950 shadow-[0_48px_140px_rgba(0,0,0,0.55)] sm:min-h-[46rem] sm:rounded-[2.75rem] lg:min-h-[45rem]">
        <Image
          alt="The University of Waterloo sign and Dana Porter Library at winter sunset"
          className="object-cover object-[58%_center] opacity-85 brightness-[0.88] saturate-[0.9] contrast-[1.06] sm:object-center"
          fill
          sizes="(max-width: 1024px) 100vw, 1320px"
          src="/waterloo/waterloo-sign-winter.webp"
        />

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,7,11,0.86)_0%,rgba(5,7,11,0.68)_46%,rgba(5,7,11,0.28)_78%,rgba(5,7,11,0.36)_100%),linear-gradient(0deg,rgba(5,7,11,0.84)_0%,transparent_56%,rgba(5,7,11,0.2)_100%)]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_78%_34%,rgba(242,213,111,0.14),transparent_36%)]"
        />

        <div className="relative flex min-h-[42rem] flex-col justify-between p-6 sm:min-h-[46rem] sm:p-10 lg:min-h-[45rem] lg:p-14 xl:p-16">
          <div className="flex items-center gap-3">
            <span aria-hidden="true" className="h-px w-9 bg-um-gold-400" />
            <p className="font-condensed text-xs font-bold uppercase tracking-[0.18em] text-um-gold-300">
              Made for Waterloo terms
            </p>
          </div>

          <div className="max-w-5xl py-16 sm:py-20">
            <h2 className="um-balanced text-[clamp(3rem,6.4vw,6.4rem)] font-bold leading-[0.94] tracking-[-0.038em]">
              Keep the good stuff
              <span className="block font-editorial font-normal tracking-[-0.02em] text-um-gold-300">
                on campus.
              </span>
            </h2>
            <p className="mt-8 max-w-xl text-base leading-7 text-[#e0d9ce]/78 sm:text-lg sm:leading-8">
              Bring your Waterloo inbox. The rest already feels familiar.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                className="group inline-flex min-h-12 items-center justify-center gap-4 rounded-full bg-um-gold-300 px-6 py-3.5 text-sm font-black text-um-ink-950 transition-colors hover:bg-um-gold-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-um-gold-300 focus-visible:ring-offset-2 focus-visible:ring-offset-um-ink-950"
                href="/signup"
              >
                Join with @uwaterloo.ca
                <ArrowRight
                  aria-hidden="true"
                  className="size-4 transition-transform duration-220 ease-um-out group-hover:translate-x-1"
                />
              </Link>
              <Link
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#d9d2c6]/24 px-6 text-sm font-bold text-[#e8e3da] transition-colors hover:border-um-gold-300/60 hover:bg-um-gold-300/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-um-gold-400"
                href="/marketplace"
                prefetch={false}
              >
                Sign in
              </Link>
            </div>
          </div>

          <p className="font-mono text-[0.56rem] font-semibold uppercase tracking-[0.15em] text-[#d3ccbf]/48">
            Verified access · Nearby pickup
          </p>
        </div>
      </div>
    </section>
  );
}
