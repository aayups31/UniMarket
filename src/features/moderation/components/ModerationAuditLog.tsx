import Link from 'next/link';
import { FileClock, ListRestart, LockKeyhole } from 'lucide-react';

import type { ModerationAuditEvent } from '../queries';

type ModerationAuditLogProps = {
  currentModeratorId: string;
  events: ModerationAuditEvent[];
  page: number;
  totalEvents: number;
  totalPages: number;
};

const auditDateFormatter = new Intl.DateTimeFormat('en-CA', {
  dateStyle: 'medium',
  timeStyle: 'short',
  timeZone: 'America/Toronto',
});

export function ModerationAuditLog({
  currentModeratorId,
  events,
  page,
  totalEvents,
  totalPages,
}: ModerationAuditLogProps) {
  if (totalEvents === 0) {
    return <EmptyAuditLog />;
  }

  if (events.length === 0) {
    return <EmptyAuditPage />;
  }

  return (
    <div>
      <div className="overflow-hidden border-y border-black/10 bg-um-surface shadow-um-xs">
        <div className="border-b border-black/10 bg-um-canvas-soft px-5 py-4 sm:flex sm:items-center sm:justify-between sm:gap-4 sm:px-6">
          <p className="flex items-center gap-2 text-sm font-semibold text-um-text-strong">
            <LockKeyhole aria-hidden="true" className="size-4 text-um-gold-700" strokeWidth={1.9} />
            Database-enforced, append-only history
          </p>
          <p className="mt-1 text-xs tabular-nums text-um-text-muted sm:mt-0">
            {totalEvents} {totalEvents === 1 ? 'record' : 'records'}
          </p>
        </div>

        <div className="divide-y divide-black/10 md:hidden">
          {events.map((event) => (
            <AuditCard currentModeratorId={currentModeratorId} event={event} key={event.id} />
          ))}
        </div>

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[58rem] border-collapse text-left">
            <caption className="sr-only">
              Append-only log of listing removals performed by UniMarket moderators
            </caption>
            <thead>
              <tr className="border-b border-black/10 bg-um-canvas-soft font-condensed text-[0.68rem] font-bold uppercase tracking-[0.13em] text-um-text-muted">
                <th className="px-6 py-3.5" scope="col">
                  Recorded
                </th>
                <th className="px-5 py-3.5" scope="col">
                  Listing
                </th>
                <th className="px-5 py-3.5" scope="col">
                  Action
                </th>
                <th className="px-5 py-3.5" scope="col">
                  Reason
                </th>
                <th className="px-6 py-3.5" scope="col">
                  Moderator
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10">
              {events.map((event) => (
                <tr className="align-top" key={event.id}>
                  <td className="whitespace-nowrap px-6 py-5 text-xs text-um-text-muted">
                    <AuditTime value={event.createdAt} />
                  </td>
                  <td className="max-w-56 px-5 py-5">
                    <p className="line-clamp-2 text-sm font-semibold leading-5 text-um-text-strong">
                      {event.listingTitle}
                    </p>
                    <p className="mt-1.5 font-mono text-[0.65rem] text-um-text-muted">
                      Audit #{event.id}
                      {event.listingId ? ` · Listing ${shortReference(event.listingId)}` : ''}
                    </p>
                  </td>
                  <td className="px-5 py-5">
                    <ActionBadge action={event.action} />
                  </td>
                  <td className="max-w-xl px-5 py-5 text-sm leading-6 text-um-text">
                    {event.reason}
                  </td>
                  <td className="whitespace-nowrap px-6 py-5 text-xs font-medium text-um-text-muted">
                    {moderatorLabel(event.moderatorId, currentModeratorId)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AuditPagination page={page} totalPages={totalPages} />
    </div>
  );
}

function AuditCard({
  currentModeratorId,
  event,
}: {
  currentModeratorId: string;
  event: ModerationAuditEvent;
}) {
  return (
    <article className="p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs text-um-text-muted">
            <AuditTime value={event.createdAt} />
          </p>
          <h3 className="mt-2 text-base font-bold leading-6 text-um-text-strong">
            {event.listingTitle}
          </h3>
        </div>
        <ActionBadge action={event.action} />
      </div>

      <div className="mt-4 border-l-2 border-um-gold-500 bg-um-surface-warm px-4 py-3 text-sm leading-6 text-um-text">
        {event.reason}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-[0.68rem] text-um-text-muted">
        <p className="font-mono">
          Audit #{event.id}
          {event.listingId ? ` · Listing ${shortReference(event.listingId)}` : ''}
        </p>
        <p className="font-medium">{moderatorLabel(event.moderatorId, currentModeratorId)}</p>
      </div>
    </article>
  );
}

function ActionBadge({ action }: { action: ModerationAuditEvent['action'] }) {
  return (
    <span className="inline-flex min-h-7 shrink-0 items-center rounded-full bg-um-danger/10 px-2.5 text-[0.68rem] font-bold text-um-danger">
      {action === 'listing_removed' ? 'Listing removed' : action}
    </span>
  );
}

function AuditTime({ value }: { value: string }) {
  const date = new Date(value);
  const label = Number.isNaN(date.getTime()) ? 'Time unavailable' : auditDateFormatter.format(date);

  return <time dateTime={value}>{label}</time>;
}

function AuditPagination({ page, totalPages }: { page: number; totalPages: number }) {
  if (totalPages <= 1) return null;

  return (
    <nav
      aria-label="Moderation audit pages"
      className="mt-6 flex items-center justify-between gap-4 border-t border-black/10 pt-5"
    >
      {page > 1 ? (
        <Link
          className="inline-flex min-h-11 items-center rounded-um-sm border border-black/10 bg-um-surface px-4 text-sm font-bold text-um-text shadow-um-xs transition-colors duration-160 ease-um-out hover:bg-um-canvas-soft"
          href={auditPageHref(page - 1)}
        >
          Previous
        </Link>
      ) : (
        <span aria-hidden="true" />
      )}

      <p className="text-xs font-medium tabular-nums text-um-text-muted">
        Page {page} of {totalPages}
      </p>

      {page < totalPages ? (
        <Link
          className="inline-flex min-h-11 items-center rounded-um-sm bg-um-ink-950 px-4 text-sm font-bold text-um-text-inverse shadow-um-xs transition-colors duration-160 ease-um-out hover:bg-um-ink-850"
          href={auditPageHref(page + 1)}
        >
          Next
        </Link>
      ) : (
        <span aria-hidden="true" />
      )}
    </nav>
  );
}

function EmptyAuditLog() {
  return (
    <div className="border-y border-black/10 bg-um-surface px-6 py-14 text-center shadow-um-xs sm:py-16">
      <span className="mx-auto grid size-12 place-items-center border-l-2 border-um-gold-500 bg-um-surface-warm text-um-text-muted">
        <FileClock aria-hidden="true" className="size-5" strokeWidth={1.8} />
      </span>
      <h3 className="mt-5 text-xl font-bold tracking-[-0.03em] text-um-text-strong">
        No removal events recorded
      </h3>
      <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-um-text-muted">
        This audit will populate only when a moderator removes a current listing with a recorded
        reason.
      </p>
    </div>
  );
}

function EmptyAuditPage() {
  return (
    <div className="border-y border-black/10 bg-um-surface px-6 py-14 text-center shadow-um-xs sm:py-16">
      <span className="mx-auto grid size-12 place-items-center border-l-2 border-um-gold-500 bg-um-surface-warm text-um-text-muted">
        <ListRestart aria-hidden="true" className="size-5" strokeWidth={1.8} />
      </span>
      <h3 className="mt-5 text-xl font-bold tracking-[-0.03em] text-um-text-strong">
        That audit page is empty
      </h3>
      <p className="mt-2 text-sm leading-6 text-um-text-muted">
        Return to the beginning of the removal history.
      </p>
      <Link
        className="mt-6 inline-flex min-h-11 items-center rounded-um-sm bg-um-ink-950 px-5 text-sm font-bold text-um-text-inverse transition-colors duration-160 ease-um-out hover:bg-um-ink-850"
        href="/moderation"
      >
        First audit page
      </Link>
    </div>
  );
}

function moderatorLabel(moderatorId: string | null, currentModeratorId: string) {
  if (!moderatorId) return 'Account unavailable';
  if (moderatorId === currentModeratorId) return 'You';
  return `Moderator ${shortReference(moderatorId)}`;
}

function shortReference(value: string) {
  return `…${value.slice(-6)}`;
}

function auditPageHref(page: number) {
  return page <= 1 ? '/moderation' : `/moderation?page=${page}`;
}
