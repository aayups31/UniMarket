'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  Building2,
  Check,
  Clock3,
  Eye,
  ImagePlus,
  KeyRound,
  MailCheck,
  MapPin,
  Pause,
  Play,
  Search,
  ShieldCheck,
} from 'lucide-react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

const CYCLE_MS = 7_000;
const TICK_MS = 100;

const STAGES = [
  {
    number: '01',
    label: 'Waterloo inbox',
    title: 'Create your campus account once.',
    body: 'Sign up with your @uwaterloo.ca email and a password. Open one verification link, then come back with email and password whenever you need UniMarket.',
    details: ['Waterloo email required', 'One verification link', 'Password sign-in after that'],
  },
  {
    number: '02',
    label: 'Browse or pass it on',
    title: 'Find it—or list it clearly.',
    body: 'Browse what Waterloo students have listed, or publish your own item with useful photos, an honest condition, a price, and a broad pickup area.',
    details: ['Clear item photos', 'Condition and price', 'Broad pickup area only'],
  },
  {
    number: '03',
    label: 'Campus pickup',
    title: 'Meet publicly. Inspect first.',
    body: 'Agree on a public campus-area meetup, inspect the item in person, and only complete the exchange when both people are comfortable.',
    details: ['Public meetup area', 'Inspect before exchange', 'Keep exact locations private'],
  },
] as const;

export function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  const elapsedRef = useRef(0);
  const isInView = useInView(sectionRef, { amount: 0.25 });
  const reduceMotion = useReducedMotion();
  const [activeStage, setActiveStage] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [paused, setPaused] = useState(false);
  const active = STAGES[activeStage];
  const autoplaying = isInView && !paused && !reduceMotion;

  useEffect(() => {
    if (!autoplaying) return;

    const timer = window.setInterval(() => {
      const next = elapsedRef.current + TICK_MS;
      if (next >= CYCLE_MS) {
        elapsedRef.current = 0;
        setElapsed(0);
        setActiveStage((current) => (current + 1) % STAGES.length);
        return;
      }

      elapsedRef.current = next;
      setElapsed(next);
    }, TICK_MS);

    return () => window.clearInterval(timer);
  }, [autoplaying]);

  const selectStage = (index: number) => {
    setActiveStage(index);
    elapsedRef.current = 0;
    setElapsed(0);
  };

  return (
    <section
      className="relative scroll-mt-24 overflow-hidden bg-transparent px-4 py-20 text-[#ece8df] sm:px-6 sm:py-24 lg:py-32"
      id="how-it-works"
      ref={sectionRef}
    >
      <div className="relative mx-auto max-w-um-content">
        <motion.header
          className="grid gap-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-end"
          initial={reduceMotion ? false : { opacity: 0, y: 22 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ amount: 0.45, once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.1em] text-um-gold-400">
              02 / How it works
            </p>
            <h2 className="um-balanced mt-5 max-w-4xl text-[clamp(2.8rem,5.5vw,5.5rem)] font-bold leading-[0.98] tracking-[-0.028em]">
              One account.
              <span className="font-editorial font-normal tracking-[-0.01em] text-um-gold-300">
                {' '}
                One simple campus ritual.
              </span>
            </h2>
          </div>
          <Link
            className="group inline-flex min-h-11 w-fit items-center gap-2 text-sm font-bold text-um-gold-400 underline decoration-um-gold-600 underline-offset-4 transition-colors hover:text-um-gold-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-um-gold-400"
            href="/signup"
          >
            Create an account
            <ArrowRight
              aria-hidden="true"
              className="size-4 transition-transform duration-220 ease-um-out group-hover:translate-x-1"
            />
          </Link>
        </motion.header>

        <motion.div
          className="mt-12 overflow-hidden rounded-um-lg border border-white/[0.08] bg-um-ink-950 shadow-[0_34px_100px_rgba(0,0,0,0.38)] sm:mt-14"
          initial={reduceMotion ? false : { opacity: 0, y: 28 }}
          transition={{ delay: 0.08, duration: 0.52, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ amount: 0.18, once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <div aria-label="How UniMarket works" className="grid sm:grid-cols-3" role="group">
            {STAGES.map((stage, index) => {
              const selected = index === activeStage;
              const progress = selected ? Math.min(elapsed / CYCLE_MS, 1) : 0;

              return (
                <button
                  aria-pressed={selected}
                  className={cn(
                    'relative min-h-24 border-b border-white/[0.08] px-5 py-5 text-left transition-colors duration-220 focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-um-gold-400 sm:border-b-0 sm:border-r sm:last:border-r-0',
                    selected ? 'bg-white/[0.07]' : 'bg-transparent hover:bg-white/[0.035]',
                  )}
                  key={stage.number}
                  onClick={() => selectStage(index)}
                  type="button"
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={cn(
                        'font-condensed text-xs font-bold tracking-[0.14em]',
                        selected ? 'text-um-gold-400' : 'text-white/30',
                      )}
                    >
                      {stage.number}
                    </span>
                    <span
                      className={cn(
                        'text-sm font-bold',
                        selected ? 'text-[#eee9df]' : 'text-[#c7c0b4]/48',
                      )}
                    >
                      {stage.label}
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-0.5 bg-white/[0.04]"
                  >
                    <span
                      className="block h-full origin-left bg-um-gold-400"
                      style={{ transform: `scaleX(${progress})` }}
                    />
                  </span>
                </button>
              );
            })}
          </div>

          <div className="grid lg:min-h-[38rem] lg:grid-cols-[0.72fr_1.28fr]">
            <div className="relative flex min-h-[29rem] flex-col justify-between border-b border-white/[0.08] px-6 py-8 sm:px-9 sm:py-10 lg:min-h-0 lg:border-b-0 lg:border-r lg:px-11 lg:py-12">
              <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-um-gold-400/80" />
              <AnimatePresence initial={false} mode="wait">
                <motion.div
                  animate={{ opacity: 1, x: 0 }}
                  className="relative"
                  exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -18 }}
                  initial={reduceMotion ? { opacity: 1 } : { opacity: 0, x: 18 }}
                  key={active.number}
                  transition={{ duration: reduceMotion ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-condensed text-5xl font-bold tracking-[-0.05em] text-um-gold-400">
                      {active.number}
                    </span>
                    <span className="h-px w-10 bg-um-gold-500/65" />
                    <p className="font-condensed text-[0.68rem] font-bold uppercase tracking-[0.17em] text-white/42">
                      {active.label}
                    </p>
                  </div>
                  <h3 className="mt-8 max-w-md text-3xl font-bold leading-[1.06] tracking-[-0.022em] sm:text-4xl">
                    {active.title}
                  </h3>
                  <p className="mt-5 max-w-md text-sm leading-7 text-white/76 sm:text-base">
                    {active.body}
                  </p>
                  <ul className="mt-8 space-y-3">
                    {active.details.map((detail) => (
                      <li
                        className="flex items-center gap-3 text-sm font-medium text-white/70"
                        key={detail}
                      >
                        <span className="grid size-5 shrink-0 place-items-center rounded-full bg-um-gold-400 text-um-ink-950">
                          <Check aria-hidden="true" className="size-3" strokeWidth={2.4} />
                        </span>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </AnimatePresence>

              <div className="relative mt-10 flex items-center justify-between gap-4 border-t border-white/[0.08] pt-5">
                <p className="font-condensed text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-white/35">
                  {reduceMotion ? 'Motion reduced' : paused ? 'Demo paused' : 'Demo playing'}
                </p>
                {!reduceMotion ? (
                  <button
                    aria-label={paused ? 'Play product demo' : 'Pause product demo'}
                    className="grid size-11 place-items-center rounded-full border border-white/12 text-white/65 transition hover:border-um-gold-400/55 hover:text-um-gold-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-um-gold-400"
                    onClick={() => setPaused((current) => !current)}
                    type="button"
                  >
                    {paused ? (
                      <Play aria-hidden="true" className="ml-0.5 size-4" fill="currentColor" />
                    ) : (
                      <Pause aria-hidden="true" className="size-4" fill="currentColor" />
                    )}
                  </button>
                ) : null}
              </div>
            </div>

            <div className="relative min-h-[34rem] overflow-hidden sm:min-h-[40rem] lg:min-h-0">
              <Image
                alt=""
                className="object-cover opacity-40 brightness-[0.7] saturate-[0.7]"
                fill
                sizes="(min-width: 1024px) 58vw, 100vw"
                src="/waterloo/slc-interior.webp"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-br from-um-ink-950/75 via-um-ink-950/28 to-um-ink-950/80"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_65%,rgba(8,12,19,.78))]"
              />

              <div className="relative flex h-full min-h-[34rem] flex-col p-4 sm:min-h-[40rem] sm:p-7 lg:min-h-[38rem] lg:p-9">
                <div className="flex items-center justify-between gap-4">
                  <p className="font-condensed text-[0.65rem] font-bold uppercase tracking-[0.16em] text-white/58">
                    UniMarket / Product walk-through
                  </p>
                  <p className="hidden items-center gap-1.5 font-condensed text-[0.62rem] font-semibold uppercase tracking-[0.13em] text-white/48 sm:flex">
                    <MapPin aria-hidden="true" className="size-3 text-um-gold-400" />
                    Waterloo campus
                  </p>
                </div>

                <div className="my-auto py-7">
                  <AnimatePresence initial={false} mode="wait">
                    <motion.div
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.985, y: -8 }}
                      initial={reduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.985, y: 12 }}
                      key={active.number}
                      transition={{ duration: reduceMotion ? 0 : 0.32, ease: [0.22, 1, 0.36, 1] }}
                    >
                      {activeStage === 0 ? (
                        <CampusAccessDemo />
                      ) : activeStage === 1 ? (
                        <ListingFlowDemo />
                      ) : (
                        <CampusMeetupDemo />
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                <p className="font-condensed text-[0.62rem] font-semibold uppercase tracking-[0.15em] text-white/42">
                  Independent student-built marketplace / No official university affiliation
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <p className="mt-6 max-w-3xl border-l border-white/15 pl-4 text-xs leading-6 text-white/42 sm:text-sm">
          Verification confirms access to a Waterloo email. It does not replace inspecting an item,
          meeting in public, or using your own judgment before an exchange.
        </p>
      </div>
    </section>
  );
}

function ProductWindow({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div className="mx-auto w-full max-w-2xl overflow-hidden rounded-um-md bg-[#11141a] text-[#e9e5dc] shadow-[0_30px_90px_rgba(0,0,0,0.48)] ring-1 ring-white/12">
      <div className="flex h-10 items-center justify-between border-b border-white/[0.08] bg-[#171a20] px-4">
        <div aria-hidden="true" className="flex gap-1.5">
          <span className="size-1.5 rounded-full bg-white/16" />
          <span className="size-1.5 rounded-full bg-white/16" />
          <span className="size-1.5 rounded-full bg-um-gold-500" />
        </div>
        <p className="font-condensed text-[0.62rem] font-bold uppercase tracking-[0.14em] text-[#aaa398]">
          {label}
        </p>
      </div>
      {children}
    </div>
  );
}

function FacadeField() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -right-24 -top-28 size-80 rounded-full bg-um-gold-400/[0.08] blur-[72px]" />
      <div className="absolute -bottom-32 -left-24 size-72 rounded-full bg-um-gold-600/[0.06] blur-[80px]" />
    </div>
  );
}

function CampusAccessDemo() {
  return (
    <ProductWindow label="Campus access">
      <div className="grid md:grid-cols-[1.1fr_0.9fr]">
        <div className="p-5 sm:p-7">
          <p className="font-condensed text-[0.64rem] font-bold uppercase tracking-[0.14em] text-um-gold-400">
            New student account
          </p>
          <h4 className="mt-2 text-2xl font-black tracking-[-0.04em]">Start with Waterloo.</h4>
          <div className="mt-6 space-y-3">
            <DemoField icon={MailCheck} label="University email" value="you@uwaterloo.ca" />
            <DemoField icon={KeyRound} label="Create password" value="••••••••••••" />
          </div>
          <div className="mt-4 flex min-h-11 items-center justify-center rounded-um-sm bg-um-gold-300 px-4 text-sm font-bold text-um-ink-950">
            Create account
            <ArrowRight aria-hidden="true" className="ml-2 size-4 text-um-ink-950" />
          </div>
        </div>
        <div className="flex flex-col justify-between border-l border-white/[0.08] bg-[#090b0f] p-5 text-[#e9e5dc] sm:p-7">
          <div>
            <MailCheck aria-hidden="true" className="size-8 text-um-gold-400" strokeWidth={1.6} />
            <p className="mt-5 font-condensed text-[0.62rem] font-bold uppercase tracking-[0.16em] text-um-gold-400">
              Verify once
            </p>
            <p className="mt-2 text-sm leading-6 text-[#c4bdb1]/62">
              Open the confirmation link sent to your Waterloo inbox.
            </p>
          </div>
          <div className="mt-8 border-t border-white/10 pt-4">
            <p className="flex items-center gap-2 text-xs font-semibold text-[#d8d2c6]/72">
              <ShieldCheck aria-hidden="true" className="size-4 text-um-gold-400" />
              Later: email + password
            </p>
          </div>
        </div>
      </div>
    </ProductWindow>
  );
}

function ListingFlowDemo() {
  return (
    <ProductWindow label="Browse / Pass it on">
      <div className="border-b border-white/[0.08] p-4 sm:px-6">
        <div className="flex h-11 items-center gap-3 rounded-um-sm bg-[#090b0f] px-4 text-sm text-[#aaa398] shadow-um-xs ring-1 ring-white/[0.08]">
          <Search aria-hidden="true" className="size-4 text-um-gold-400" />
          Browse Waterloo listings
        </div>
      </div>
      <div className="grid gap-5 p-4 sm:p-6 md:grid-cols-[0.85fr_1.15fr]">
        <div className="relative flex min-h-56 flex-col items-center justify-center overflow-hidden rounded-um-sm bg-[#090b0f] px-5 text-center text-[#e9e5dc]">
          <FacadeField />
          <span className="relative grid size-11 place-items-center border border-white/10 bg-white/[0.06] text-um-gold-400">
            <ImagePlus aria-hidden="true" className="size-5" />
          </span>
          <p className="relative mt-4 text-sm font-bold">Add clear photos</p>
          <p className="relative mt-1 text-xs text-[#aaa398]">First image becomes the cover</p>
        </div>
        <div>
          <p className="font-condensed text-[0.62rem] font-bold uppercase tracking-[0.15em] text-um-gold-400">
            Listing details
          </p>
          <div className="mt-3 space-y-3">
            <DemoRow label="Condition" value="New · Like new · Good · Fair" />
            <DemoRow label="Price" value="$ — CAD" />
            <DemoRow icon={MapPin} label="Pickup" value="Choose a broad area" />
          </div>
          <div className="mt-4 flex min-h-11 items-center justify-center rounded-um-sm bg-um-gold-400 px-4 text-sm font-bold text-um-ink-950">
            Publish for Waterloo
          </div>
        </div>
      </div>
    </ProductWindow>
  );
}

function CampusMeetupDemo() {
  return (
    <ProductWindow label="Public campus pickup">
      <div className="relative min-h-[27rem] overflow-hidden bg-[#090b0f] p-5 text-[#e9e5dc] sm:p-7">
        <FacadeField />

        <div className="relative flex items-start justify-between gap-4">
          <div>
            <p className="font-condensed text-[0.62rem] font-bold uppercase tracking-[0.16em] text-um-gold-400">
              Meetup plan
            </p>
            <h4 className="mt-2 text-2xl font-black tracking-[-0.04em]">
              Keep the handoff public.
            </h4>
          </div>
          <ShieldCheck
            aria-hidden="true"
            className="size-7 shrink-0 text-um-gold-400"
            strokeWidth={1.6}
          />
        </div>

        <div className="relative mt-10 grid gap-px overflow-hidden border border-white/[0.09] bg-white/[0.09] sm:grid-cols-3">
          <MeetupPrinciple
            detail="Choose a familiar, busy campus-area spot."
            icon={Building2}
            label="Public place"
            number="01"
          />
          <MeetupPrinciple
            detail="Confirm the time and precise spot together."
            icon={Clock3}
            label="Agreed together"
            number="02"
          />
          <MeetupPrinciple
            detail="Check condition before money changes hands."
            icon={Eye}
            label="Inspect first"
            number="03"
          />
        </div>

        <div className="relative mt-5 grid gap-2 sm:grid-cols-2">
          <div className="flex min-h-12 items-center gap-3 bg-white/[0.07] px-4 text-xs font-semibold text-[#d8d2c6]/78 ring-1 ring-white/[0.08]">
            <MapPin aria-hidden="true" className="size-4 shrink-0 text-um-gold-400" />
            Meet in a public campus area
          </div>
          <div className="flex min-h-12 items-center gap-3 bg-white/[0.07] px-4 text-xs font-semibold text-[#d8d2c6]/78 ring-1 ring-white/[0.08]">
            <Eye aria-hidden="true" className="size-4 shrink-0 text-um-gold-400" />
            Inspect before exchanging
          </div>
        </div>
      </div>
    </ProductWindow>
  );
}

function MeetupPrinciple({
  detail,
  icon: Icon,
  label,
  number,
}: {
  detail: string;
  icon: typeof Eye;
  label: string;
  number: string;
}) {
  return (
    <div className="relative min-h-40 bg-[#101319] p-4 sm:p-5">
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-0.5 bg-um-gold-400/75" />
      <div className="flex items-center justify-between gap-3">
        <span className="font-mono text-[0.56rem] font-semibold tracking-[0.14em] text-um-gold-400">
          {number}
        </span>
        <Icon aria-hidden="true" className="size-4 text-[#b9b2a6]" strokeWidth={1.7} />
      </div>
      <p className="mt-7 text-sm font-bold">{label}</p>
      <p className="mt-2 text-xs leading-5 text-[#9f988d]">{detail}</p>
    </div>
  );
}

function DemoField({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof MailCheck;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-um-sm bg-[#090b0f] px-4 py-3 shadow-um-xs ring-1 ring-white/[0.08]">
      <p className="font-condensed text-[0.58rem] font-bold uppercase tracking-[0.12em] text-[#918a80]">
        {label}
      </p>
      <p className="mt-1 flex items-center gap-2 text-sm font-semibold">
        <Icon aria-hidden="true" className="size-3.5 text-um-gold-400" />
        {value}
      </p>
    </div>
  );
}

function DemoRow({
  icon: Icon,
  label,
  value,
}: {
  icon?: typeof MapPin;
  label: string;
  value: string;
}) {
  return (
    <div className="border-b border-white/10 pb-2.5">
      <p className="font-condensed text-[0.58rem] font-bold uppercase tracking-[0.12em] text-[#918a80]">
        {label}
      </p>
      <p className="mt-1 flex items-center gap-2 text-xs font-semibold text-[#d8d2c6] sm:text-sm">
        {Icon ? <Icon aria-hidden="true" className="size-3.5 text-um-gold-400" /> : null}
        {value}
      </p>
    </div>
  );
}
