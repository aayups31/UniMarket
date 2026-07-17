'use client';

import Image from 'next/image';
import { BadgeCheck, MapPin, ShieldCheck } from 'lucide-react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

export function WhyBetter() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const campusImageY = useTransform(scrollYProgress, [0, 1], [-34, 34]);
  const roomImageY = useTransform(scrollYProgress, [0, 1], [30, -30]);

  const reveal = (delay = 0) => ({
    initial: reduceMotion ? false : { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.24 },
    transition: { duration: reduceMotion ? 0 : 0.72, delay, ease: EASE_OUT },
  });

  return (
    <section
      className="relative scroll-mt-24 overflow-hidden bg-transparent text-[#ece8df]"
      id="why-waterloo"
      ref={sectionRef}
    >
      <div className="relative mx-auto max-w-um-content px-4 pb-14 pt-24 sm:px-6 sm:pb-20 sm:pt-28 lg:px-8 lg:pb-24 lg:pt-36">
        <motion.div
          {...reveal()}
          className="grid gap-10 lg:grid-cols-[minmax(0,1.28fr)_minmax(18rem,0.72fr)] lg:items-end lg:gap-20"
        >
          <div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold uppercase tracking-[0.1em] text-um-gold-300 sm:text-sm">
                01 / Why Waterloo first
              </span>
              <span aria-hidden="true" className="h-px w-16 bg-um-gold-400/55" />
            </div>
            <h2 className="um-balanced mt-7 max-w-5xl text-[clamp(2.9rem,6vw,5.9rem)] font-bold leading-[0.97] tracking-[-0.028em]">
              One campus changes
              <span className="font-editorial block font-normal tracking-[-0.01em] text-um-gold-300">
                the whole marketplace.
              </span>
            </h2>
          </div>

          <div className="border-l border-[#e8e2d5]/14 pl-6 sm:pl-8">
            <p className="max-w-md text-base leading-7 text-[#e0d9ce]/78 sm:text-lg sm:leading-8">
              The marketplace becomes more useful when access, timing, and pickup already speak the
              language of Waterloo life.
            </p>
            <ol className="mt-8 space-y-3 text-xs font-semibold tracking-[0.03em] text-[#d8d2c6]/72">
              <li className="flex items-center gap-3">
                <span className="text-um-gold-300">01</span> Verified university access
              </li>
              <li className="flex items-center gap-3">
                <span className="text-um-gold-300">02</span> Familiar public pickup
              </li>
              <li className="flex items-center gap-3">
                <span className="text-um-gold-300">03</span> Built around term life
              </li>
            </ol>
          </div>
        </motion.div>

        <motion.figure
          {...reveal(0.08)}
          className="relative mt-14 h-[34rem] overflow-hidden bg-um-ink-900 shadow-[0_30px_90px_rgba(0,0,0,0.35)] sm:mt-20 sm:h-[42rem] lg:mt-24 lg:h-[47rem]"
        >
          <motion.div
            className="absolute -inset-y-12 inset-x-0"
            style={{ y: reduceMotion ? 0 : campusImageY }}
          >
            <Image
              alt="The upper lounge inside Waterloo's Student Life Centre, with black-and-gold flooring and campus buildings beyond the windows"
              className="object-cover brightness-[0.68] saturate-[0.78] contrast-[1.08]"
              fill
              sizes="(min-width: 1320px) 1320px, 100vw"
              src="/waterloo/slc-interior.webp"
            />
          </motion.div>
          <div aria-hidden="true" className="absolute inset-0 bg-um-ink-950/30" />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-um-ink-950 via-um-ink-950/10 to-um-ink-950/28"
          />

          <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-6 p-5 sm:p-8 lg:p-10">
            <p className="font-condensed text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#eee9df]/68">
              Waterloo / after class
            </p>
            <p className="hidden text-right font-mono text-[0.56rem] uppercase leading-4 tracking-[0.13em] text-[#d8d2c6]/48 sm:block">
              Public pickup<span className="block">Student to student</span>
            </p>
          </div>

          <blockquote className="absolute bottom-8 left-6 max-w-xl sm:bottom-10 sm:left-10 lg:bottom-12 lg:left-12">
            <p className="font-editorial text-[clamp(2.5rem,4.7vw,5rem)] leading-[1.01] tracking-[-0.012em] text-[#f1ede4]">
              Verified here.
              <span className="block text-um-gold-300">Picked up nearby.</span>
            </p>
          </blockquote>

          <AccessFragment />

          <figcaption className="sr-only">
            Waterloo campus at evening with an example of UniMarket’s student verification and broad
            pickup-area interface.
          </figcaption>
        </motion.figure>
      </div>

      <div className="relative overflow-hidden bg-black/10 text-[#ece8df]">
        <div className="mx-auto max-w-um-content px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
          <div className="grid gap-14 border-b border-white/[0.08] pb-20 lg:grid-cols-12 lg:gap-0 lg:pb-28">
            <motion.article {...reveal()} className="lg:col-span-5 lg:pr-16">
              <ChapterLabel number="01" text="Your university" />
              <h3 className="um-balanced mt-7 text-3xl font-bold leading-[1.06] tracking-[-0.022em] sm:text-4xl lg:text-[2.8rem]">
                Access with a reason behind it.
              </h3>
              <p className="mt-6 max-w-lg text-base leading-7 text-[#c8c2b7] sm:text-lg sm:leading-8">
                Student accounts verify an <strong>@uwaterloo.ca</strong> address before entering.
                It is a practical trust layer—not a badge added for decoration.
              </p>
            </motion.article>

            <motion.article
              {...reveal(0.08)}
              className="lg:col-span-7 lg:border-l lg:border-white/[0.08] lg:pl-16"
            >
              <ChapterLabel number="02" text="Your people" />
              <h3 className="um-balanced mt-7 max-w-2xl text-3xl font-bold leading-[1.06] tracking-[-0.022em] sm:text-4xl lg:text-[2.8rem]">
                Meet near the life you already share.
              </h3>
              <p className="mt-6 max-w-2xl text-base leading-7 text-[#c8c2b7] sm:text-lg sm:leading-8">
                Listings show broad pickup areas—campus, UWP, ICON, Lester, Columbia—without
                publishing an exact address. Agree on the precise place only when you are ready.
              </p>
              <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 border-y border-white/[0.08] py-4 text-xs font-semibold tracking-[0.04em] text-[#c4bdb2]/76">
                {['DC', 'SLC', 'UWP', 'ICON', 'Lester', 'Columbia'].map((place) => (
                  <span className="flex items-center gap-2" key={place}>
                    <span aria-hidden="true" className="size-1 rounded-full bg-um-gold-500" />
                    {place}
                  </span>
                ))}
              </div>
            </motion.article>
          </div>

          <div className="mt-20 grid items-center gap-12 sm:mt-24 lg:mt-28 lg:grid-cols-[minmax(0,1.18fr)_minmax(20rem,0.82fr)] lg:gap-20">
            <motion.figure
              {...reveal()}
              className="relative h-[31rem] overflow-hidden bg-um-surface-warm shadow-[0_24px_70px_rgba(5,7,11,0.14)] sm:h-[40rem] lg:h-[46rem]"
            >
              <motion.div
                className="absolute -inset-y-10 inset-x-0"
                style={{ y: reduceMotion ? 0 : roomImageY }}
              >
                <Image
                  alt="Dana Porter Library above autumn trees and Waterloo-yellow umbrellas"
                  className="object-cover object-center brightness-[0.78] saturate-[0.82] contrast-[1.08]"
                  fill
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  src="/waterloo/dp-library-autumn.webp"
                />
              </motion.div>
              <div aria-hidden="true" className="absolute inset-0 bg-um-ink-950/10" />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-um-ink-950/72 via-transparent to-um-ink-950/10"
              />
              <TermLifeFragment />
              <figcaption className="absolute left-5 top-5 font-condensed text-[0.64rem] font-bold uppercase tracking-[0.18em] text-[#eee9df]/72 sm:left-7 sm:top-7">
                Dana Porter / fall term
              </figcaption>
            </motion.figure>

            <motion.article {...reveal(0.08)}>
              <ChapterLabel number="03" text="Just for you" />
              <h3 className="um-balanced mt-7 text-3xl font-bold leading-[1.06] tracking-[-0.022em] sm:text-4xl lg:text-[2.8rem]">
                Made for the moment a term changes shape.
              </h3>
              <p className="mt-6 text-base leading-7 text-[#c8c2b7] sm:text-lg sm:leading-8">
                Co-op starts. A sublet ends. A course needs one specific book. UniMarket focuses on
                the things students genuinely pass on through move-in, move-out, class, and work
                terms.
              </p>

              <div className="mt-10 border-l-2 border-um-gold-500 pl-5 sm:pl-6">
                <div className="flex items-start gap-3">
                  <ShieldCheck
                    aria-hidden="true"
                    className="mt-0.5 size-5 shrink-0 text-um-gold-400"
                  />
                  <div>
                    <p className="font-bold">Public place. Inspect first.</p>
                    <p className="mt-1.5 text-sm leading-6 text-[#aaa398]">
                      Meet where campus is busy, check the item before paying, and share an exact
                      meetup point only after both sides agree.
                    </p>
                  </div>
                </div>
              </div>
            </motion.article>
          </div>

          <motion.div
            {...reveal()}
            className="mt-20 flex flex-col gap-4 border-t border-white/[0.08] pt-7 sm:mt-24 sm:flex-row sm:items-start sm:justify-between"
          >
            <p className="font-condensed text-xs font-bold uppercase tracking-[0.17em] text-um-gold-400">
              Waterloo context. Independent product.
            </p>
            <p className="max-w-2xl text-sm leading-6 text-[#958f85] sm:text-right">
              UniMarket is built around Waterloo student life but does not represent or imply
              endorsement by the University of Waterloo.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ChapterLabel({ number, text }: { number: string; text: string }) {
  return (
    <p className="font-condensed flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-um-gold-400">
      <span className="text-2xl tracking-[-0.02em]">{number}</span>
      <span aria-hidden="true" className="h-px w-8 bg-um-gold-600/40" />
      {text}
    </p>
  );
}

function AccessFragment() {
  return (
    <div className="absolute bottom-8 right-5 hidden w-[19rem] overflow-hidden border border-white/[0.09] bg-[#0b0d11]/94 text-[#e8e3da] shadow-[0_22px_65px_rgba(0,0,0,0.38)] backdrop-blur-sm sm:bottom-10 sm:right-8 md:block lg:bottom-12 lg:right-12">
      <div className="flex items-center justify-between border-b border-white/[0.08] px-5 py-3.5">
        <p className="font-condensed text-[0.62rem] font-bold uppercase tracking-[0.18em] text-[#a9a298]">
          Access checkpoint
        </p>
        <span className="size-1.5 rounded-full bg-um-success" aria-label="Verification active" />
      </div>
      <div className="p-5">
        <div className="flex items-center gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-um-ink-950 text-um-gold-300">
            <BadgeCheck aria-hidden="true" className="size-5" />
          </span>
          <div>
            <p className="text-sm font-bold">Waterloo email verified</p>
            <p className="mt-0.5 text-xs text-[#a9a298]">@uwaterloo.ca access</p>
          </div>
        </div>
        <div className="mt-5 flex items-start gap-2.5 border-t border-white/[0.08] pt-4">
          <MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-um-gold-400" />
          <div>
            <p className="text-xs font-bold">Broad pickup area</p>
            <p className="mt-1 text-[0.7rem] leading-5 text-[#a9a298]">
              Exact meetup details stay private until both students agree.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function TermLifeFragment() {
  return (
    <div className="absolute inset-x-5 bottom-5 bg-um-ink-950/92 p-5 text-[#ece8df] shadow-[0_20px_55px_rgba(0,0,0,0.28)] backdrop-blur-sm sm:inset-x-auto sm:bottom-7 sm:left-7 sm:w-[21rem] sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <p className="font-condensed text-[0.62rem] font-bold uppercase tracking-[0.18em] text-um-gold-300">
          Term-life context
        </p>
        <p className="font-mono text-[0.52rem] uppercase tracking-[0.12em] text-[#c4bdb1]/40">
          Interface example
        </p>
      </div>
      <p className="mt-5 font-editorial text-2xl leading-none tracking-[-0.035em]">
        Heading out for co-op?
      </p>
      <p className="mt-2 text-xs leading-5 text-[#c4bdb1]/56">
        Pass on what will not make the move. Add condition, photos, price, and a familiar pickup
        area.
      </p>
      <div className="font-condensed mt-5 flex items-center gap-3 border-t border-white/10 pt-4 text-[0.62rem] font-bold uppercase tracking-[0.14em] text-[#b6afa3]/50">
        <span>Photos</span>
        <span aria-hidden="true" className="text-um-gold-300">
          /
        </span>
        <span>Condition</span>
        <span aria-hidden="true" className="text-um-gold-300">
          /
        </span>
        <span>Pickup</span>
      </div>
    </div>
  );
}
