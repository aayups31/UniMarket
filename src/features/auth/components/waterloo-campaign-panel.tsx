import Link from 'next/link';

import { cn } from '@/lib/utils';

type WaterlooCampaignPanelProps = {
  className?: string;
  compact?: boolean;
};

const CAMPUS_PLACES = ['DC', 'SLC', 'E7', 'UWP', 'ICON', 'LESTER'];

export function WaterlooCampaignPanel({ className, compact = false }: WaterlooCampaignPanelProps) {
  if (compact) {
    return (
      <header
        className={cn(
          'relative overflow-hidden border-b border-white/10 bg-[#0b0c0c] px-5 py-5 text-white sm:px-8',
          className,
        )}
      >
        <BlueprintLinework />
        <div className="relative z-10 flex items-center justify-between gap-4">
          <CampaignBrand />
          <p className="font-mono text-[0.6rem] uppercase leading-4 tracking-[0.16em] text-white/55">
            43.4723° N<span className="block">80.5449° W</span>
          </p>
        </div>

        <div className="relative z-10 mt-6 flex items-end justify-between gap-5">
          <div>
            <p className="text-[0.65rem] font-black uppercase tracking-[0.22em] text-[#ffd54f]">
              Black / Gold
            </p>
            <p className="mt-1 max-w-[15rem] text-xl font-black leading-tight tracking-[-0.035em]">
              Waterloo buys from Waterloo.
            </p>
          </div>
          <p className="hidden text-right font-mono text-[0.58rem] uppercase leading-4 tracking-[0.14em] text-white/55 min-[430px]:block">
            {CAMPUS_PLACES.slice(0, 3).join(' · ')}
            <span className="block">{CAMPUS_PLACES.slice(3).join(' · ')}</span>
          </p>
        </div>
        <GoldBands />
      </header>
    );
  }

  return (
    <aside
      className={cn(
        'relative hidden min-h-screen overflow-hidden bg-[#0b0c0c] px-10 py-9 text-white lg:flex lg:flex-col xl:px-14 xl:py-11',
        className,
      )}
    >
      <BlueprintLinework />

      <div className="relative z-10 flex items-start justify-between gap-6">
        <CampaignBrand />
        <p className="text-right font-mono text-[0.62rem] uppercase leading-4 tracking-[0.16em] text-white/55">
          43.4723° N<span className="block">80.5449° W</span>
        </p>
      </div>

      <div className="relative z-10 my-auto py-16">
        <p className="mb-5 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-[#ffd54f]">
          Private campus exchange · UW
        </p>

        <div
          aria-label="Go black. Go gold."
          className="font-condensed w-fit origin-left text-[clamp(4.6rem,7.2vw,7.8rem)] font-bold uppercase leading-[0.72] tracking-[-0.055em]"
        >
          <span className="block text-white">Go</span>
          <span className="block text-white">Black</span>
          <span className="mt-[0.16em] block text-[#ffd54f]">Go</span>
          <span className="block text-[#ffd54f]">Gold</span>
        </div>

        <div className="mt-12 max-w-lg border-l-2 border-[#ffd54f] pl-5">
          <p className="text-2xl font-black leading-tight tracking-[-0.035em] xl:text-3xl">
            Waterloo buys
            <span className="block">from Waterloo.</span>
          </p>
          <p className="mt-4 max-w-md text-sm leading-6 text-white/62 xl:text-base xl:leading-7">
            A private marketplace for verified <span className="text-white">@uwaterloo.ca</span>{' '}
            students.
          </p>
          <p className="mt-2 max-w-md text-sm leading-6 text-white/55">
            Built for move-ins, move-outs, co-op terms, and everything between.
          </p>
        </div>
      </div>

      <div className="relative z-10">
        <p className="font-mono text-[0.58rem] uppercase tracking-[0.2em] text-white/55">
          Campus coordinates
        </p>
        <p className="mt-2 font-mono text-[0.68rem] font-semibold tracking-[0.16em] text-white/62">
          {CAMPUS_PLACES.join(' · ')}
        </p>
      </div>
      <GoldBands />
    </aside>
  );
}

function CampaignBrand() {
  return (
    <Link
      className="inline-flex min-h-11 w-fit items-center gap-3 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffd54f] focus-visible:ring-offset-4 focus-visible:ring-offset-[#0b0c0c]"
      href="/"
    >
      <span
        aria-hidden="true"
        className="relative block size-9 shrink-0 overflow-hidden rounded-[0.6rem] bg-white/5 ring-1 ring-white/15"
      >
        <span className="absolute left-[0.42rem] top-[0.47rem] h-[0.18rem] w-[1.32rem] rounded-full bg-[#fff0a3]" />
        <span className="absolute left-[0.42rem] top-[0.87rem] h-[0.18rem] w-[1.02rem] rounded-full bg-[#ffdf66]" />
        <span className="absolute left-[0.42rem] top-[1.27rem] h-[0.18rem] w-[1.48rem] rounded-full bg-[#ffd02f]" />
        <span className="absolute left-[0.42rem] top-[1.67rem] h-[0.18rem] w-[0.82rem] rounded-full bg-[#e5ad00]" />
      </span>
      <span>
        <span className="block text-base font-black leading-none tracking-[-0.025em]">
          UniMarket
        </span>
        <span className="mt-1 block font-mono text-[0.5rem] uppercase tracking-[0.18em] text-white/55">
          Waterloo marketplace
        </span>
      </span>
    </Link>
  );
}

function BlueprintLinework() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full text-white"
      preserveAspectRatio="xMidYMid slice"
      viewBox="0 0 800 1000"
    >
      <g fill="none" stroke="currentColor" strokeWidth="1">
        <path
          d="M0 100H800M0 200H800M0 300H800M0 400H800M0 500H800M0 600H800M0 700H800M0 800H800M0 900H800M100 0V1000M200 0V1000M300 0V1000M400 0V1000M500 0V1000M600 0V1000M700 0V1000"
          opacity="0.035"
        />
        <path d="M52 118H264V252H438V365H676" opacity="0.09" strokeDasharray="5 8" />
        <path d="M122 824V686H318V758H476V594H712" opacity="0.075" />
        <path d="M612 74V278H524V486H744" opacity="0.075" strokeDasharray="3 9" />
        <circle cx="264" cy="252" r="7" opacity="0.18" />
        <circle cx="476" cy="594" r="7" opacity="0.16" />
        <circle cx="612" cy="278" r="7" opacity="0.14" />
        <path d="M54 928h72M90 892v72M674 124h72M710 88v72" opacity="0.14" />
      </g>
    </svg>
  );
}

function GoldBands() {
  return (
    <div aria-hidden="true" className="absolute inset-x-0 bottom-0 grid h-1.5 grid-cols-4">
      <span className="bg-[#fff0a3]" />
      <span className="bg-[#ffdf66]" />
      <span className="bg-[#ffd02f]" />
      <span className="bg-[#e5ad00]" />
    </div>
  );
}
