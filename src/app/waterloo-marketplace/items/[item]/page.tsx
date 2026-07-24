import type { Metadata } from 'next';
import { ArrowLeft, ArrowRight, BadgeCheck, Search, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { JsonLd } from '@/features/seo/components/JsonLd';
import {
  ITEM_SEARCH_TARGETS,
  categoryHref,
  getItemSearchTarget,
  getItemsForCategory,
  getSearchCategory,
  itemHref,
} from '@/features/seo/search-targets';
import { absoluteUrl, SITE_URL } from '@/lib/site';

type ItemPageProps = {
  params: Promise<{ item: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return ITEM_SEARCH_TARGETS.map((item) => ({ item: item.slug }));
}

export async function generateMetadata({ params }: ItemPageProps): Promise<Metadata> {
  const { item: itemSlug } = await params;
  const item = getItemSearchTarget(itemSlug);
  if (!item) return {};

  const canonical = itemHref(item.slug);

  return {
    title: item.title,
    description: item.description,
    alternates: {
      canonical,
    },
    openGraph: {
      title: `${item.title} | UniMarket`,
      description: item.description,
      url: canonical,
    },
  };
}

export default async function ItemSearchPage({ params }: ItemPageProps) {
  const { item: itemSlug } = await params;
  const item = getItemSearchTarget(itemSlug);
  if (!item) notFound();

  const category = getSearchCategory(item.category);
  if (!category) notFound();

  const canonical = itemHref(item.slug);
  const relatedItems = getItemsForCategory(category.slug)
    .filter((related) => related.slug !== item.slug)
    .slice(0, 4);

  return (
    <>
      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            '@id': `${absoluteUrl(canonical)}#page`,
            url: absoluteUrl(canonical),
            name: item.title,
            description: item.description,
            isPartOf: {
              '@id': `${SITE_URL}/#website`,
            },
            about: [item.name, category.name, 'University of Waterloo', 'student marketplace'],
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
              {
                '@type': 'ListItem',
                position: 3,
                name: category.name,
                item: absoluteUrl(categoryHref(category.slug)),
              },
              {
                '@type': 'ListItem',
                position: 4,
                name: item.name,
                item: absoluteUrl(canonical),
              },
            ],
          },
        ]}
      />

      <section className="relative isolate overflow-hidden border-b border-white/[0.08]">
        <Image
          alt=""
          className="-z-30 object-cover opacity-32 blur-[1px]"
          fill
          priority
          quality={90}
          sizes="100vw"
          src={category.image}
          style={{ objectPosition: category.imagePosition }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,#070a0f_0%,rgba(7,10,15,0.88)_54%,rgba(7,10,15,0.64)),linear-gradient(0deg,#070a0f_0%,transparent_72%)]"
        />
        <div className="mx-auto max-w-um-content px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <Link
            className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-white/52 transition hover:text-white"
            href={categoryHref(category.slug)}
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            {category.name}
          </Link>
          <p className="mt-10 font-condensed text-[0.67rem] font-bold uppercase tracking-[0.19em] text-um-gold-300">
            UniMarket Waterloo · {category.shortName}
          </p>
          <h1 className="mt-4 max-w-5xl text-[clamp(3rem,7vw,6.8rem)] font-black leading-[0.93] tracking-[-0.06em] text-white">
            {item.title}
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-white/62">{item.description}</p>
          <Link
            className="group mt-8 inline-flex min-h-12 items-center gap-3 rounded-full bg-um-gold-300 px-6 text-sm font-black text-um-ink-950 transition hover:bg-um-gold-200"
            href={`/login?next=${encodeURIComponent(`/marketplace?q=${item.query}`)}`}
            prefetch={false}
          >
            <Search aria-hidden="true" className="size-4" />
            Search {item.name.toLowerCase()}
            <ArrowRight
              aria-hidden="true"
              className="size-4 transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-um-content gap-12 px-4 py-20 sm:px-6 sm:py-24 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20 lg:px-8">
        <article>
          <p className="font-condensed text-[0.67rem] font-bold uppercase tracking-[0.18em] text-um-gold-300">
            Buying near campus
          </p>
          <h2 className="mt-4 text-4xl font-black leading-tight tracking-[-0.05em] text-white sm:text-5xl">
            Know what to look for.
          </h2>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-white/56">{item.summary}</p>

          <div className="mt-10 border-y border-white/[0.09] py-6">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-white/34">
              Common matches
            </p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {item.examples.map((example) => (
                <li
                  className="rounded-full border border-white/[0.1] bg-white/[0.035] px-4 py-2 text-sm text-white/58"
                  key={example}
                >
                  {example}
                </li>
              ))}
            </ul>
          </div>
        </article>

        <aside className="rounded-[1.35rem] border border-white/[0.1] bg-[#0b1119] p-6 sm:p-8">
          <p className="font-condensed text-[0.65rem] font-bold uppercase tracking-[0.17em] text-um-gold-300">
            Before meeting
          </p>
          <ol className="mt-5 space-y-5">
            {category.checklist.map((check, index) => (
              <li className="grid grid-cols-[1.7rem_1fr] gap-3" key={check}>
                <span className="font-mono text-[0.62rem] font-bold text-um-gold-300">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <p className="text-sm leading-6 text-white/54">{check}</p>
              </li>
            ))}
          </ol>
          <div className="mt-8 space-y-3 border-t border-white/[0.09] pt-6 text-sm leading-6 text-white/48">
            <p className="flex gap-3">
              <BadgeCheck aria-hidden="true" className="mt-1 size-4 shrink-0 text-um-gold-300" />
              Sign in with verified access before messaging a seller.
            </p>
            <p className="flex gap-3">
              <ShieldCheck aria-hidden="true" className="mt-1 size-4 shrink-0 text-um-gold-300" />
              Inspect the item and meet somewhere appropriate before exchanging.
            </p>
          </div>
        </aside>
      </section>

      <section className="border-t border-white/[0.08] bg-[#0a0f17]">
        <div className="mx-auto max-w-um-content px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="font-condensed text-[0.65rem] font-bold uppercase tracking-[0.17em] text-um-gold-300">
                More in {category.shortName}
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-[-0.045em] text-white">
                Related searches
              </h2>
            </div>
            <Link
              className="hidden text-sm font-bold text-white/52 transition hover:text-white sm:inline-flex"
              href={categoryHref(category.slug)}
            >
              View category
            </Link>
          </div>
          <ul className="mt-8 grid gap-px overflow-hidden rounded-[1rem] border border-white/[0.09] bg-white/[0.09] sm:grid-cols-2 lg:grid-cols-4">
            {relatedItems.map((related) => (
              <li className="bg-[#080d14]" key={related.slug}>
                <Link
                  className="group flex min-h-24 items-center justify-between gap-4 p-5 font-bold text-white/62 transition hover:bg-white/[0.035] hover:text-white"
                  href={itemHref(related.slug)}
                >
                  {related.name}
                  <ArrowRight
                    aria-hidden="true"
                    className="size-4 shrink-0 text-um-gold-300 transition-transform group-hover:translate-x-0.5"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
