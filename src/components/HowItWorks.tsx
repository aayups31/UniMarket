import Link from 'next/link';

const steps = [
  {
    number: '01',
    title: 'Create and verify once',
    description:
      'Choose a password with your Waterloo email, then open one verification link. Future sign-ins use email and password.',
  },
  {
    number: '02',
    title: 'Find it or pass it on',
    description:
      'Search the marketplace or publish a listing with clear photos, condition, price, and a broad pickup area.',
  },
  {
    number: '03',
    title: 'Agree, inspect, exchange',
    description:
      'Contact the seller, choose a public campus-area meetup, and inspect the item before completing the exchange.',
  },
];

export function HowItWorks() {
  return (
    <section
      className="scroll-mt-24 border-y border-white/10 bg-um-ink-900 px-4 py-20 text-um-text-inverse sm:px-6 sm:py-24 lg:py-28"
      id="how-it-works"
    >
      <div className="mx-auto max-w-um-content">
        <div className="grid gap-7 border-b border-white/10 pb-9 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="font-condensed text-sm font-bold uppercase tracking-[0.15em] text-um-gold-400">
              How it works
            </p>
            <h2 className="um-balanced mt-4 max-w-3xl text-4xl font-black leading-[0.98] tracking-[-0.05em] sm:text-5xl">
              From Waterloo inbox to campus pickup.
            </h2>
          </div>
          <Link
            className="inline-flex min-h-11 w-fit items-center text-sm font-bold text-um-gold-400 underline decoration-um-gold-600 underline-offset-4 transition-colors hover:text-um-gold-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-um-gold-400"
            href="/signup"
          >
            Create an account
          </Link>
        </div>

        <ol className="grid md:grid-cols-3">
          {steps.map((step) => (
            <li
              className="border-b border-white/10 py-8 md:border-b-0 md:border-r md:px-8 md:py-10 md:first:pl-0 md:last:border-r-0 md:last:pr-0"
              key={step.number}
            >
              <p className="font-condensed text-3xl font-bold tracking-[-0.02em] text-um-gold-400">
                {step.number}
              </p>
              <h3 className="mt-8 text-2xl font-black tracking-[-0.03em]">{step.title}</h3>
              <p className="mt-4 max-w-sm text-sm leading-7 text-white/56 sm:text-base">
                {step.description}
              </p>
            </li>
          ))}
        </ol>

        <p className="mt-7 max-w-3xl text-sm leading-6 text-white/55">
          Verification confirms campus email access. It does not replace inspecting an item or
          meeting in a public place.
        </p>
      </div>
    </section>
  );
}
