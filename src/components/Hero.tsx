import { Armchair, ArrowRight, BookOpen, Laptop, Search, Shirt } from 'lucide-react';
import Link from 'next/link';

const previewCategories = [
  { icon: Laptop, label: 'Electronics' },
  { icon: BookOpen, label: 'Books' },
  { icon: Armchair, label: 'Household' },
  { icon: Shirt, label: 'Clothing' },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-um-ink-950 text-um-text-inverse">
      <CampaignLinework />

      <div className="relative mx-auto grid max-w-um-content gap-14 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[minmax(0,0.92fr)_minmax(28rem,1.08fr)] lg:items-center lg:gap-16 lg:py-24 xl:py-28">
        <div className="max-w-[44rem]">
          <p className="font-condensed text-sm font-bold uppercase tracking-[0.16em] text-um-gold-400">
            Independent student-built project · Waterloo, Ontario
          </p>

          <h1 className="um-balanced mt-6 text-[clamp(3.25rem,7vw,6.75rem)] font-black leading-[0.89] tracking-[-0.07em]">
            A marketplace built for{' '}
            <span className="font-editorial font-normal tracking-[-0.055em] text-um-gold-400">
              students,
            </span>{' '}
            not strangers.
          </h1>

          <p className="mt-7 max-w-xl text-lg leading-8 text-white/66 sm:text-xl">
            Buy and sell with verified Waterloo students, arrange nearby pickup, and move useful
            things through another term.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-um-sm bg-um-gold-500 px-5 text-sm font-black text-um-ink-950 transition-colors hover:bg-um-gold-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-um-ink-950"
              href="/signup"
            >
              Continue with @uwaterloo.ca
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
            <Link
              className="inline-flex min-h-12 items-center justify-center px-5 text-sm font-bold text-white/72 underline decoration-white/28 underline-offset-4 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-um-gold-400"
              href="/login"
            >
              I already have an account
            </Link>
          </div>

          <div className="mt-12 border-t border-white/10 pt-5">
            <p className="font-condensed text-xs font-semibold uppercase tracking-[0.15em] text-white/55">
              Around your Waterloo
            </p>
            <p className="mt-2 font-mono text-[0.66rem] font-semibold uppercase tracking-[0.17em] text-white/62">
              DC · SLC · E7 · UWP · ICON · LESTER · COLUMBIA · PHILLIP
            </p>
          </div>
        </div>

        <CommercePreview />
      </div>

      <div className="relative border-t border-white/10">
        <div className="mx-auto flex max-w-um-content flex-col gap-2 px-4 py-4 text-xs leading-5 text-white/55 sm:px-6 md:flex-row md:items-center md:justify-between">
          <p>Built independently by students for the Waterloo community.</p>
          <p>Not affiliated with or endorsed by the University of Waterloo.</p>
        </div>
      </div>

      <div aria-hidden="true" className="grid h-1.5 grid-cols-4">
        <span className="bg-um-gold-300" />
        <span className="bg-um-gold-400" />
        <span className="bg-um-gold-500" />
        <span className="bg-um-gold-600" />
      </div>
    </section>
  );
}

function CommercePreview() {
  return (
    <figure className="relative lg:pl-4">
      <div className="border border-black/10 bg-um-canvas p-3 text-um-text-strong shadow-um-md sm:p-4">
        <div className="border border-black/10 bg-um-surface px-4 py-4 sm:px-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-condensed text-xs font-bold uppercase tracking-[0.14em] text-um-gold-700">
                Marketplace preview
              </p>
              <p className="mt-1 text-sm font-bold">Waterloo marketplace</p>
            </div>
            <p className="font-mono text-[0.58rem] uppercase tracking-[0.14em] text-um-text-muted">
              Verified access
            </p>
          </div>

          <div className="mt-5 flex min-h-12 items-center gap-3 rounded-um-sm border border-black/12 bg-um-canvas-soft px-4 text-sm text-um-text-muted">
            <Search aria-hidden="true" className="size-4 shrink-0" />
            <span>Search monitors, textbooks, furniture…</span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-px border border-black/10 bg-black/10 sm:grid-cols-4">
            {previewCategories.map(({ icon: Icon, label }) => (
              <div className="bg-um-surface px-3 py-3" key={label}>
                <Icon aria-hidden="true" className="size-4 text-um-text-muted" strokeWidth={1.8} />
                <p className="mt-2 text-xs font-bold">{label}</p>
              </div>
            ))}
          </div>

          <div className="my-8 border-y border-black/10 px-3 py-10 text-center sm:my-10 sm:py-12">
            <p className="font-editorial text-3xl tracking-[-0.035em] sm:text-4xl">
              Waterloo starts here.
            </p>
            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-um-text-muted">
              Real listings appear only after verified students publish them. No invented inventory.
            </p>
            <Link
              className="mt-6 inline-flex min-h-11 items-center justify-center rounded-um-sm bg-um-ink-950 px-4 text-sm font-bold text-um-text-inverse transition-colors hover:bg-um-ink-850 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-um-gold-600 focus-visible:ring-offset-2"
              href="/signup"
            >
              Create an account
            </Link>
          </div>
        </div>
      </div>
      <figcaption className="mt-3 text-xs leading-5 text-white/55">
        An illustrative view of the product interface—not marketplace activity.
      </figcaption>
    </figure>
  );
}

function CampaignLinework() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full text-white"
      preserveAspectRatio="xMidYMid slice"
      viewBox="0 0 1440 900"
    >
      <g fill="none" stroke="currentColor" strokeWidth="1">
        <path
          d="M0 120H1440M0 240H1440M0 360H1440M0 480H1440M0 600H1440M0 720H1440M0 840H1440M120 0V900M240 0V900M360 0V900M480 0V900M600 0V900M720 0V900M840 0V900M960 0V900M1080 0V900M1200 0V900M1320 0V900"
          opacity="0.026"
        />
        <path d="M40 164h260v142h174v116h238" opacity="0.075" strokeDasharray="5 9" />
        <path d="M1060 80v184H930v158h390v214h80" opacity="0.07" />
        <circle cx="300" cy="306" r="7" opacity="0.14" />
        <circle cx="930" cy="422" r="7" opacity="0.14" />
        <path d="M62 790h84M104 748v84M1280 128h84M1322 86v84" opacity="0.12" />
      </g>
    </svg>
  );
}
