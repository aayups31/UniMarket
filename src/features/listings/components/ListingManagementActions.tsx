'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import Link from 'next/link';
import { Archive, BadgeCheck, Eye, Loader2, Pencil, Trash2, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

import {
  archiveOwnListingAction,
  deleteOwnListingAction,
  markOwnListingSoldAction,
} from '../actions';
import type { ManagedListing } from '../editor-queries';

type ListingManagementActionsProps = {
  listingId: string;
  status: ManagedListing['status'];
  redirectAfterAction?: string;
  showView?: boolean;
};

type Confirmation = 'archive' | 'delete' | 'sold' | null;

const actionClassName =
  'inline-flex min-h-11 items-center justify-center gap-1.5 rounded-um-sm bg-um-surface-warm px-3 text-xs font-semibold text-um-text transition hover:bg-um-ink-950 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-um-ink-950 disabled:cursor-not-allowed disabled:opacity-50';

export function ListingManagementActions({
  listingId,
  status,
  redirectAfterAction,
  showView = true,
}: ListingManagementActionsProps) {
  const router = useRouter();
  const [confirmation, setConfirmation] = useState<Confirmation>(null);
  const [message, setMessage] = useState('');
  const [isPending, startTransition] = useTransition();
  const archiveTriggerRef = useRef<HTMLButtonElement>(null);
  const deleteTriggerRef = useRef<HTMLButtonElement>(null);
  const soldTriggerRef = useRef<HTMLButtonElement>(null);
  const confirmationActionRef = useRef<HTMLButtonElement>(null);
  const restoreFocusRef = useRef<Exclude<Confirmation, null> | null>(null);

  useEffect(() => {
    if (confirmation) {
      confirmationActionRef.current?.focus();
      return;
    }

    const restoreTarget = restoreFocusRef.current;
    if (!restoreTarget) return;

    restoreFocusRef.current = null;
    const trigger =
      restoreTarget === 'archive'
        ? archiveTriggerRef.current
        : restoreTarget === 'sold'
          ? soldTriggerRef.current
          : deleteTriggerRef.current;
    trigger?.focus();
  }, [confirmation]);

  const runAction = (kind: Exclude<Confirmation, null>) => {
    setMessage('');
    startTransition(async () => {
      try {
        const result =
          kind === 'archive'
            ? await archiveOwnListingAction(listingId)
            : kind === 'sold'
              ? await markOwnListingSoldAction(listingId)
              : await deleteOwnListingAction(listingId);

        if (!result.ok) {
          setMessage(result.message);
          return;
        }

        setConfirmation(null);
        setMessage(
          kind === 'archive'
            ? 'Listing archived.'
            : kind === 'sold'
              ? 'Listing marked as sold.'
              : 'Listing deleted.',
        );
        if (redirectAfterAction) {
          router.push(redirectAfterAction);
        } else {
          router.refresh();
        }
      } catch {
        setMessage(
          kind === 'archive'
            ? 'The listing could not be archived. Check your connection and try again.'
            : kind === 'sold'
              ? 'The listing could not be marked as sold. Check your connection and try again.'
              : 'The listing could not be deleted. Check your connection and try again.',
        );
      }
    });
  };

  const requestConfirmation = (kind: Exclude<Confirmation, null>) => {
    setMessage('');
    setConfirmation(kind);
  };

  const cancelConfirmation = () => {
    if (!confirmation) return;
    restoreFocusRef.current = confirmation;
    setConfirmation(null);
  };

  const canEdit = status === 'draft' || status === 'published';
  const canDelete = true;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        {showView && status === 'published' ? (
          <Link className={actionClassName} href={`/listings/${listingId}`}>
            <Eye aria-hidden="true" className="size-3.5" />
            View
          </Link>
        ) : null}

        {canEdit ? (
          <Link className={actionClassName} href={`/listings/${listingId}/edit`}>
            <Pencil aria-hidden="true" className="size-3.5" />
            Edit
          </Link>
        ) : (
          <p className="inline-flex h-9 items-center gap-1.5 text-xs font-semibold text-stone-400">
            {status === 'sold' ? (
              <BadgeCheck aria-hidden="true" className="size-3.5" />
            ) : (
              <Archive aria-hidden="true" className="size-3.5" />
            )}
            {status === 'sold' ? 'Sold' : 'Archived'}
          </p>
        )}

        {status === 'published' && confirmation === null ? (
          <button
            ref={soldTriggerRef}
            className={actionClassName}
            onClick={() => requestConfirmation('sold')}
            type="button"
          >
            <BadgeCheck aria-hidden="true" className="size-3.5" />
            Mark as sold
          </button>
        ) : null}

        {status === 'published' && confirmation === null ? (
          <button
            ref={archiveTriggerRef}
            className={actionClassName}
            onClick={() => requestConfirmation('archive')}
            type="button"
          >
            <Archive aria-hidden="true" className="size-3.5" />
            Archive
          </button>
        ) : null}

        {canDelete && confirmation === null ? (
          <button
            ref={deleteTriggerRef}
            className={`${actionClassName} hover:bg-red-700 hover:text-white`}
            onClick={() => requestConfirmation('delete')}
            type="button"
          >
            <Trash2 aria-hidden="true" className="size-3.5" />
            Delete
          </button>
        ) : null}

        {confirmation ? (
          <div
            aria-label={`Confirm ${confirmation}`}
            className={`flex items-center gap-1.5 rounded-um-sm p-1.5 ${
              confirmation === 'delete' ? 'bg-red-50' : 'bg-um-surface-warm'
            }`}
            onKeyDown={(event) => {
              if (event.key === 'Escape') {
                event.preventDefault();
                cancelConfirmation();
              }
            }}
            role="group"
          >
            <button
              ref={confirmationActionRef}
              className={`inline-flex min-h-11 items-center gap-1 rounded-um-xs px-3 text-xs font-semibold text-white transition disabled:opacity-50 ${
                confirmation === 'delete'
                  ? 'bg-red-700 hover:bg-red-800'
                  : 'bg-um-ink-950 hover:bg-um-ink-800'
              }`}
              disabled={isPending}
              onClick={() => runAction(confirmation)}
              type="button"
            >
              {isPending ? (
                <Loader2 aria-hidden="true" className="size-3 animate-spin" />
              ) : confirmation === 'delete' ? (
                <Trash2 aria-hidden="true" className="size-3" />
              ) : confirmation === 'sold' ? (
                <BadgeCheck aria-hidden="true" className="size-3" />
              ) : (
                <Archive aria-hidden="true" className="size-3" />
              )}
              {confirmation === 'delete'
                ? 'Delete permanently'
                : confirmation === 'sold'
                  ? 'Mark as sold'
                  : 'Archive listing'}
            </button>
            <button
              aria-label={`Cancel ${confirmation}`}
              className="grid size-11 place-items-center rounded-um-xs text-um-text-muted transition hover:bg-white hover:text-um-text-strong disabled:opacity-50"
              disabled={isPending}
              onClick={cancelConfirmation}
              type="button"
            >
              <X aria-hidden="true" className="size-3.5" />
            </button>
          </div>
        ) : null}
      </div>

      <p
        aria-live="polite"
        className={`mt-2 min-h-4 text-xs ${message.startsWith('Listing ') ? 'text-emerald-700' : 'text-red-600'}`}
      >
        {message}
      </p>
    </div>
  );
}
