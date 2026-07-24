import Link from 'next/link';

import { BrandMark } from '@/components/BrandMark';

const productLinks = [
  { href: '/waterloo-marketplace', label: 'Waterloo marketplace' },
  { href: '/marketplace', label: 'Search live listings' },
  { href: '/listings/new', label: 'Create a listing' },
  { href: '#how-it-works', label: 'How it works' },
  { href: '#categories', label: 'Categories' },
];

const accessLinks = [
  { href: '/signup', label: 'Create account' },
  { href: '/marketplace', label: 'Sign in' },
  { href: '/forgot-password', label: 'Recover password' },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/[0.06] bg-black/20 px-4 pb-8 pt-14 text-[#ece8df] sm:px-6 sm:pt-16">
      <div className="mx-auto max-w-um-content">
        <div className="relative grid gap-12 border-b border-white/[0.07] pb-12 md:grid-cols-[1.4fr_0.7fr_0.7fr] lg:gap-16">
          <div>
            <BrandMark tone="light" />
            <p className="mt-6 max-w-lg text-sm leading-7 text-[#d6cfc4]/72">
              A private marketplace for verified Waterloo students, designed around class, co-op,
              moves, and nearby pickup.
            </p>
            <p className="mt-5 max-w-lg border-l border-um-gold-500/50 pl-4 text-xs leading-5 text-[#c2bbaf]/68">
              UniMarket is an independent student-built project and is not affiliated with or
              endorsed by the University of Waterloo.
            </p>
          </div>

          <FooterLinks label="Product" links={productLinks} />
          <FooterLinks label="Access" links={accessLinks} />
        </div>

        <div className="relative grid gap-5 py-7 sm:grid-cols-[1fr_auto] sm:items-end">
          <div>
            <p className="font-condensed text-xs font-bold uppercase tracking-[0.15em] text-um-gold-400">
              Waterloo marketplace
            </p>
            <p className="mt-2 font-mono text-[0.62rem] uppercase leading-5 tracking-[0.14em] text-[#bdb6aa]/58">
              Class · Co-op · Move-in · Move-out · Waterloo
            </p>
          </div>
          <p className="text-xs text-[#aaa398]/48">© {new Date().getFullYear()} UniMarket</p>
        </div>
      </div>
    </footer>
  );
}

function FooterLinks({
  label,
  links,
}: {
  label: string;
  links: Array<{ href: string; label: string }>;
}) {
  return (
    <nav aria-label={`${label} links`}>
      <h2 className="font-condensed text-xs font-bold uppercase tracking-[0.15em] text-um-gold-400">
        {label}
      </h2>
      <ul className="mt-5 space-y-2 text-sm">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              className="inline-flex min-h-11 items-center rounded-sm text-[#c8c1b6]/62 transition-colors hover:text-um-gold-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-um-gold-400"
              href={link.href}
              prefetch={link.label === 'Sign in' ? false : undefined}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
