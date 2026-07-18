'use client';

import {
  BadgeCheck,
  Bike,
  BookOpen,
  Building2,
  ChevronRight,
  Heart,
  KeyRound,
  Mail,
  Monitor,
  MousePointer2,
  Package,
  Search,
  Shirt,
  ShieldCheck,
  UserRound,
  type LucideIcon,
} from 'lucide-react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

const marketplaceItems: {
  color: string;
  icon: LucideIcon;
  meta: string;
  price: string;
  title: string;
}[] = [
  {
    title: '27” Monitor',
    meta: 'Like new · SLC',
    price: '$145',
    icon: Monitor,
    color: '#d8c9aa',
  },
  {
    title: 'MATH 239',
    meta: 'Good · DC',
    price: '$38',
    icon: BookOpen,
    color: '#c5b573',
  },
  {
    title: 'City bike',
    meta: 'Good · UWP',
    price: '$210',
    icon: Bike,
    color: '#9ca98d',
  },
  {
    title: 'Warriors crew',
    meta: 'Like new · ICON',
    price: '$32',
    icon: Shirt,
    color: '#c7a14c',
  },
  {
    title: 'Move-in box',
    meta: 'New · Lester',
    price: '$12',
    icon: Package,
    color: '#b89978',
  },
  {
    title: 'Desk display',
    meta: 'Fair · Campus',
    price: '$75',
    icon: Monitor,
    color: '#889b9b',
  },
];

export function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { amount: 0.16 });
  const reduceMotion = useReducedMotion();
  const motionIsLive = isInView && !reduceMotion;

  return (
    <section
      className="relative scroll-mt-24 overflow-hidden bg-transparent px-4 py-20 text-[#eee9df] sm:px-6 sm:py-28 lg:py-36"
      id="how-it-works"
      ref={sectionRef}
    >
      <div className="relative mx-auto max-w-um-content">
        <header className="mb-12 flex flex-col gap-5 sm:mb-16 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-condensed text-xs font-bold uppercase tracking-[0.18em] text-um-gold-400">
              Inside UniMarket
            </p>
            <h2 className="um-balanced mt-4 max-w-3xl text-[clamp(2.6rem,5vw,5.25rem)] font-bold leading-[0.96] tracking-[-0.038em]">
              Your campus,
              <span className="font-editorial font-normal tracking-[-0.02em] text-um-gold-300">
                {' '}
                already connected.
              </span>
            </h2>
          </div>
          <p className="max-w-xs text-sm leading-6 text-white/46 sm:pb-1 sm:text-right">
            One identity. One marketplace. Only Waterloo.
          </p>
        </header>

        <div className="grid gap-5 lg:grid-cols-3">
          <MotionCard line="One Waterloo email. Your campus opens." number="01">
            <AccessSequence motionIsLive={motionIsLive} />
          </MotionCard>

          <MotionCard line="Find what Waterloo already has." number="02">
            <BrowseSequence motionIsLive={motionIsLive} reduceMotion={Boolean(reduceMotion)} />
          </MotionCard>

          <MotionCard line="One university identity brings everyone closer." number="03">
            <CampusNetwork motionIsLive={motionIsLive} />
          </MotionCard>
        </div>
      </div>
    </section>
  );
}

function MotionCard({
  children,
  line,
  number,
}: {
  children: React.ReactNode;
  line: string;
  number: string;
}) {
  return (
    <article className="group relative min-w-0 overflow-hidden rounded-[1.65rem] border border-white/[0.12] bg-[#09100f]/92 shadow-[0_30px_90px_rgba(0,0,0,0.38),inset_0_1px_0_rgba(255,255,255,0.055)] backdrop-blur-2xl transition-[transform,border-color,box-shadow] duration-500 ease-um-out hover:-translate-y-1 hover:border-white/[0.18] hover:shadow-[0_40px_110px_rgba(0,0,0,0.5),0_10px_36px_rgba(201,152,18,0.06),inset_0_1px_0_rgba(255,255,255,0.08)] sm:rounded-[2rem]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[1px] z-30 rounded-[calc(1.65rem-1px)] shadow-[inset_0_1px_0_rgba(255,255,255,0.12),inset_1px_0_0_rgba(255,255,255,0.025),inset_-1px_0_0_rgba(255,255,255,0.025)] sm:rounded-[calc(2rem-1px)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-[8%] top-0 z-40 h-px bg-gradient-to-r from-transparent via-[#fff7d8]/70 to-transparent"
      />
      <div className="relative h-[29rem] overflow-hidden sm:h-[31rem] lg:h-[32rem]">{children}</div>
      <div className="relative flex min-h-[6.5rem] items-center gap-4 border-t border-white/[0.09] bg-[linear-gradient(145deg,rgba(18,24,27,0.82),rgba(7,10,14,0.96))] px-6 py-5 backdrop-blur-2xl sm:px-7">
        <span className="font-mono text-[0.58rem] font-semibold tracking-[0.18em] text-um-gold-400/72">
          {number}
        </span>
        <p className="text-[1.03rem] font-semibold leading-6 tracking-[-0.012em] text-[#e9e4d9]">
          {line}
        </p>
      </div>
    </article>
  );
}

function AmbientStage({
  children,
  motionIsLive,
}: {
  children: React.ReactNode;
  motionIsLive: boolean;
}) {
  return (
    <div className="relative flex h-full items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_50%_38%,rgba(206,162,35,0.13),transparent_34%),linear-gradient(160deg,#0d1917_0%,#080d11_54%,#07090d_100%)] p-5 sm:p-7">
      <motion.div
        animate={
          motionIsLive
            ? {
                opacity: [0.3, 0.58, 0.3],
                scale: [0.88, 1.16, 0.88],
                x: ['-12%', '28%', '-12%'],
                y: ['-8%', '18%', '-8%'],
              }
            : { opacity: 0.4, scale: 1, x: '0%', y: '0%' }
        }
        aria-hidden="true"
        className="absolute -left-[16%] -top-[8%] h-[68%] w-[78%] rounded-[45%] bg-[radial-gradient(circle,rgba(255,240,176,0.12),rgba(203,159,34,0.045)_42%,transparent_72%)] blur-[38px]"
        transition={{ duration: 12, ease: 'easeInOut', repeat: motionIsLive ? Infinity : 0 }}
      />
      <div
        aria-hidden="true"
        className="absolute left-[10%] top-[8%] size-40 rounded-full bg-um-gold-500/[0.075] blur-[55px]"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-[8%] right-[4%] size-52 rounded-full bg-[#4a8b7e]/[0.085] blur-[65px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[1px] rounded-[inherit] bg-[linear-gradient(135deg,rgba(255,255,255,0.035),transparent_24%,transparent_70%,rgba(231,188,53,0.025))] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
      />
      <div className="relative h-full w-full">{children}</div>
    </div>
  );
}

function AccessSequence({ motionIsLive }: { motionIsLive: boolean }) {
  return (
    <AmbientStage motionIsLive={motionIsLive}>
      <div aria-hidden="true" className="relative mx-auto h-full max-w-[22rem]">
        <div
          className="um-access-signin-panel absolute inset-x-0 top-[11%] z-20 mx-auto w-full max-w-[19rem] overflow-hidden rounded-[1.45rem] border border-white/[0.2] bg-[linear-gradient(145deg,rgba(39,50,54,0.76),rgba(10,15,20,0.84))] shadow-[inset_0_1px_0_rgba(255,255,255,0.18),inset_0_-1px_0_rgba(255,255,255,0.025),0_34px_85px_rgba(0,0,0,0.58),0_10px_28px_rgba(201,152,18,0.08)] backdrop-blur-2xl"
          data-motion="signin-panel"
        >
          <GlassSpecular />
          <div className="flex items-center justify-between border-b border-white/[0.08] px-5 py-4">
            <div className="flex items-center gap-2">
              <span className="grid size-7 place-items-center rounded-full bg-um-gold-400 text-[0.62rem] font-black text-um-ink-950">
                UM
              </span>
              <span className="text-xs font-bold tracking-[-0.01em] text-[#e8e3d8]">UniMarket</span>
            </div>
            <span className="size-1.5 rounded-full bg-um-gold-400 shadow-[0_0_12px_rgba(231,188,53,0.8)]" />
          </div>

          <div className="p-5">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.15em] text-white/38">
              Student sign in
            </p>
            <div className="mt-4 space-y-2.5">
              <DemoField icon={Mail} value="alex@uwaterloo.ca" />
              <DemoField icon={KeyRound} value="••••••••••••" />
            </div>
            <div
              className="um-access-signin-button relative mt-4 flex h-11 items-center justify-center overflow-hidden rounded-xl bg-um-gold-300 text-sm font-black text-um-ink-950"
              data-motion="signin-button"
            >
              <span className="um-access-click-ripple absolute size-5 rounded-full border border-um-ink-950/35" />
              <span className="relative">Sign in</span>
              <ChevronRight className="ml-1 size-4" strokeWidth={2.2} />
            </div>
          </div>
        </div>

        <div
          className="um-access-cursor pointer-events-none absolute left-[62%] top-[57%] z-40 text-[#fff0b0] drop-shadow-[0_7px_12px_rgba(0,0,0,0.72)]"
          data-motion="signin-cursor"
        >
          <MousePointer2 className="size-6" fill="#fff0b0" strokeWidth={1.15} />
        </div>

        <div
          className="um-access-welcome-panel absolute inset-x-0 top-[29%] z-30 mx-auto w-full max-w-[19rem] overflow-hidden rounded-[1.45rem] border border-[#fff2ba]/25 bg-[linear-gradient(145deg,rgba(36,47,35,0.78),rgba(10,16,13,0.86))] shadow-[inset_0_1px_0_rgba(255,255,255,0.2),inset_0_-1px_0_rgba(255,255,255,0.03),0_36px_95px_rgba(0,0,0,0.64),0_12px_36px_rgba(201,152,18,0.13)] backdrop-blur-2xl"
          data-motion="welcome-panel"
        >
          <GlassSpecular />
          <div className="relative p-6">
            <div
              aria-hidden="true"
              className="absolute -right-10 -top-12 size-32 rounded-full bg-um-gold-400/10 blur-3xl"
            />
            <div className="relative flex items-start justify-between gap-5">
              <div>
                <p className="text-[0.66rem] font-semibold uppercase tracking-[0.17em] text-um-gold-400">
                  Saturday · 6:42 PM
                </p>
                <p className="mt-4 text-3xl font-semibold leading-none tracking-[-0.045em] text-[#f0ecdf]">
                  Welcome back,
                  <span className="font-editorial block font-normal text-um-gold-300">Alex.</span>
                </p>
              </div>
              <span className="grid size-10 shrink-0 place-items-center rounded-full border border-um-gold-300/25 bg-um-gold-300/10 text-um-gold-300">
                <BadgeCheck className="size-5" strokeWidth={1.8} />
              </span>
            </div>
            <div className="mt-7 flex items-center gap-3 border-t border-white/[0.09] pt-4 text-xs text-white/48">
              <span className="size-1.5 rounded-full bg-[#43a573] shadow-[0_0_12px_rgba(67,165,115,0.55)]" />
              Waterloo is ready for you.
            </div>
          </div>
        </div>

        <motion.div
          animate={
            motionIsLive ? { opacity: [0.18, 0.5, 0.18], scale: [0.92, 1.06, 0.92] } : undefined
          }
          className="absolute inset-x-[14%] bottom-[10%] h-10 rounded-[50%] bg-black/60 blur-xl"
          transition={{ duration: 5.2, ease: 'easeInOut', repeat: Infinity }}
        />
      </div>
    </AmbientStage>
  );
}

function DemoField({ icon: Icon, value }: { icon: LucideIcon; value: string }) {
  return (
    <div className="flex h-11 items-center gap-3 rounded-xl border border-white/[0.11] bg-white/[0.035] px-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.055)] backdrop-blur-xl">
      <Icon className="size-3.5 text-um-gold-400" strokeWidth={1.8} />
      <span className="truncate text-xs text-white/62">{value}</span>
    </div>
  );
}

function GlassSpecular() {
  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-30 rounded-[inherit] bg-[linear-gradient(132deg,rgba(255,255,255,0.14)_0%,rgba(255,255,255,0.045)_14%,transparent_31%,transparent_72%,rgba(242,213,111,0.035)_100%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-[12%] top-0 z-30 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent"
      />
    </>
  );
}

function BrowseSequence({
  motionIsLive,
  reduceMotion,
}: {
  motionIsLive: boolean;
  reduceMotion: boolean;
}) {
  return (
    <AmbientStage motionIsLive={motionIsLive}>
      <div aria-hidden="true" className="flex h-full items-center justify-center">
        <motion.div
          animate={
            motionIsLive
              ? {
                  rotateX: [4, -1, 2.5],
                  rotateY: [-4, 2.5, -4],
                  scale: [0.97, 1.025, 0.97],
                  y: [3, -8, 3],
                }
              : { rotateX: 0, rotateY: 0, scale: 1, y: 0 }
          }
          className="relative h-[25.5rem] w-full max-w-[21rem] overflow-hidden rounded-[1.45rem] border border-white/[0.19] bg-[linear-gradient(145deg,rgba(31,42,46,0.74),rgba(8,13,18,0.88))] shadow-[inset_0_1px_0_rgba(255,255,255,0.18),inset_0_-1px_0_rgba(255,255,255,0.025),0_36px_95px_rgba(0,0,0,0.6),0_12px_34px_rgba(201,152,18,0.075)] backdrop-blur-2xl"
          style={{ transformPerspective: 1100 }}
          transition={{ duration: 8, ease: 'easeInOut', repeat: motionIsLive ? Infinity : 0 }}
        >
          <GlassSpecular />
          <div className="border-b border-white/[0.07] px-4 pb-3 pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="grid size-6 place-items-center rounded-full bg-um-gold-400 text-[0.52rem] font-black text-um-ink-950">
                  UM
                </span>
                <span className="text-[0.68rem] font-bold text-[#e7e1d5]">Marketplace</span>
              </div>
              <Heart className="size-3.5 text-white/30" />
            </div>
            <div className="mt-3 flex h-9 items-center gap-2 rounded-lg border border-white/[0.07] bg-[#080b10] px-3 text-[0.64rem] text-white/35">
              <Search className="size-3 text-um-gold-400" strokeWidth={2} />
              Search Waterloo
              <motion.span
                animate={motionIsLive ? { opacity: [0.15, 0.9, 0.15] } : { opacity: 0.6 }}
                className="h-3 w-px bg-um-gold-300"
                transition={{ duration: 1.05, repeat: motionIsLive ? Infinity : 0 }}
              />
            </div>
            <div className="mt-2.5 flex gap-1.5 overflow-hidden">
              {['For you', 'Electronics', 'Books'].map((label, index) => (
                <motion.span
                  animate={
                    motionIsLive
                      ? { opacity: index === 0 ? [1, 0.45, 1] : [0.38, 0.95, 0.38] }
                      : { opacity: index === 0 ? 1 : 0.42 }
                  }
                  className={
                    index === 0
                      ? 'shrink-0 rounded-full bg-um-gold-300 px-2.5 py-1 text-[0.52rem] font-bold text-um-ink-950'
                      : 'shrink-0 rounded-full border border-white/[0.08] px-2.5 py-1 text-[0.52rem] font-semibold text-white/55'
                  }
                  key={label}
                  transition={{
                    delay: index * 0.55,
                    duration: 4.6,
                    repeat: motionIsLive ? Infinity : 0,
                  }}
                >
                  {label}
                </motion.span>
              ))}
            </div>
          </div>

          <div className="relative h-[18.25rem] overflow-hidden p-3">
            <motion.div
              animate={
                motionIsLive
                  ? { y: [0, 0, -78, -78, -150, -150, 0] }
                  : { y: reduceMotion ? -42 : 0 }
              }
              className="grid grid-cols-2 gap-2.5"
              transition={{
                duration: 10.5,
                ease: EASE_OUT,
                repeat: motionIsLive ? Infinity : 0,
                repeatDelay: 0.4,
                times: [0, 0.17, 0.29, 0.48, 0.61, 0.84, 1],
              }}
            >
              {marketplaceItems.map((item) => (
                <ListingTile item={item} key={item.title} />
              ))}
            </motion.div>

            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0e1319] to-transparent"
            />
          </div>

          <motion.div
            animate={
              motionIsLive
                ? {
                    opacity: [0, 1, 1, 0, 0],
                    x: [48, 8, 8, -70, 48],
                    y: [132, 84, 84, 190, 132],
                  }
                : { opacity: 0.9, x: 8, y: 84 }
            }
            className="pointer-events-none absolute left-1/2 top-1/2 z-20 text-[#f7e5a2] drop-shadow-[0_5px_10px_rgba(0,0,0,0.65)]"
            transition={{
              duration: 10.5,
              ease: EASE_OUT,
              repeat: motionIsLive ? Infinity : 0,
              repeatDelay: 0.4,
              times: [0, 0.2, 0.42, 0.72, 1],
            }}
          >
            <MousePointer2 className="size-5" fill="#f7e5a2" strokeWidth={1.2} />
          </motion.div>
        </motion.div>
      </div>
    </AmbientStage>
  );
}

function ListingTile({ item }: { item: (typeof marketplaceItems)[number] }) {
  const Icon = item.icon;

  return (
    <div className="overflow-hidden rounded-xl border border-white/[0.12] bg-white/[0.045] p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_12px_30px_rgba(0,0,0,0.2)] backdrop-blur-xl">
      <div
        className="relative grid h-[5.1rem] place-items-center overflow-hidden rounded-lg"
        style={{ backgroundColor: item.color }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(255,255,255,.5),transparent_38%),linear-gradient(145deg,rgba(255,255,255,.18),transparent_48%,rgba(5,7,11,.08))]" />
        <Icon className="relative size-7 text-[#111720]/80" strokeWidth={1.45} />
      </div>
      <div className="px-0.5 pb-1 pt-2">
        <div className="flex items-start justify-between gap-2">
          <p className="truncate text-[0.65rem] font-bold text-[#e9e3d8]">{item.title}</p>
          <p className="text-[0.61rem] font-black text-um-gold-300">{item.price}</p>
        </div>
        <p className="mt-1 truncate text-[0.5rem] text-white/35">{item.meta}</p>
      </div>
    </div>
  );
}

function CampusNetwork({ motionIsLive }: { motionIsLive: boolean }) {
  return (
    <AmbientStage motionIsLive={motionIsLive}>
      <div aria-hidden="true" className="relative mx-auto h-full w-full max-w-[23rem]">
        <svg
          className="absolute inset-0 size-full overflow-visible"
          fill="none"
          viewBox="0 0 360 420"
        >
          <defs>
            <linearGradient id="networkGold" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0" stopColor="#745706" stopOpacity="0.28" />
              <stop offset="0.52" stopColor="#e7bc35" stopOpacity="0.9" />
              <stop offset="1" stopColor="#f2d56f" stopOpacity="0.34" />
            </linearGradient>
          </defs>

          {[
            'M 40 95 C 86 100 108 176 143 202',
            'M 36 170 C 89 170 108 194 143 207',
            'M 43 255 C 92 255 112 226 143 216',
            'M 66 326 C 110 316 121 248 145 221',
          ].map((path) => (
            <path
              className="um-network-line"
              d={path}
              key={path}
              pathLength="1"
              stroke="url(#networkGold)"
              strokeLinecap="round"
              strokeWidth="1.35"
            />
          ))}

          {[
            'M 205 183 C 250 150 298 76 333 50',
            'M 214 196 C 264 176 304 142 340 129',
            'M 218 213 C 265 214 304 217 333 219',
            'M 205 238 C 250 256 278 290 306 307',
          ].map((path) => (
            <path
              className="um-network-line"
              d={path}
              key={path}
              pathLength="1"
              stroke="url(#networkGold)"
              strokeLinecap="round"
              strokeWidth="1.2"
            />
          ))}
        </svg>

        <div
          className="um-network-id-link absolute left-1/2 top-[27%] z-[15] h-[16%] w-[2.5px] origin-top -translate-x-1/2 rounded-full bg-[#edc84f] shadow-[0_0_7px_rgba(237,200,79,0.68),0_0_18px_rgba(231,188,53,0.28)]"
          data-motion="uw-id-link"
        />

        <NetworkNode className="left-[2%] top-[12%]" delay={0}>
          <Monitor className="size-4" />
        </NetworkNode>
        <NetworkNode className="left-[1%] top-[31%]" delay={0.06}>
          <BookOpen className="size-4" />
        </NetworkNode>
        <NetworkNode className="left-[3%] top-[52%]" delay={0.12}>
          <Bike className="size-4" />
        </NetworkNode>
        <NetworkNode className="left-[10%] top-[70%]" delay={0.18}>
          <Shirt className="size-4" />
        </NetworkNode>

        <div
          className="um-network-core absolute z-20 grid size-[4.75rem] place-items-center overflow-hidden rounded-[1.6rem] border border-[#fff8d8]/55 bg-[linear-gradient(145deg,rgba(255,238,161,0.98),rgba(231,188,53,0.9))] text-um-ink-950 shadow-[inset_0_1px_0_rgba(255,255,255,0.72),inset_0_-1px_0_rgba(116,87,6,0.16),0_24px_65px_rgba(0,0,0,0.55),0_8px_30px_rgba(231,188,53,0.2)] backdrop-blur-2xl"
          style={{ left: 'calc(50% - 2.375rem)', top: 'calc(50% - 2.375rem)' }}
        >
          <GlassSpecular />
          <span className="relative z-40 text-base font-black tracking-[-0.05em]">UM</span>
        </div>

        <div
          className="um-network-id absolute top-[12%] z-30 flex w-[5.5rem] flex-col items-center overflow-hidden rounded-[1.4rem] border border-white/[0.2] bg-[linear-gradient(145deg,rgba(50,62,51,0.72),rgba(10,16,13,0.84))] px-2 py-3 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_24px_65px_rgba(0,0,0,0.52),0_8px_28px_rgba(231,188,53,0.1)] backdrop-blur-2xl"
          style={{ left: 'calc(50% - 2.75rem)' }}
        >
          <GlassSpecular />
          <span className="relative z-40 grid size-8 place-items-center rounded-full border border-um-gold-300/12 bg-um-gold-300/12 text-um-gold-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
            <ShieldCheck className="size-4" strokeWidth={1.8} />
          </span>
          <span className="relative z-40 mt-2 text-[0.55rem] font-black uppercase tracking-[0.12em] text-[#f0eadf]">
            UW ID
          </span>
        </div>

        <PersonNode className="right-[2%] top-[8%]" delay={0.06} initial="A" />
        <PersonNode className="right-[-1%] top-[26%]" delay={0.12} initial="M" />
        <PersonNode className="right-[2%] top-[48%]" delay={0.18} initial="S" />
        <PersonNode className="right-[10%] top-[69%]" delay={0.24} initial="J" />

        <div className="absolute bottom-[4%] left-[2%] flex items-center gap-2 text-[0.55rem] font-semibold uppercase tracking-[0.14em] text-white/28">
          <Building2 className="size-3 text-um-gold-400/60" />
          Waterloo network
        </div>
      </div>
    </AmbientStage>
  );
}

function NetworkNode({
  children,
  className,
  delay,
}: {
  children: React.ReactNode;
  className: string;
  delay: number;
}) {
  return (
    <span
      className={`um-network-node absolute z-10 grid size-10 place-items-center overflow-hidden rounded-xl border border-um-gold-300/25 bg-[linear-gradient(145deg,rgba(52,61,49,0.7),rgba(9,14,18,0.8))] text-um-gold-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_16px_38px_rgba(0,0,0,0.38),0_0_22px_rgba(231,188,53,0.08)] backdrop-blur-xl ${className}`}
      style={{ animationDelay: `${delay}s` }}
    >
      <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.13),transparent_42%)]" />
      <span className="relative">{children}</span>
    </span>
  );
}

function PersonNode({
  className,
  delay,
  initial,
}: {
  className: string;
  delay: number;
  initial: string;
}) {
  return (
    <span
      className={`um-network-node absolute z-10 grid size-9 place-items-center overflow-hidden rounded-full border border-um-gold-300/30 bg-[linear-gradient(145deg,rgba(52,61,49,0.7),rgba(10,15,13,0.8))] text-[0.58rem] font-black text-[#eee7d7] shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_14px_34px_rgba(0,0,0,0.4),0_0_20px_rgba(231,188,53,0.08)] backdrop-blur-xl ${className}`}
      style={{ animationDelay: `${delay}s` }}
    >
      <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.13),transparent_48%)]" />
      <UserRound className="relative size-4 text-um-gold-300/90" strokeWidth={1.55} />
      <span className="sr-only">Student {initial}</span>
    </span>
  );
}
