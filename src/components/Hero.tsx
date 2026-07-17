'use client';

import { ArrowDown, ArrowRight, BadgeCheck, ImagePlus, MapPin, Search } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';

const easeOut = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative isolate min-h-svh overflow-hidden bg-um-ink-950 text-um-text-inverse">
      <motion.div
        animate={reduceMotion ? undefined : { scale: 1 }}
        className="absolute inset-0"
        initial={reduceMotion ? false : { scale: 1.045 }}
        transition={{ duration: 1.8, ease: easeOut }}
      >
        <Image
          alt="The University of Waterloo Student Life Centre and campus lawn in autumn"
          className="object-cover object-[62%_center] brightness-[0.64] saturate-[0.78] contrast-[1.08] sm:object-[58%_center]"
          fill
          priority
          sizes="100vw"
          src="/waterloo/slc-exterior.webp"
        />
      </motion.div>

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,7,11,0.98)_0%,rgba(5,7,11,0.92)_31%,rgba(5,7,11,0.61)_62%,rgba(5,7,11,0.28)_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,7,11,0.64)_0%,transparent_30%,transparent_62%,rgba(5,7,11,0.95)_100%)]"
      />
      <MarketplaceSignals reduceMotion={reduceMotion} />

      <div className="relative mx-auto flex min-h-svh max-w-um-content flex-col px-4 pb-6 pt-28 sm:px-6 sm:pb-8 sm:pt-32 lg:pt-36">
        <div className="flex flex-1 items-center py-12 sm:py-16 lg:py-20">
          <div className="max-w-[59rem]">
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-4"
              initial={reduceMotion ? false : { opacity: 0, y: 14 }}
              transition={{ delay: 0.12, duration: 0.6, ease: easeOut }}
            >
              <motion.span
                aria-hidden="true"
                animate={{ scaleX: 1 }}
                className="h-px w-10 origin-left bg-um-gold-400"
                initial={reduceMotion ? false : { scaleX: 0 }}
                transition={{ delay: 0.2, duration: 0.65, ease: easeOut }}
              />
              <p className="text-[0.78rem] font-semibold uppercase tracking-[0.1em] text-um-gold-300">
                For verified Waterloo students
              </p>
            </motion.div>

            <motion.h1
              animate={{ opacity: 1, y: 0 }}
              className="um-balanced mt-7 max-w-[58rem] text-[clamp(3rem,6.8vw,6.8rem)] font-bold leading-[0.96] tracking-[-0.028em] text-[#f2eee6]"
              initial={reduceMotion ? false : { opacity: 0, y: 30 }}
              transition={{ delay: 0.18, duration: 0.85, ease: easeOut }}
            >
              Your university.
              <span className="block">Your people.</span>
              <span className="block text-um-gold-300">Just for you.</span>
            </motion.h1>

            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 grid max-w-[47rem] gap-6 border-t border-white/[0.13] pt-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start"
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              transition={{ delay: 0.34, duration: 0.7, ease: easeOut }}
            >
              <p className="max-w-xl text-base leading-7 text-[#e5dfd5]/82 sm:text-lg sm:leading-8">
                Buy, sell, and pass useful things between study terms, co-op moves, and nearby
                campus pickup—with a verified Waterloo email.
              </p>
              <p className="text-xs font-medium leading-5 tracking-[0.03em] text-[#ddd7cc]/68 sm:text-right">
                Built for term life
                <span className="block text-[#f0ebe2]/82">Winter · Spring · Fall</span>
              </p>
            </motion.div>

            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              transition={{ delay: 0.44, duration: 0.65, ease: easeOut }}
            >
              <Link
                className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-sm bg-um-gold-400 px-5 text-sm font-black text-um-ink-950 shadow-[0_18px_50px_rgba(5,7,11,0.24)] transition-colors hover:bg-um-gold-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-um-ink-950"
                href="/signup"
              >
                Enter with @uwaterloo.ca
                <ArrowRight
                  aria-hidden="true"
                  className="size-4 transition-transform duration-220 ease-um-out group-hover:translate-x-1"
                />
              </Link>
              <Link
                className="inline-flex min-h-12 items-center justify-center px-5 text-sm font-bold text-white/72 underline decoration-white/28 underline-offset-4 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-um-gold-400"
                href="/login"
              >
                Sign in to your account
              </Link>
            </motion.div>
          </div>
        </div>

        <motion.div
          animate={{ opacity: 1 }}
          className="grid gap-5 border-t border-white/[0.11] pt-5 md:grid-cols-[1fr_auto] md:items-end"
          initial={reduceMotion ? false : { opacity: 0 }}
          transition={{ delay: 0.65, duration: 0.7 }}
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-um-gold-300">
              Around your Waterloo
            </p>
            <p className="mt-1.5 text-xs font-medium leading-5 tracking-[0.04em] text-white/68">
              DC · SLC · E7 · UWP · ICON · LESTER · COLUMBIA · PHILLIP
            </p>
          </div>

          <div className="flex flex-col gap-3 md:items-end">
            <Link
              className="group inline-flex min-h-11 w-fit items-center gap-2 text-sm font-semibold text-white/72 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-um-gold-400"
              href="#why-waterloo"
            >
              See why one campus works
              <ArrowDown
                aria-hidden="true"
                className="size-3.5 transition-transform duration-220 ease-um-out group-hover:translate-y-1"
              />
            </Link>
            <p className="max-w-lg text-xs leading-5 text-white/55 md:text-right">
              Independent and student-built. Not affiliated with or endorsed by the University of
              Waterloo.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function MarketplaceSignals({ reduceMotion }: { reduceMotion: boolean | null }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 hidden lg:block">
      <FloatingSignal
        className="right-[5%] top-[17%] w-[21rem]"
        delay={0.42}
        drift={-5}
        reduceMotion={reduceMotion}
      >
        <div className="flex min-h-14 items-center gap-3 bg-um-ink-950/82 px-4 text-[#ece8df] shadow-[0_20px_55px_rgba(0,0,0,0.34)] ring-1 ring-white/[0.1] backdrop-blur-xl">
          <Search className="size-4 text-um-gold-300" />
          <div className="min-w-0 flex-1">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.09em] text-white/58">
              Waterloo marketplace
            </p>
            <p className="mt-0.5 truncate text-xs font-semibold text-white/76">
              Search monitors, textbooks, furniture…
            </p>
          </div>
          <span className="border border-white/15 px-2 py-1 font-mono text-[0.52rem] text-white/40">
            ⌘ K
          </span>
        </div>
      </FloatingSignal>

      <FloatingSignal
        className="bottom-[24%] right-[7%] w-[15rem]"
        delay={0.62}
        drift={6}
        reduceMotion={reduceMotion}
      >
        <div className="bg-[#111720]/94 p-4 text-[#ece8df] shadow-[0_24px_65px_rgba(0,0,0,0.36)] ring-1 ring-white/[0.1] backdrop-blur-xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.09em] text-um-gold-300">
                Pass it on
              </p>
              <p className="mt-1.5 text-sm font-black tracking-[-0.025em]">Create a listing</p>
            </div>
            <ImagePlus className="size-5 text-um-gold-600" />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-px bg-white/[0.08] font-mono text-[0.48rem] uppercase tracking-[0.1em] text-[#aaa49a]">
            {['Photos', 'Details', 'Pickup'].map((label) => (
              <span className="bg-[#171f2a] px-1 py-2 text-center" key={label}>
                {label}
              </span>
            ))}
          </div>
        </div>
      </FloatingSignal>

      <FloatingSignal
        className="bottom-[31%] left-[63%] w-[13.5rem]"
        delay={0.78}
        drift={-4}
        reduceMotion={reduceMotion}
      >
        <div className="flex items-center gap-3 bg-um-ink-950/78 px-3.5 py-3 text-white shadow-[0_16px_45px_rgba(0,0,0,0.3)] ring-1 ring-white/[0.12] backdrop-blur-xl">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-um-gold-400 text-um-ink-950">
            <MapPin className="size-4" />
          </span>
          <div>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.09em] text-um-gold-300">
              Pickup nearby
            </p>
            <p className="mt-0.5 text-[0.68rem] font-semibold text-white/66">DC · SLC · E7 · UWP</p>
          </div>
          <BadgeCheck className="ml-auto size-4 text-um-gold-300" />
        </div>
      </FloatingSignal>
    </div>
  );
}

function FloatingSignal({
  children,
  className,
  delay,
  drift,
  reduceMotion,
}: {
  children: ReactNode;
  className: string;
  delay: number;
  drift: number;
  reduceMotion: boolean | null;
}) {
  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className={`absolute ${className}`}
      initial={reduceMotion ? false : { opacity: 0, y: 20 }}
      transition={{ delay, duration: 0.75, ease: easeOut }}
    >
      <motion.div
        animate={reduceMotion ? undefined : { y: [0, drift, 0] }}
        transition={{ delay: delay + 0.8, duration: 5.5, ease: 'easeInOut', repeat: Infinity }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
