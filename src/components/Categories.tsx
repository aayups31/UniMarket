import { Armchair, ArrowUpRight, BookOpen, Laptop, Shirt } from 'lucide-react';
import Link from 'next/link';

const categories = [
  {
    name: 'Electronics',
    slug: 'electronics',
    description: 'Monitors, keyboards, headphones, tablets, and co-op setups.',
    icon: Laptop,
  },
  {
    name: 'Books',
    slug: 'books',
    description: 'Textbooks, course reads, study guides, and novels.',
    icon: BookOpen,
  },
  {
    name: 'Household',
    slug: 'household-items',
    description: 'Desks, lamps, kitchen basics, and things for a student place.',
    icon: Armchair,
  },
  {
    name: 'Clothing',
    slug: 'clothing',
    description: 'Jackets, hoodies, shoes, accessories, and everyday layers.',
    icon: Shirt,
  },
];

export function Categories() {
  return (
    <section
      className="scroll-mt-24 bg-um-canvas-soft px-4 py-20 sm:px-6 sm:py-24 lg:py-32"
      id="categories"
    >
      <div className="mx-auto max-w-um-content">
        <div className="grid gap-12 lg:grid-cols-[minmax(18rem,0.68fr)_minmax(0,1.32fr)] lg:gap-16">
          <div>
            <p className="font-condensed text-sm font-bold uppercase tracking-[0.15em] text-um-gold-700">
              Starting categories
            </p>
            <h2 className="um-balanced mt-4 text-4xl font-black leading-[0.98] tracking-[-0.055em] sm:text-5xl">
              Built around campus life.
            </h2>
            <p className="mt-6 max-w-md text-base leading-7 text-um-text-muted">
              UniMarket starts deliberately small: useful categories that cover class, co-op, and
              the place you live.
            </p>

            <div className="mt-9 border-y border-black/10 py-5">
              <p className="font-condensed text-xs font-bold uppercase tracking-[0.14em] text-um-text-muted">
                The Waterloo rhythm
              </p>
              <p className="mt-3 font-mono text-[0.66rem] font-semibold uppercase leading-6 tracking-[0.13em] text-um-text">
                Before class · Before co-op
                <span className="block">Before move-in · Before move-out</span>
              </p>
            </div>
          </div>

          <div>
            <div className="grid gap-px border border-black/10 bg-black/10 sm:grid-cols-2">
              {categories.map(({ description, icon: Icon, name, slug }) => (
                <Link
                  className="group min-h-52 bg-um-surface p-6 transition-colors hover:bg-um-surface-warm focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-um-gold-600 sm:p-7"
                  href={`/marketplace?category=${slug}`}
                  key={slug}
                >
                  <div className="flex items-start justify-between gap-4">
                    <Icon
                      aria-hidden="true"
                      className="size-6 text-um-text-muted transition-colors group-hover:text-um-gold-700"
                      strokeWidth={1.8}
                    />
                    <ArrowUpRight
                      aria-hidden="true"
                      className="size-4 text-um-text-muted transition-transform duration-160 ease-um-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </div>
                  <h3 className="mt-9 text-2xl font-black tracking-[-0.035em]">{name}</h3>
                  <p className="mt-3 max-w-sm text-sm leading-6 text-um-text-muted">
                    {description}
                  </p>
                </Link>
              ))}
            </div>

            <Link
              className="mt-6 inline-flex min-h-11 items-center text-sm font-bold text-um-text-strong underline decoration-um-gold-600 decoration-2 underline-offset-4 transition-colors hover:text-um-gold-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-um-gold-600"
              href="/marketplace"
            >
              Browse the marketplace
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
