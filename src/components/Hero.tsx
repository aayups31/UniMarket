import { ArrowDown, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export function Hero() {
  return (
    <section className="relative isolate min-h-svh overflow-hidden bg-um-ink-950 text-um-text-inverse">
      <div className="absolute inset-0 overflow-hidden">
        <Image
          alt="The University of Waterloo Student Life Centre and campus lawn in autumn"
          className="um-hero-image object-cover object-[64%_center] brightness-[0.82] saturate-[0.96] contrast-[1.06] sm:object-[58%_center]"
          fill
          priority
          sizes="100vw"
          src="/waterloo/slc-exterior.webp"
        />
      </div>

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,6,10,0.97)_0%,rgba(4,6,10,0.86)_34%,rgba(5,8,12,0.48)_58%,rgba(5,8,12,0.1)_82%,rgba(5,8,12,0.18)_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,6,10,0.52)_0%,transparent_31%,transparent_64%,rgba(4,6,10,0.92)_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute -right-[18%] top-[6%] size-[48rem] rounded-full bg-[radial-gradient(circle,rgba(242,213,111,0.18),rgba(201,152,18,0.055)_34%,transparent_69%)] blur-2xl"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-56 bg-[radial-gradient(ellipse_at_68%_100%,rgba(231,188,53,0.13),transparent_58%)]"
      />

      <div className="relative mx-auto flex min-h-svh max-w-um-content flex-col px-4 pb-7 pt-28 sm:px-6 sm:pb-9 sm:pt-32 lg:px-8 lg:pt-36">
        <div className="flex flex-1 items-center py-12 sm:py-16 lg:py-20">
          <div className="max-w-[64rem]">
            <div className="um-hero-reveal um-hero-reveal--one flex items-center gap-4">
              <span aria-hidden="true" className="h-px w-10 bg-um-gold-300" />
              <p className="font-condensed text-[0.72rem] font-bold uppercase tracking-[0.16em] text-um-gold-300 sm:text-xs">
                Verified Waterloo students only
              </p>
            </div>

            <h1 className="um-hero-reveal um-hero-reveal--two um-balanced mt-7 max-w-[62rem] text-[clamp(3.4rem,7.2vw,7.35rem)] font-bold leading-[0.91] tracking-[-0.042em] text-[#f5f0e7]">
              Your university.
              <span className="block">Your people.</span>
              <span className="font-editorial block font-normal tracking-[-0.025em] text-um-gold-300">
                Just for you.
              </span>
            </h1>

            <p className="um-hero-reveal um-hero-reveal--three mt-8 max-w-[36rem] text-base leading-7 text-[#ede6da]/78 sm:text-lg sm:leading-8">
              A private campus marketplace for the things Waterloo students buy, sell, and pass on.
            </p>

            <div className="um-hero-reveal um-hero-reveal--four mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-um-gold-300 px-6 text-sm font-black text-um-ink-950 shadow-[0_18px_55px_rgba(201,152,18,0.2)] transition-[background-color,transform,box-shadow] duration-300 ease-um-out hover:-translate-y-0.5 hover:bg-um-gold-200 hover:shadow-[0_24px_70px_rgba(201,152,18,0.26)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-um-ink-950"
                href="/signup"
              >
                Join with Waterloo
                <ArrowRight
                  aria-hidden="true"
                  className="size-4 transition-transform duration-220 ease-um-out group-hover:translate-x-1"
                />
              </Link>
              <Link
                className="inline-flex min-h-12 items-center justify-center rounded-full px-6 text-sm font-bold text-white/74 transition-colors hover:bg-white/[0.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-um-gold-400"
                href="/marketplace"
                prefetch={false}
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>

        <div className="um-hero-reveal um-hero-reveal--five flex items-end justify-between gap-6 border-t border-white/[0.14] pt-5">
          <div>
            <p className="font-condensed text-[0.62rem] font-bold uppercase tracking-[0.18em] text-um-gold-300">
              Waterloo, Ontario
            </p>
            <p className="mt-1 text-xs text-white/48">Independent. Student-built.</p>
          </div>
          <Link
            className="group inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-white/68 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-um-gold-400"
            href="#why-waterloo"
          >
            Why Waterloo
            <ArrowDown
              aria-hidden="true"
              className="size-3.5 transition-transform duration-220 ease-um-out group-hover:translate-y-1"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
