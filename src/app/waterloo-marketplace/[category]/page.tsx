import type { Metadata } from 'next';
import { ArrowLeft, ArrowRight, Search } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { JsonLd } from '@/features/seo/components/JsonLd';
import {
  SEARCH_CATEGORIES,
  categoryHref,
  getItemsForCategory,
  getSearchCategory,
  itemHref,
} from '@/features/seo/search-targets';
import { absoluteUrl, SITE_URL } from '@/lib/site';

type CategoryPageProps = {
  params: Promise<{ category: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return SEARCH_CATEGORIES.map((category) => ({ category: category.slug }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const category = getSearchCategory(categorySlug);
  if (!category) return {};

  const title = `${category.name} near the University of Waterloo`;
  const canonical = categoryHref(category.slug);

  return {
    title,
    description: category.description,
    alternates: {
      canonical,
    },
    openGraph: {
      title: `${title} | UniMarket`,
      description: category.description,
      url: canonical,
      images: [
        {
          url: category.image,
          alt: `${category.name} in the Waterloo student marketplace`,
        },
      ],
    },
  };
}

export default async function CategorySearchPage({ params }: CategoryPageProps) {
  const { category: categorySlug } = await params;
  const category = getSearchCategory(categorySlug);
  if (!category) notFound();

  const items = getItemsForCategory(category.slug);
  const canonical = categoryHref(category.slug);

  return (
    <>
      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            '@id': `${absoluteUrl(canonical)}#page`,
            url: absoluteUrl(canonical),
            name: `${category.name} near the University of Waterloo`,
            description: category.description,
            isPartOf: {
              '@id': `${SITE_URL}/#website`,
            },
            about: [category.name, 'University of Waterloo', 'student marketplace'],
            mainEntity: {
              '@type': 'ItemList',
              itemListElement: items.map((item, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                name: item.name,
                url: absoluteUrl(itemHref(item.slug)),
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
              {
                '@type': 'ListItem',
                position: 3,
                name: category.name,
                item: absoluteUrl(canonical),
              },
            ],
          },
        ]}
      />

      <section className="relative isolate overflow-hidden border-b border-white/[0.08]">
        <Image
          alt=""
          className="-z-30 object-cover opacity-42"
          fill
          priority
          quality={90}
          sizes="100vw"
          src={category.image}
          style={{ objectPosition: category.imagePosition }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,#070a0f_0%,rgba(7,10,15,0.86)_55%,rgba(7,10,15,0.46)),linear-gradient(0deg,#070a0f_0%,transparent_72%)]"
        />

        <div className="mx-auto max-w-um-content px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <Link
            className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-white/52 transition hover:text-white"
            href="/waterloo-marketplace"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            Waterloo marketplace
          </Link>
          <p className="mt-10 font-condensed text-[0.67rem] font-bold uppercase tracking-[0.19em] text-um-gold-300">
            University of Waterloo · {category.shortName}
          </p>
          <h1 className="mt-4 max-w-5xl text-[clamp(3.4rem,7.5vw,7.5rem)] font-black leading-[0.9] tracking-[-0.06em] text-white">
            {category.name}
            <span className="block text-white/42">around Waterloo.</span>
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-white/62">{category.introduction}</p>
          <Link
            className="group mt-8 inline-flex min-h-12 items-center gap-3 rounded-full bg-um-gold-300 px-6 text-sm font-black text-um-ink-950 transition hover:bg-um-gold-200"
            href={`/login?next=${encodeURIComponent(`/marketplace?category=${category.slug}`)}`}
            prefetch={false}
          >
            <Search aria-hidden="true" className="size-4" />
            Search live {category.shortName.toLowerCase()}
            <ArrowRight
              aria-hidden="true"
              className="size-4 transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-um-content px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.64fr_1.36fr] lg:gap-16">
          <div>
            <p className="font-condensed text-[0.67rem] font-bold uppercase tracking-[0.18em] text-um-gold-300">
              Find the right item
            </p>
            <h2 className="mt-4 text-4xl font-black leading-tight tracking-[-0.05em] text-white">
              Popular {category.shortName.toLowerCase()} searches.
            </h2>
            <p className="mt-5 leading-7 text-white/50">{category.description}</p>
          </div>

          <ul className="grid gap-px overflow-hidden rounded-[1.25rem] border border-white/[0.09] bg-white/[0.09] sm:grid-cols-2">
            {items.map((item) => (
              <li className="bg-[#0a0f17]" key={item.slug}>
                <Link
                  className="group flex min-h-36 flex-col justify-between gap-5 p-6 transition hover:bg-white/[0.035]"
                  href={itemHref(item.slug)}
                >
                  <h3 className="text-xl font-black tracking-[-0.035em] text-white">{item.name}</h3>
                  <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.11em] text-um-gold-300">
                    Explore
                    <ArrowRight
                      aria-hidden="true"
                      className="size-3.5 transition-transform group-hover:translate-x-1"
                    />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-white/[0.08] bg-[#0a0f17]">
        <div className="mx-auto grid max-w-um-content gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[0.7fr_1.3fr] lg:px-8">
          <div>
            <p className="font-condensed text-[0.67rem] font-bold uppercase tracking-[0.18em] text-um-gold-300">
              Before you exchange
            </p>
            <h2 className="mt-4 text-3xl font-black tracking-[-0.045em] text-white">
              Check the details.
            </h2>
          </div>
          <ol className="divide-y divide-white/[0.09] border-y border-white/[0.09]">
            {category.checklist.map((check, index) => (
              <li className="grid grid-cols-[2rem_1fr] gap-4 py-5" key={check}>
                <span className="font-mono text-[0.62rem] font-bold text-um-gold-300">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <p className="text-sm leading-7 text-white/56">{check}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
