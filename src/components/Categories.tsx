'use client';

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
    description: 'Monitors, calculators, and the gear behind a working term.',
    href: '/marketplace?category=electronics',
    image: '/waterloo/category-electronics-campus-upscaled.webp',
    imagePosition: 'center center',
    imageTransform: 'translate3d(0, 0, 0) scale(1.025)',
  },
  {
    id: 'books',
    number: '02',
    title: 'Books',
    eyebrow: 'Learn it. Pass it on.',
    description: 'Textbooks and course reads ready for the next set of notes.',
    href: '/marketplace?category=books',
    image: '/waterloo/category-books-waterloo-city-upscaled.webp',
    imagePosition: 'center 46%',
    imageTransform: 'translate3d(-0.4%, -0.5%, 0) scale(1.04)',
  },
  {
    id: 'household-items',
    number: '03',
    title: 'Household',
    eyebrow: 'The student place',
    description: 'The essentials that make a student room work.',
    href: '/marketplace?category=household-items',
    image: '/waterloo/category-household-board-upscaled.webp',
    imagePosition: '54% center',
    imageTransform: 'translate3d(-0.35%, 0, 0) scale(1.035)',
  },
  {
    id: 'clothing',
    number: '04',
    title: 'Clothing',
    eyebrow: 'Waterloo weather',
    description: 'Waterloo layers with more than one term left in them.',
    href: '/marketplace?category=clothing',
    image: '/waterloo/category-clothing-dp-library-upscaled.webp',
    imagePosition: 'center center',
    imageTransform: 'translate3d(0, -0.35%, 0) scale(1.035)',
  },
] as const;

type CategoryId = (typeof categories)[number]['id'];

export function Categories() {
  const [activeId, setActiveId] = useState<CategoryId>('electronics');
  const active = categories.find((category) => category.id === activeId) ?? categories[0];

  return (
    <section
      className="relative isolate scroll-mt-24 overflow-hidden bg-transparent px-4 pb-24 pt-20 text-[#ece8df] sm:px-6 sm:pb-28 sm:pt-24 lg:pb-36 lg:pt-32"
      id="categories"
    >
      <div className="relative mx-auto max-w-um-content">
        <header className="grid gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(19rem,0.75fr)] lg:items-end lg:gap-16">
          <div>
            <p className="font-condensed text-xs font-bold uppercase tracking-[0.18em] text-um-gold-400">
              Marketplace categories
            </p>
            <h2 className="um-balanced mt-5 max-w-5xl text-[clamp(2.9rem,5.8vw,5.8rem)] font-bold leading-[0.98] tracking-[-0.028em]">
              What Waterloo
              <span className="block font-editorial font-normal tracking-[-0.01em] text-um-gold-300">
                passes on.
              </span>
            </h2>
          </div>

          <div className="border-t border-white/12 pt-6 lg:mb-2">
            <p className="max-w-lg text-base leading-7 text-[#d8d1c6]/78 sm:text-lg sm:leading-8">
              Useful things for class, co-op, and home.
            </p>
            <Link
              className="group mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-um-gold-300 underline decoration-um-gold-500/65 underline-offset-4 transition-colors hover:text-um-gold-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-um-gold-400"
              href="/marketplace"
            >
              Browse everything
              <ArrowRight
                aria-hidden="true"
                className="size-4 transition-transform duration-220 ease-um-out group-hover:translate-x-1"
              />
            </Link>
          </div>
        </header>

        <div className="relative mt-14 min-h-[48rem] overflow-hidden rounded-[1.75rem] border border-white/[0.09] bg-um-ink-950 shadow-[0_46px_130px_rgba(0,0,0,0.5)] sm:mt-16 sm:rounded-[2.75rem] lg:min-h-[52rem]">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
            {categories.map((category) => {
              const isActive = category.id === activeId;

              return (
                <div
                  className={`um-category-image absolute left-[-3%] top-[-3%] h-[106%] w-[106%] ${
                    isActive ? 'um-category-image--active' : ''
                  }`}
                  data-category-image={category.id}
                  key={category.id}
                  style={{ transform: category.imageTransform }}
                >
                  <Image
                    alt=""
                    className="object-cover brightness-[0.64] saturate-[0.8] contrast-[1.08]"
                    fill
                    quality={90}
                    sizes="(max-width: 1024px) 100vw, 1320px"
                    src={category.image}
                    style={{ objectPosition: category.imagePosition }}
                  />
                </div>
              );
            })}
          </div>

          <div
            aria-hidden="true"
            className="absolute inset-0 z-[1] bg-[linear-gradient(90deg,rgba(5,7,11,0.94)_0%,rgba(5,7,11,0.72)_40%,rgba(5,7,11,0.22)_68%,rgba(5,7,11,0.48)_100%),linear-gradient(0deg,rgba(5,7,11,0.92)_0%,transparent_56%,rgba(5,7,11,0.32)_100%)]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 z-[1] bg-[radial-gradient(circle_at_72%_28%,rgba(242,213,111,0.11),transparent_28%)]"
          />

          <div className="relative z-[2] grid min-h-[48rem] lg:min-h-[52rem] lg:grid-cols-[minmax(0,1fr)_minmax(27rem,0.66fr)]">
            <div className="flex min-h-[29rem] flex-col justify-between p-6 sm:min-h-[34rem] sm:p-10 lg:min-h-full lg:p-14 xl:p-16">
              <div className="flex items-center gap-3">
                <span className="size-2 rounded-full bg-um-gold-300 shadow-[0_0_0_7px_rgba(231,188,53,0.1)]" />
                <p className="font-mono text-[0.56rem] font-semibold uppercase tracking-[0.18em] text-white/58">
                  Waterloo campus / marketplace index
                </p>
              </div>

              <div className="um-category-copy max-w-[39rem]" key={active.id}>
                <p className="font-condensed text-xs font-bold uppercase tracking-[0.19em] text-um-gold-300">
                  {active.eyebrow}
                </p>
                <h3 className="mt-3 text-[clamp(3.5rem,7.4vw,7.8rem)] font-bold leading-[0.86] tracking-[-0.055em] text-[#f0ebe2]">
                  {active.title}
                </h3>
                <div className="mt-7 flex max-w-lg items-start gap-5 border-t border-white/[0.16] pt-5">
                  <span className="font-mono text-[0.57rem] font-semibold tracking-[0.17em] text-um-gold-300/72">
                    {active.number} / 04
                  </span>
                  <p className="max-w-sm text-sm leading-6 text-white/66 sm:text-base sm:leading-7">
                    {active.description}
                  </p>
                </div>
              </div>
            </div>

            <nav
              aria-label="Marketplace categories"
              className="self-end border-t border-white/[0.12] bg-[linear-gradient(180deg,rgba(6,9,13,0.32),rgba(6,9,13,0.9))] lg:min-h-full lg:self-stretch lg:border-l lg:border-t-0 lg:bg-[linear-gradient(90deg,rgba(6,9,13,0.38),rgba(6,9,13,0.82))]"
            >
              <ul className="flex h-full flex-col">
                {categories.map((category) => {
                  const isActive = category.id === activeId;

                  return (
                    <li
                      className="relative flex-1 border-b border-white/[0.1] last:border-b-0"
                      key={category.id}
                    >
                      <Link
                        aria-current={isActive ? 'true' : undefined}
                        className={`group relative grid h-full min-h-[5.5rem] grid-cols-[2.5rem_1fr_auto] items-center gap-3 overflow-hidden px-5 py-5 transition-colors duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-um-gold-400 sm:min-h-[6.25rem] sm:px-7 lg:min-h-0 lg:px-9 xl:px-11 ${
                          isActive
                            ? 'text-[#f3eee4]'
                            : 'text-[#d2cbc0]/58 hover:bg-white/[0.035] hover:text-[#eee8de]'
                        }`}
                        href={category.href}
                        onFocus={() => setActiveId(category.id)}
                        onMouseEnter={() => setActiveId(category.id)}
                      >
                        <span
                          aria-hidden="true"
                          className={`absolute inset-y-[22%] left-0 w-px origin-center bg-um-gold-300 transition-transform duration-500 ease-um-out ${
                            isActive ? 'scale-y-100' : 'scale-y-0'
                          }`}
                        />
                        <span
                          className={`font-mono text-[0.55rem] font-semibold tracking-[0.16em] transition-colors duration-500 ${
                            isActive ? 'text-um-gold-300' : 'text-white/24'
                          }`}
                        >
                          {category.number}
                        </span>
                        <span className="text-[clamp(1.35rem,2.2vw,2.25rem)] font-black tracking-[-0.04em]">
                          {category.title}
                        </span>
                        <span
                          className={`grid size-10 place-items-center rounded-full border transition-[border-color,background-color,color,transform] duration-500 ease-um-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 ${
                            isActive
                              ? 'border-um-gold-300/45 bg-um-gold-300 text-um-ink-950'
                              : 'border-white/10 text-white/35'
                          }`}
                        >
                          <ArrowUpRight aria-hidden="true" className="size-4" />
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </section>
  );
}
