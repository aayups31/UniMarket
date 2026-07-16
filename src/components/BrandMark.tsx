import Link from 'next/link';
import { cn } from '@/lib/utils';

type BrandMarkProps = {
  className?: string;
  href?: string;
  label?: string;
  showCampusLabel?: boolean;
};

export function BrandMark({
  className,
  href = '/',
  label = 'UniMarket home',
  showCampusLabel = true,
}: BrandMarkProps) {
  return (
    <Link
      aria-label={label}
      href={href}
      className={cn(
        'group inline-flex min-h-11 items-center gap-2.5 rounded-lg font-semibold tracking-tight',
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="relative block size-9 shrink-0 overflow-hidden rounded-[0.65rem] bg-um-ink-950 shadow-um-xs ring-1 ring-black/10"
      >
        <span className="absolute left-[0.44rem] top-[0.48rem] h-[0.18rem] w-[1.32rem] rounded-full bg-um-gold-300 transition-transform duration-200 ease-um-out group-hover:translate-x-0.5" />
        <span className="absolute left-[0.44rem] top-[0.88rem] h-[0.18rem] w-[1.02rem] rounded-full bg-um-gold-400 transition-transform duration-200 ease-um-out group-hover:translate-x-0.5" />
        <span className="absolute left-[0.44rem] top-[1.28rem] h-[0.18rem] w-[1.48rem] rounded-full bg-um-gold-500 transition-transform duration-200 ease-um-out group-hover:translate-x-0.5" />
        <span className="absolute left-[0.44rem] top-[1.68rem] h-[0.18rem] w-[0.82rem] rounded-full bg-um-gold-600 transition-transform duration-200 ease-um-out group-hover:translate-x-0.5" />
      </span>

      <span className="flex flex-col leading-none">
        <span className="text-[1.05rem] font-bold tracking-[-0.035em] text-um-text-strong">
          UniMarket
        </span>
        {showCampusLabel ? (
          <span className="font-condensed mt-1 hidden text-[0.61rem] font-semibold uppercase tracking-[0.15em] text-um-text-muted sm:block">
            Waterloo marketplace
          </span>
        ) : null}
      </span>
    </Link>
  );
}
