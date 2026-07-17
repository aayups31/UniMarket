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
      <span
        aria-hidden="true"
        className={cn(
          'relative block h-8 w-9 shrink-0 overflow-hidden border-l',
          tone === 'light' ? 'border-white/22' : 'border-um-ink-950/20',
        )}
      >
        <span className="absolute left-1 top-[0.22rem] h-[0.16rem] w-7 bg-um-gold-300 transition-transform duration-220 ease-um-out group-hover:translate-x-0.5" />
        <span className="absolute left-1 top-[0.72rem] h-[0.16rem] w-5 bg-um-gold-400 transition-transform duration-220 ease-um-out group-hover:translate-x-1" />
        <span className="absolute left-1 top-[1.22rem] h-[0.16rem] w-8 bg-um-gold-500 transition-transform duration-220 ease-um-out group-hover:translate-x-0.5" />
        <span className="absolute left-1 top-[1.72rem] h-[0.16rem] w-4 bg-um-gold-600 transition-transform duration-220 ease-um-out group-hover:translate-x-1" />
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
