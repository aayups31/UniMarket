'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import Link from 'next/link';
import { Archive, Eye, Loader2, Pencil, Trash2, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { archiveOwnListingAction, deleteOwnListingAction } from '../actions';
import type { ManagedListing } from '../editor-queries';

type ListingManagementActionsProps = {
  listingId: string;
  status: ManagedListing['status'];
};

type Confirmation = 'archive' | 'delete' | null;

const actionClassName =
  'inline-flex min-h-11 items-center justify-center gap-1.5 rounded-lg border border-stone-200 bg-white px-3 text-xs font-semibold text-stone-700 transition hover:border-stone-300 hover:bg-stone-50 hover:text-stone-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 disabled:cursor-not-allowed disabled:opacity-50';

export function ListingManagementActions({ listingId, status }: ListingManagementActionsProps) {
  const router = useRouter();
  const [confirmation, setConfirmation] = useState<Confirmation>(null);
  const [message, setMessage] = useState('');
  const [isPending, startTransition] = useTransition();
  const archiveTriggerRef = useRef<HTMLButtonElement>(null);
  const deleteTriggerRef = useRef<HTMLButtonElement>(null);
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
      restoreTarget === 'archive' ? archiveTriggerRef.current : deleteTriggerRef.current;
    trigger?.focus();
  }, [confirmation]);

  const runAction = (kind: Exclude<Confirmation, null>) => {
    setMessage('');
    startTransition(async () => {
      try {
        const result =
          kind === 'archive'
            ? await archiveOwnListingAction(listingId)
            : await deleteOwnListingAction(listingId);

        if (!result.ok) {
          setMessage(result.message);
          return;
        }

        setConfirmation(null);
        setMessage(kind === 'archive' ? 'Listing archived.' : 'Listing deleted.');
        router.refresh();
      } catch {
        setMessage(
          kind === 'archive'
            ? 'The listing could not be archived. Check your connection and try again.'
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

  const canDelete = status === 'draft' || status === 'archived';

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        {status === 'published' ? (
          <Link className={actionClassName} href={`/listings/${listingId}`}>
            <Eye aria-hidden="true" className="size-3.5" />
            View
          </Link>
        ) : null}

        {status !== 'archived' ? (
          <Link className={actionClassName} href={`/listings/${listingId}/edit`}>
            <Pencil aria-hidden="true" className="size-3.5" />
            Edit
          </Link>
        ) : (
          <p className="inline-flex h-9 items-center gap-1.5 text-xs font-semibold text-stone-400">
            <Archive aria-hidden="true" className="size-3.5" />
            Archived
          </p>
        )}

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
            className={`${actionClassName} hover:border-red-200 hover:bg-red-50 hover:text-red-700`}
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
            className={`flex items-center gap-1.5 rounded-xl p-1.5 ring-1 ${
              confirmation === 'delete' ? 'bg-red-50 ring-red-200' : 'bg-amber-50 ring-amber-200'
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
              className={`inline-flex min-h-11 items-center gap-1 rounded-lg px-3 text-xs font-semibold text-white transition disabled:opacity-50 ${
                confirmation === 'delete'
                  ? 'bg-red-700 hover:bg-red-800'
                  : 'bg-stone-950 hover:bg-stone-800'
              }`}
              disabled={isPending}
              onClick={() => runAction(confirmation)}
              type="button"
            >
              {isPending ? (
                <Loader2 aria-hidden="true" className="size-3 animate-spin" />
              ) : confirmation === 'delete' ? (
                <Trash2 aria-hidden="true" className="size-3" />
              ) : (
                <Archive aria-hidden="true" className="size-3" />
              )}
              {confirmation === 'delete' ? 'Delete permanently' : 'Archive listing'}
            </button>
            <button
              aria-label={`Cancel ${confirmation}`}
              className="grid size-11 place-items-center rounded-lg text-stone-500 transition hover:bg-white hover:text-stone-950 disabled:opacity-50"
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
