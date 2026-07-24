import type { Metadata } from 'next';
import { ArrowRight, BadgeCheck, BookOpen, MapPin, Search } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { JsonLd } from '@/features/seo/components/JsonLd';
import {
  SEARCH_CATEGORIES,
  categoryHref,
  getItemsForCategory,
  itemHref,
} from '@/features/seo/search-targets';
import { absoluteUrl, SITE_URL } from '@/lib/site';

const title = 'University of Waterloo Student Marketplace';
const description =
  'Explore UniMarket Waterloo for used textbooks, electronics, clothing, and household essentials from verified University of Waterloo students.';

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: '/waterloo-marketplace',
  },
  openGraph: {
    title: `${title} | UniMarket`,
    description,
    url: '/waterloo-marketplace',
  },
};

const faqItems = [
  {
    question: 'What is UniMarket Waterloo?',
    answer:
      'UniMarket is an independent student-built marketplace for the University of Waterloo community. Verified students can browse, list, and message inside the private marketplace.',
  },
  {
    question: 'What can students search for?',
    answer:
      'Common searches include used textbooks, monitors, calculators, laptops, desks, chairs, kitchenware, winter jackets, and co-op clothing.',
  },
  {
    question: 'Is UniMarket affiliated with the University of Waterloo?',
    answer:
      'No. UniMarket is an independent project and is not affiliated with or endorsed by the University of Waterloo.',
  },
] as const;

export default function WaterlooMarketplacePage() {
  return (
    <>
      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            '@id': `${absoluteUrl('/waterloo-marketplace')}#page`,
            url: absoluteUrl('/waterloo-marketplace'),
            name: title,
            description,
            isPartOf: {
              '@id': `${SITE_URL}/#website`,
            },
            about: [
              'University of Waterloo',
              'student marketplace',
              'used textbooks',
              'used electronics',
              'student furniture',
            ],
            mainEntity: {
              '@type': 'ItemList',
              itemListElement: SEARCH_CATEGORIES.map((category, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                name: category.name,
                url: absoluteUrl(categoryHref(category.slug)),
              })),
            },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'UniMarket',
                item: SITE_URL,
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'Waterloo student marketplace',
                item: absoluteUrl('/waterloo-marketplace'),
              },
            ],
          },
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqItems.map((item) => ({
              '@type': 'Question',
              name: item.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: item.answer,
              },
            })),
          },
        ]}
      />

      <section className="relative isolate overflow-hidden border-b border-white/[0.08]">
        <Image
          alt=""
          className="-z-30 object-cover object-[50%_48%] opacity-40"
          fill
          priority
          quality={90}
          sizes="100vw"
          src="/waterloo/campus-aerial-restored.webp"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,#070a0f_0%,rgba(7,10,15,0.88)_42%,rgba(7,10,15,0.46)_100%),linear-gradient(0deg,#070a0f_0%,transparent_68%)]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_72%_24%,rgba(242,213,111,0.18),transparent_25rem)]"
        />

        <div className="mx-auto max-w-um-content px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
          <div className="max-w-5xl">
            <p className="font-condensed text-[0.68rem] font-bold uppercase tracking-[0.2em] text-um-gold-300">
              University of Waterloo marketplace
            </p>
            <h1 className="mt-6 text-[clamp(3.5rem,8.4vw,8.2rem)] font-black leading-[0.88] tracking-[-0.065em] text-[#f5f0e7]">
              Find it around
              <span className="block text-um-gold-300">Waterloo.</span>
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-white/64 sm:text-xl">
              Used textbooks, electronics, clothing, and home essentials—organized for the Waterloo
              student community.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                className="group inline-flex min-h-[3.25rem] items-center gap-3 rounded-full bg-um-gold-300 px-6 text-sm font-black text-um-ink-950 transition hover:bg-um-gold-200 focus-visible:ring-2 focus-visible:ring-white"
                href="/login?next=%2Fmarketplace"
                prefetch={false}
              >
                <Search aria-hidden="true" className="size-4" />
                Search live listings
                <ArrowRight
                  aria-hidden="true"
                  className="size-4 transition-transform group-hover:translate-x-0.5"
                />
              </Link>
              <Link
                className="inline-flex min-h-[3.25rem] items-center rounded-full border border-white/16 bg-black/20 px-6 text-sm font-bold text-white/76 backdrop-blur transition hover:border-white/28 hover:text-white focus-visible:ring-2 focus-visible:ring-um-gold-300"
                href="/signup"
              >
                Join with Waterloo
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-um-content px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[0.7fr_1.3fr] lg:gap-14">
          <div>
            <p className="font-condensed text-[0.67rem] font-bold uppercase tracking-[0.18em] text-um-gold-300">
              Browse the exchange
            </p>
            <h2 className="mt-4 max-w-md text-4xl font-black leading-[0.98] tracking-[-0.05em] text-[#f3eee5] sm:text-5xl">
              Start with what you need.
            </h2>
            <p className="mt-5 max-w-md leading-7 text-white/52">
              Every category leads into the private, verified marketplace when you are ready to
              browse or message a seller.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {SEARCH_CATEGORIES.map((category) => (
              <Link
                className="group relative min-h-72 overflow-hidden rounded-[1.3rem] border border-white/[0.1] bg-[#0d131c] focus-visible:ring-2 focus-visible:ring-um-gold-300"
                href={categoryHref(category.slug)}
                key={category.slug}
              >
                <Image
                  alt=""
                  className="object-cover opacity-52 saturate-[0.82] transition duration-700 ease-um-out group-hover:scale-[1.025] group-hover:opacity-62"
                  fill
                  quality={90}
                  sizes="(max-width: 640px) 100vw, 40vw"
                  src={category.image}
                  style={{ objectPosition: category.imagePosition }}
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-[linear-gradient(0deg,rgba(5,7,11,0.96),rgba(5,7,11,0.1)_72%)]"
                />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6">
                  <div>
                    <h3 className="text-2xl font-black tracking-[-0.04em] text-white">
                      {category.name}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/54">
                      {category.description}
                    </p>
                  </div>
                  <ArrowRight
                    aria-hidden="true"
                    className="mb-1 size-5 shrink-0 text-um-gold-300 transition-transform group-hover:translate-x-1"
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-white/[0.08] bg-[#0a0f17]">
        <div className="mx-auto max-w-um-content px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="font-condensed text-[0.67rem] font-bold uppercase tracking-[0.18em] text-um-gold-300">
                Popular item searches
              </p>
              <h2 className="mt-4 text-4xl font-black tracking-[-0.05em] text-white sm:text-5xl">
                Search like a student.
              </h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-white/46">
              From a missing laptop charger to a complete co-op setup, these guides take you to the
              right part of UniMarket.
            </p>
          </div>

          <div className="mt-12 space-y-12">
            {SEARCH_CATEGORIES.map((category) => (
              <section aria-labelledby={`${category.slug}-searches`} key={category.slug}>
                <div className="flex items-center gap-4 border-b border-white/[0.09] pb-4">
                  <h3
                    className="text-xl font-black tracking-[-0.03em] text-white"
                    id={`${category.slug}-searches`}
                  >
                    {category.name}
                  </h3>
                  <span className="font-mono text-[0.56rem] uppercase tracking-[0.16em] text-white/28">
                    {getItemsForCategory(category.slug).length} searches
                  </span>
                </div>
                <ul className="mt-3 grid sm:grid-cols-2 lg:grid-cols-4">
                  {getItemsForCategory(category.slug).map((item) => (
                    <li className="border-b border-white/[0.07]" key={item.slug}>
                      <Link
                        className="group flex min-h-14 items-center justify-between gap-3 py-3 pr-4 text-sm font-semibold text-white/58 transition hover:text-white"
                        href={itemHref(item.slug)}
                      >
                        {item.name}
                        <ArrowRight
                          aria-hidden="true"
                          className="size-3.5 text-um-gold-300/60 transition-transform group-hover:translate-x-0.5"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-um-content gap-12 px-4 py-20 sm:px-6 sm:py-24 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
        <div>
          <p className="font-condensed text-[0.67rem] font-bold uppercase tracking-[0.18em] text-um-gold-300">
            Made for one campus
          </p>
          <h2 className="mt-4 text-4xl font-black leading-tight tracking-[-0.05em] text-white sm:text-5xl">
            Local by design.
          </h2>
          <div className="mt-7 space-y-4 text-sm leading-7 text-white/52">
            <p className="flex gap-3">
              <BadgeCheck aria-hidden="true" className="mt-1 size-4 shrink-0 text-um-gold-300" />
              Browsing, listing, profiles, and messaging are reserved for verified student access.
            </p>
            <p className="flex gap-3">
              <MapPin aria-hidden="true" className="mt-1 size-4 shrink-0 text-um-gold-300" />
              Listings are organized around the Waterloo community and nearby exchange.
            </p>
            <p className="flex gap-3">
              <BookOpen aria-hidden="true" className="mt-1 size-4 shrink-0 text-um-gold-300" />
              Search pages help people find the right category without exposing seller information.
            </p>
          </div>
        </div>

        <div className="divide-y divide-white/[0.09] border-y border-white/[0.09]">
          {faqItems.map((item) => (
            <section className="py-6" key={item.question}>
              <h3 className="text-lg font-black tracking-[-0.025em] text-white">{item.question}</h3>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-white/52">{item.answer}</p>
            </section>
          ))}
        </div>
      </section>
    </>
  );
}
