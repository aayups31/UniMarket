import Link from 'next/link';

import { BrandMark } from '@/components/BrandMark';

const productLinks = [
  { href: '/marketplace', label: 'Browse marketplace' },
  { href: '/listings/new', label: 'Create a listing' },
  { href: '#how-it-works', label: 'How it works' },
  { href: '#categories', label: 'Categories' },
];

const accessLinks = [
  { href: '/signup', label: 'Create account' },
  { href: '/login', label: 'Sign in' },
  { href: '/forgot-password', label: 'Recover password' },
];

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-um-ink-1000 px-4 pb-8 pt-14 text-um-text-inverse sm:px-6 sm:pt-16">
      <div className="mx-auto max-w-um-content">
        <div className="grid gap-12 border-b border-white/10 pb-12 md:grid-cols-[1.4fr_0.7fr_0.7fr] lg:gap-16">
          <div>
            <BrandMark className="[&>span:last-child>span:first-child]:!text-um-text-inverse [&>span:last-child>span:last-child]:!text-white/55" />
            <p className="mt-6 max-w-lg text-sm leading-7 text-white/54">
              A private marketplace for verified Waterloo students, designed around class, co-op,
              moves, and nearby pickup.
            </p>
            <p className="mt-5 max-w-lg text-xs leading-5 text-white/60">
              UniMarket is an independent student-built project and is not affiliated with or
              endorsed by the University of Waterloo.
            </p>
          </div>

          <FooterLinks label="Product" links={productLinks} />
          <FooterLinks label="Access" links={accessLinks} />
        </div>

        <div className="grid gap-5 py-7 sm:grid-cols-[1fr_auto] sm:items-end">
          <div>
            <p className="font-condensed text-xs font-bold uppercase tracking-[0.15em] text-um-gold-400">
              Waterloo marketplace
            </p>
            <p className="mt-2 font-mono text-[0.62rem] uppercase leading-5 tracking-[0.14em] text-white/55">
              DC · SLC · E7 · UWP · ICON · LESTER · COLUMBIA · PHILLIP
            </p>
          </div>
          <p className="text-xs text-white/55">© {new Date().getFullYear()} UniMarket</p>
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
      <h2 className="font-condensed text-xs font-bold uppercase tracking-[0.15em] text-white/55">
        {label}
      </h2>
      <ul className="mt-5 space-y-3 text-sm">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              className="inline-flex min-h-11 items-center rounded-sm text-white/66 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-um-gold-400"
              href={link.href}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
