import Image from 'next/image';
import Link from 'next/link';

import { cn } from '@/lib/utils';

type BrandMarkProps = {
  className?: string;
  href?: string;
  label?: string;
  showCampusLabel?: boolean;
  tone?: 'dark' | 'light';
};

export function BrandMark({
  className,
  href = '/',
  label = 'UniMarket home',
  showCampusLabel = true,
  tone = 'dark',
}: BrandMarkProps) {
  return (
    <Link
      aria-label={label}
      href={href}
      className={cn(
        'group inline-flex min-h-11 items-center gap-3 rounded-sm font-semibold tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-um-gold-400',
        className,
      )}
    >
      <span aria-hidden="true" className="relative grid size-9 shrink-0 place-items-center">
        <Image
          alt=""
          className="size-9 object-contain"
          height={72}
          src="/brand/unimarket-mark.png"
          width={72}
        />
      </span>

      <span className="flex flex-col leading-none">
        <span
          className={cn(
            'text-[1.05rem] font-bold tracking-[-0.035em]',
            tone === 'light' ? 'text-um-text-inverse' : 'text-um-text-strong',
          )}
        >
          UniMarket
        </span>
        {showCampusLabel ? (
          <span
            className={cn(
              'mt-1 hidden font-condensed text-[0.61rem] font-semibold uppercase tracking-[0.15em] sm:block',
              tone === 'light' ? 'text-white/48' : 'text-um-text-muted',
            )}
          >
            Waterloo marketplace
          </span>
        ) : null}
      </span>
    </Link>
  );
}
