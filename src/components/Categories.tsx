'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

const categories = [
  {
    id: 'electronics',
    number: '01',
    title: 'Electronics',
    eyebrow: 'Class to co-op',
    description:
      'Monitors, keyboards, headphones, calculators, and the gear behind a working term.',
    href: '/marketplace?category=electronics',
    imagePosition: { x: '0%', y: '0%' },
  },
  {
    id: 'books',
    number: '02',
    title: 'Books',
    eyebrow: 'Learn it. Pass it on.',
    description:
      'Textbooks, course reads, study guides, and novels ready for the next set of notes.',
    href: '/marketplace?category=books',
    imagePosition: { x: '-0.8%', y: '0.5%' },
  },
  {
    id: 'household-items',
    number: '03',
    title: 'Household',
    eyebrow: 'The student place',
    description:
      'Lamps, kitchen basics, desks, chairs, and the small things that make a room work.',
    href: '/marketplace?category=household-items',
    imagePosition: { x: '-1.2%', y: '-0.5%' },
  },
  {
    id: 'clothing',
    number: '04',
    title: 'Clothing',
    eyebrow: 'Waterloo weather',
    description:
      'Jackets, shoes, layers, and everyday pieces with more than one term left in them.',
    href: '/marketplace?category=clothing',
    imagePosition: { x: '-0.4%', y: '-0.8%' },
  },
] as const;

type CategoryId = (typeof categories)[number]['id'];

export function Categories() {
  const [activeId, setActiveId] = useState<CategoryId>('electronics');
  const reduceMotion = useReducedMotion();
  const active = categories.find((category) => category.id === activeId) ?? categories[0];

  return (
    <section
      className="relative isolate scroll-mt-24 overflow-hidden bg-transparent px-4 pb-24 pt-20 text-[#ece8df] sm:px-6 sm:pb-28 sm:pt-24 lg:pb-36 lg:pt-32"
      id="categories"
    >
      <div className="relative mx-auto max-w-um-content">
        <header className="grid gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(19rem,0.75fr)] lg:items-end lg:gap-16">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.1em] text-um-gold-400">
              03 / What moves through campus
            </p>
            <h2 className="um-balanced mt-5 max-w-5xl text-[clamp(2.9rem,5.8vw,5.8rem)] font-bold leading-[0.98] tracking-[-0.028em]">
              Everything a term
              <span className="block font-editorial font-normal tracking-[-0.01em] text-[#c9c2b7]/72">
                leaves behind.
              </span>
            </h2>
          </div>

          <div className="border-t border-white/12 pt-6 lg:mb-2">
            <p className="max-w-lg text-base leading-7 text-[#d8d1c6]/78 sm:text-lg sm:leading-8">
              A deliberate starting point: useful things for class, co-op, and the place you live.
            </p>
            <Link
              className="group mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-um-gold-300 underline decoration-um-gold-500/65 underline-offset-4 transition-colors hover:text-um-gold-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-um-gold-400"
              href="/marketplace"
            >
              Browse what is available
              <ArrowRight
                aria-hidden="true"
                className="size-4 transition-transform duration-220 ease-um-out group-hover:translate-x-1"
              />
            </Link>
          </div>
        </header>

        <div className="relative mt-14 overflow-hidden rounded-[1.75rem] border border-white/[0.08] bg-um-ink-950 shadow-[0_42px_120px_rgba(0,0,0,0.46)] sm:mt-16 sm:rounded-[2.5rem] lg:min-h-[47rem]">
          <motion.div
            animate={
              reduceMotion
                ? undefined
                : {
                    scale: 1.035,
                    x: active.imagePosition.x,
                    y: active.imagePosition.y,
                  }
            }
            className="absolute inset-0"
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              alt="A restored aerial view of the University of Waterloo campus"
              className="object-cover object-center brightness-[0.58] saturate-[0.66] contrast-[1.08]"
              fill
              loading="eager"
              sizes="(max-width: 1024px) 100vw, 1320px"
              src="/waterloo/campus-aerial-restored.webp"
            />
          </motion.div>

          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,7,11,0.94)_0%,rgba(5,7,11,0.7)_39%,rgba(5,7,11,0.2)_68%,rgba(5,7,11,0.32)_100%),linear-gradient(0deg,rgba(5,7,11,0.8),transparent_48%)]"
          />

          <div className="relative grid min-h-[47rem] lg:grid-cols-[minmax(20rem,0.73fr)_minmax(24rem,0.67fr)] lg:justify-between">
            <div className="flex min-h-[27rem] flex-col justify-between p-6 sm:min-h-[31rem] sm:p-9 lg:min-h-full lg:p-12 xl:p-14">
              <div className="flex items-center gap-3">
                <span className="size-2 rounded-full bg-um-gold-400 shadow-[0_0_0_7px_rgba(231,188,53,0.1)]" />
                <p className="font-mono text-[0.58rem] font-semibold uppercase tracking-[0.17em] text-white/56">
                  Waterloo campus · restored archive view
                </p>
              </div>

              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="max-w-xl"
                initial={reduceMotion ? false : { opacity: 0.45, y: 8 }}
                key={active.id}
                transition={{ duration: reduceMotion ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="font-condensed text-xs font-bold uppercase tracking-[0.18em] text-um-gold-300">
                  {active.eyebrow}
                </p>
                <h3 className="mt-3 text-[clamp(2.5rem,4.7vw,4.9rem)] font-bold leading-[1.01] tracking-[-0.028em]">
                  {active.title}
                </h3>
                <p className="mt-5 max-w-md text-sm leading-7 text-white/78 sm:text-base">
                  {active.description}
                </p>
              </motion.div>
            </div>

            <nav
              aria-label="Marketplace categories"
              className="self-end border-t border-white/10 bg-um-ink-1000/76 p-3 backdrop-blur-xl sm:p-4 lg:m-6 lg:rounded-[1.5rem] lg:border lg:border-white/10 xl:m-8"
            >
              <ul>
                {categories.map((category) => {
                  const isActive = category.id === activeId;

                  return (
                    <li className="border-b border-white/[0.08] last:border-b-0" key={category.id}>
                      <Link
                        aria-current={isActive ? 'true' : undefined}
                        className={`group grid min-h-[4.6rem] grid-cols-[2.4rem_1fr_auto] items-center gap-3 rounded-xl px-3 py-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-um-gold-400 sm:min-h-[5.15rem] sm:px-4 ${
                          isActive
                            ? 'bg-um-gold-300 text-um-ink-950'
                            : 'text-[#ddd7cc] hover:bg-white/[0.06]'
                        }`}
                        href={category.href}
                        onFocus={() => setActiveId(category.id)}
                        onMouseEnter={() => setActiveId(category.id)}
                      >
                        <span
                          className={`font-mono text-[0.56rem] font-semibold tracking-[0.15em] ${
                            isActive ? 'text-um-ink-950/58' : 'text-[#bdb5a9]/38'
                          }`}
                        >
                          {category.number}
                        </span>
                        <span className="text-xl font-black tracking-[-0.035em] sm:text-2xl">
                          {category.title}
                        </span>
                        <ArrowUpRight
                          aria-hidden="true"
                          className={`size-5 transition-transform duration-220 ease-um-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 ${
                            isActive ? 'text-um-ink-950/72' : 'text-[#bdb5a9]/45'
                          }`}
                        />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        </div>

        <div className="mt-8 grid gap-4 border-t border-white/10 pt-6 text-xs leading-5 text-white/62 sm:grid-cols-[1fr_auto] sm:items-start">
          <p className="max-w-2xl">
            The photograph is an original Waterloo-inspired scene. It represents the kinds of items
            UniMarket supports; live inventory only appears when verified students publish it.
          </p>
          <p className="font-mono uppercase tracking-[0.14em] sm:text-right">
            Before class · Before co-op
            <span className="block">Move-in · Move-out</span>
          </p>
        </div>
      </div>
    </section>
  );
}
