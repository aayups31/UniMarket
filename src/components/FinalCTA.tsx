import { ArrowRight, Check } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const nextSteps = [
  ['01', 'Use your Waterloo inbox'],
  ['02', 'Verify once'],
  ['03', 'Make the campus yours'],
] as const;

export function FinalCTA() {
  return (
    <section
      className="relative isolate overflow-hidden bg-transparent px-4 pb-20 pt-6 text-[#ece8df] sm:px-6 sm:pb-24 lg:pb-32"
      id="join"
    >
      <div className="relative mx-auto min-h-[48rem] max-w-um-content overflow-hidden rounded-[1.75rem] border border-white/[0.08] bg-um-ink-950 shadow-[0_48px_140px_rgba(0,0,0,0.55)] sm:min-h-[54rem] sm:rounded-[2.75rem] lg:min-h-[50rem]">
        <Image
          alt="The University of Waterloo sign and Dana Porter Library at winter sunset"
          className="object-cover object-[58%_center] opacity-70 brightness-[0.7] saturate-[0.72] contrast-[1.08] sm:object-center"
          fill
          sizes="(max-width: 1024px) 100vw, 1320px"
          src="/waterloo/waterloo-sign-winter.webp"
        />

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,7,11,0.96)_0%,rgba(5,7,11,0.82)_42%,rgba(5,7,11,0.32)_74%,rgba(5,7,11,0.5)_100%),linear-gradient(0deg,rgba(5,7,11,0.92)_0%,transparent_55%,rgba(5,7,11,0.28)_100%)]"
        />

        <div className="relative flex min-h-[48rem] flex-col justify-between p-6 sm:min-h-[54rem] sm:p-10 lg:min-h-[50rem] lg:p-14 xl:p-16">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div className="flex items-center gap-3">
              <span aria-hidden="true" className="h-px w-9 bg-um-gold-400" />
              <p className="font-condensed text-xs font-bold uppercase tracking-[0.18em] text-um-gold-300">
                Made for Waterloo terms
              </p>
            </div>
            <p className="font-mono text-[0.56rem] font-semibold uppercase tracking-[0.15em] text-[#c8c1b6]/48">
              Student to student · Nearby pickup
            </p>
          </div>

          <div className="max-w-5xl py-14 sm:py-20">
            <p className="text-sm font-semibold uppercase tracking-[0.1em] text-um-gold-300">
              One university. One shared marketplace.
            </p>
            <h2 className="um-balanced mt-6 text-[clamp(3rem,6.4vw,6.4rem)] font-bold leading-[0.97] tracking-[-0.03em]">
              Keep the good stuff
              <span className="block font-editorial font-normal tracking-[-0.01em] text-[#d7d0c5]/72">
                on campus.
              </span>
            </h2>
            <p className="mt-8 max-w-2xl text-base leading-7 text-[#e0d9ce]/82 sm:text-xl sm:leading-9">
              Bring your Waterloo inbox. Enter a marketplace shaped around the places, terms, and
              people already around you.
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
                href="/login"
              >
                Sign in
              </Link>
            </div>
          </div>

          <ol className="grid border-t border-white/12 md:grid-cols-3">
            {nextSteps.map(([number, label], index) => (
              <li
                className={`flex min-h-20 items-center gap-4 py-5 md:px-6 ${
                  index > 0 ? 'border-t border-white/10 md:border-l md:border-t-0' : ''
                }`}
                key={number}
              >
                <span className="font-mono text-[0.58rem] font-semibold tracking-[0.16em] text-um-gold-300">
                  {number}
                </span>
                <span className="text-sm font-bold text-[#ddd6cb]/78">{label}</span>
                {index === nextSteps.length - 1 ? (
                  <Check aria-hidden="true" className="ml-auto size-4 text-um-gold-300" />
                ) : null}
              </li>
            ))}
          </ol>
        </div>
      </div>

      <p className="mx-auto mt-7 max-w-um-content text-xs leading-5 text-[#aaa398]/45">
        Campus photography from the supplied Waterloo collection. UniMarket is an independent
        student-built project and is not affiliated with or endorsed by the University of Waterloo.
      </p>
    </section>
  );
}
