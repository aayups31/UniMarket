const reasons = [
  {
    number: '01',
    title: 'Verified campus access',
    description:
      'Student accounts verify an @uwaterloo.ca address once before entering the private marketplace.',
  },
  {
    number: '02',
    title: 'Useful location, less exposure',
    description:
      'Listings use broad pickup areas such as campus, UWP, ICON, Lester, or Columbia—not an exact address.',
  },
  {
    number: '03',
    title: 'Designed around term life',
    description:
      'The product starts with the things students actually pass on before class, co-op, move-in, and move-out.',
  },
  {
    number: '04',
    title: 'Clear exchange expectations',
    description:
      'Condition, photos, price, and pickup context sit together, with guidance to meet publicly and inspect first.',
  },
];

export function WhyBetter() {
  return (
    <section
      className="scroll-mt-24 bg-um-canvas px-4 py-20 sm:px-6 sm:py-24 lg:py-32"
      id="why-waterloo"
    >
      <div className="mx-auto max-w-um-content">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.72fr)_minmax(32rem,1.28fr)] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="font-condensed text-sm font-bold uppercase tracking-[0.15em] text-um-gold-700">
              Why Waterloo first
            </p>
            <h2 className="um-balanced mt-4 text-4xl font-black leading-[0.98] tracking-[-0.055em] sm:text-5xl lg:text-6xl">
              One campus changes the marketplace.
            </h2>
            <p className="mt-6 max-w-lg text-lg leading-8 text-um-text">
              UniMarket narrows the marketplace to a shared university, a verified student domain,
              and the places that already shape everyday exchanges.
            </p>

            <div className="mt-9 border-l-2 border-um-gold-600 pl-5">
              <p className="text-sm font-bold text-um-text-strong">Independent, not official</p>
              <p className="mt-2 max-w-md text-sm leading-6 text-um-text-muted">
                Waterloo context is part of the product experience. UniMarket does not represent the
                University of Waterloo.
              </p>
            </div>
          </div>

          <ol className="border-t border-black/10">
            {reasons.map((reason) => (
              <li
                className="grid gap-4 border-b border-black/10 py-7 sm:grid-cols-[4rem_13rem_minmax(0,1fr)] sm:items-start sm:gap-6 sm:py-9"
                key={reason.number}
              >
                <span className="font-condensed text-sm font-bold tracking-[0.12em] text-um-gold-700">
                  {reason.number}
                </span>
                <h3 className="text-xl font-black leading-tight tracking-[-0.025em]">
                  {reason.title}
                </h3>
                <p className="max-w-xl text-sm leading-7 text-um-text-muted sm:text-base">
                  {reason.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
