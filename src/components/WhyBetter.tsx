import { BadgeCheck, CalendarRange, MapPin } from 'lucide-react';
import Image from 'next/image';

const principles = [
  {
    label: 'Waterloo ID',
    detail: 'Verified @uwaterloo.ca access.',
    icon: BadgeCheck,
  },
  {
    label: 'Nearby',
    detail: 'Pickup around places you know.',
    icon: MapPin,
  },
  {
    label: 'Term-aware',
    detail: 'Built for classes, moves, and co-op.',
    icon: CalendarRange,
  },
] as const;

export function WhyBetter() {
  return (
    <section
      className="relative scroll-mt-24 overflow-hidden bg-transparent py-24 text-[#ece8df] sm:py-28 lg:py-36"
      id="why-waterloo"
    >
      <div className="relative mx-auto max-w-um-content px-4 sm:px-6 lg:px-8">
        <header className="grid gap-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(18rem,0.7fr)] lg:items-end lg:gap-20">
          <div>
            <p className="font-condensed text-xs font-bold uppercase tracking-[0.18em] text-um-gold-400">
              Why Waterloo
            </p>
            <h2 className="um-balanced mt-5 max-w-5xl text-[clamp(2.9rem,6vw,6rem)] font-bold leading-[0.95] tracking-[-0.038em]">
              One campus changes
              <span className="font-editorial block font-normal tracking-[-0.02em] text-um-gold-300">
                the whole marketplace.
              </span>
            </h2>
          </div>
          <p className="max-w-md text-base leading-7 text-[#ddd6cb]/70 sm:text-lg sm:leading-8">
            Verified access, familiar pickup, and a rhythm that already matches Waterloo life.
          </p>
        </header>

        <figure className="group relative mt-14 h-[38rem] overflow-hidden rounded-[1.75rem] border border-white/[0.1] bg-um-ink-900 shadow-[0_46px_130px_rgba(0,0,0,0.46)] sm:mt-20 sm:h-[44rem] sm:rounded-[2.75rem] lg:h-[48rem]">
          <Image
            alt="The upper lounge inside Waterloo's Student Life Centre, with black-and-gold flooring and campus buildings beyond the windows"
            className="um-immersive-photo object-cover brightness-[0.78] saturate-[0.94] contrast-[1.06]"
            fill
            sizes="(min-width: 1320px) 1320px, 100vw"
            src="/waterloo/slc-interior.webp"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,7,11,0.26),transparent_42%,rgba(5,7,11,0.88)_100%)]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(circle_at_72%_28%,rgba(242,213,111,0.12),transparent_34%)]"
          />

          <div className="absolute inset-x-0 top-0 flex items-center justify-between gap-6 p-6 sm:p-9 lg:p-11">
            <p className="font-condensed text-[0.66rem] font-bold uppercase tracking-[0.2em] text-[#f3eee5]/75">
              Student Life Centre / Waterloo
            </p>
            <span className="size-2 rounded-full bg-um-gold-300 shadow-[0_0_18px_rgba(242,213,111,0.65)]" />
          </div>

          <blockquote className="absolute bottom-8 left-6 max-w-3xl sm:bottom-10 sm:left-10 lg:bottom-12 lg:left-12">
            <p className="font-editorial text-[clamp(2.65rem,5vw,5.35rem)] leading-[0.98] tracking-[-0.025em] text-[#f4efe6]">
              Verified here.
              <span className="block text-um-gold-300">Picked up nearby.</span>
            </p>
          </blockquote>
        </figure>

        <div className="mt-12 grid border-y border-white/[0.1] sm:grid-cols-3 lg:mt-16">
          {principles.map(({ detail, icon: Icon, label }, index) => (
            <article
              className={`flex min-h-32 items-start gap-4 py-7 sm:px-7 lg:min-h-36 lg:px-9 lg:py-9 ${
                index > 0 ? 'border-t border-white/[0.1] sm:border-l sm:border-t-0' : ''
              }`}
              key={label}
            >
              <Icon className="mt-0.5 size-5 shrink-0 text-um-gold-300" strokeWidth={1.6} />
              <div>
                <h3 className="text-lg font-bold tracking-[-0.025em] text-[#f0ebe2]">{label}</h3>
                <p className="mt-2 text-sm leading-6 text-[#c7c0b5]/64">{detail}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
