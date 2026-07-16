import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  CircleCheckBig,
  ClipboardList,
  Eye,
  Inbox,
  LockKeyhole,
  ShieldCheck,
} from 'lucide-react';

import { ModerationAuditLog } from '@/features/moderation/components/ModerationAuditLog';
import { getModerationWorkspace } from '@/features/moderation/queries';
import { requireModerator } from '@/lib/auth/session';

export const metadata: Metadata = {
  title: 'Moderation | UniMarket',
  description: 'Secure listing moderation and removal history for UniMarket moderators.',
  robots: { follow: false, index: false },
};

export const dynamic = 'force-dynamic';

type ModerationPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ModerationPage({ searchParams }: ModerationPageProps) {
  const viewer = await requireModerator('/moderation');
  const params = await searchParams;
  const page = parseAuditPage(params.page);
  const data = await getModerationWorkspace(page);

  return (
    <div className="mx-auto max-w-um-content px-4 pb-24 pt-6 sm:px-6 sm:pt-9 lg:px-8 lg:pb-28 lg:pt-12">
      <header className="relative isolate overflow-hidden rounded-um-xl border border-black/10 bg-um-canvas-soft shadow-um-sm">
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-um-gold-500" />
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_21rem]">
          <div className="px-6 pb-8 pt-9 sm:px-9 sm:pb-10 sm:pt-11 lg:px-11 lg:py-12">
            <p className="font-condensed flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-um-gold-700">
              <ShieldCheck aria-hidden="true" className="size-3.5" strokeWidth={2} />
              Moderator workspace
            </p>
            <h1 className="um-balanced mt-5 max-w-4xl text-[clamp(2.65rem,7vw,5.25rem)] font-bold leading-[0.92] tracking-[-0.06em] text-um-text-strong">
              Keep the marketplace useful.
              <span className="mt-1 block text-um-text-muted">Leave a clear record.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-sm leading-7 text-um-text sm:text-base">
              Review current listings in context. When removal is necessary, the database requires a
              reason and writes an audit entry that cannot be edited or deleted.
            </p>
            <Link
              className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-um-sm bg-um-ink-950 px-5 text-sm font-bold text-um-text-inverse shadow-um-xs transition duration-160 ease-um-out hover:-translate-y-0.5 hover:bg-um-ink-850"
              href="/marketplace"
            >
              Review current listings
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </div>

          <aside className="relative hidden overflow-hidden bg-um-ink-950 p-8 text-um-text-inverse lg:flex lg:flex-col lg:justify-between">
            <div>
              <p className="font-condensed text-xs font-bold uppercase tracking-[0.17em] text-um-gold-400">
                Enforcement boundary
              </p>
              <LockKeyhole
                aria-hidden="true"
                className="mt-6 size-11 text-um-gold-400"
                strokeWidth={1.5}
              />
            </div>
            <div className="space-y-4 text-sm leading-6 text-white/65">
              <p className="flex items-start gap-2.5">
                <CircleCheckBig
                  aria-hidden="true"
                  className="mt-1 size-4 shrink-0 text-um-gold-400"
                  strokeWidth={2}
                />
                Private student drafts remain outside moderator view.
              </p>
              <p className="flex items-start gap-2.5">
                <CircleCheckBig
                  aria-hidden="true"
                  className="mt-1 size-4 shrink-0 text-um-gold-400"
                  strokeWidth={2}
                />
                Removal is limited to eligible non-draft listings.
              </p>
            </div>
          </aside>
        </div>
      </header>

      <section aria-labelledby="moderation-overview-heading" className="mt-12 sm:mt-14">
        <div className="mb-5">
          <p className="font-condensed text-xs font-bold uppercase tracking-[0.16em] text-um-text-muted">
            Live overview
          </p>
          <h2
            className="mt-1.5 text-2xl font-bold tracking-[-0.04em] text-um-text-strong sm:text-3xl"
            id="moderation-overview-heading"
          >
            What is available now
          </h2>
        </div>

        <div className="grid divide-y divide-black/10 overflow-hidden rounded-um-lg border border-black/10 bg-um-surface shadow-um-xs md:grid-cols-3 md:divide-x md:divide-y-0">
          <OverviewCard
            description="Published inventory available for direct review."
            icon={Eye}
            label="Current listings"
            value={data.currentListingCount.toLocaleString('en-CA')}
          />
          <OverviewCard
            description="Immutable removal entries written by the database."
            icon={ClipboardList}
            label="Removal records"
            value={data.totalEvents.toLocaleString('en-CA')}
          />
          <OverviewCard
            description="Student report intake and a reports queue are not enabled."
            icon={Inbox}
            label="Report intake"
            value="Not enabled"
          />
        </div>
      </section>

      <section aria-labelledby="moderation-audit-heading" className="mt-14 sm:mt-16 lg:mt-20">
        <div className="mb-6 border-b border-black/10 pb-6 sm:flex sm:items-end sm:justify-between sm:gap-8">
          <div>
            <p className="font-condensed text-xs font-bold uppercase tracking-[0.16em] text-um-gold-700">
              Accountability
            </p>
            <h2
              className="mt-1.5 text-2xl font-bold tracking-[-0.04em] text-um-text-strong sm:text-3xl"
              id="moderation-audit-heading"
            >
              Removal audit
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-um-text-muted">
              Listing titles and reasons are stored as snapshots, so the record remains useful even
              if a listing or account is later deleted.
            </p>
          </div>
          <p className="mt-4 shrink-0 text-xs font-medium text-um-text-muted sm:mt-0">
            Times shown in Waterloo local time
          </p>
        </div>

        <ModerationAuditLog
          currentModeratorId={viewer.id}
          events={data.events}
          page={data.page}
          totalEvents={data.totalEvents}
          totalPages={data.totalPages}
        />
      </section>
    </div>
  );
}

type OverviewCardProps = {
  description: string;
  icon: typeof Eye;
  label: string;
  value: string;
};

function OverviewCard({ description, icon: Icon, label, value }: OverviewCardProps) {
  return (
    <article className="p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <span className="grid size-10 shrink-0 place-items-center rounded-um-md bg-um-surface-warm text-um-text-muted">
          <Icon aria-hidden="true" className="size-[1.15rem]" strokeWidth={1.8} />
        </span>
        <strong className="text-right text-xl font-bold tabular-nums tracking-[-0.035em] text-um-text-strong">
          {value}
        </strong>
      </div>
      <h3 className="mt-5 text-sm font-bold text-um-text-strong">{label}</h3>
      <p className="mt-1.5 text-xs leading-5 text-um-text-muted">{description}</p>
    </article>
  );
}

function parseAuditPage(value: string | string[] | undefined) {
  const firstValue = Array.isArray(value) ? value[0] : value;
  const page = Number.parseInt(firstValue ?? '1', 10);
  return Number.isNaN(page) ? 1 : page;
}
