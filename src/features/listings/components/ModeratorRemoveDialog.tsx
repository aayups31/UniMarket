'use client';

import { FormEvent, useEffect, useState, useTransition } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { AlertTriangle, CircleCheck, Loader2, Trash2, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { removeListingAsModeratorAction } from '../actions';

type ModeratorRemoveDialogProps = {
  listingId: string;
  listingTitle: string;
};

type Feedback = { kind: 'idle'; message: '' } | { kind: 'error' | 'success'; message: string };

const MIN_REASON_LENGTH = 10;
const MAX_REASON_LENGTH = 500;

export function ModeratorRemoveDialog({ listingId, listingTitle }: ModeratorRemoveDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [feedback, setFeedback] = useState<Feedback>({ kind: 'idle', message: '' });
  const [isPending, startTransition] = useTransition();
  const trimmedReasonLength = reason.trim().length;
  const succeeded = feedback.kind === 'success';

  useEffect(() => {
    if (!succeeded) return;

    const redirectTimer = window.setTimeout(() => {
      router.replace('/marketplace');
      router.refresh();
    }, 900);

    return () => window.clearTimeout(redirectTimer);
  }, [router, succeeded]);

  const resetDialog = () => {
    setReason('');
    setFeedback({ kind: 'idle', message: '' });
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if ((isPending || succeeded) && !nextOpen) return;
    setOpen(nextOpen);
    if (!nextOpen) resetDialog();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (trimmedReasonLength < MIN_REASON_LENGTH) {
      setFeedback({
        kind: 'error',
        message: `Enter a specific reason using at least ${MIN_REASON_LENGTH} characters.`,
      });
      return;
    }

    setFeedback({ kind: 'idle', message: '' });
    startTransition(async () => {
      const result = await removeListingAsModeratorAction({ listingId, reason });

      if (!result.ok) {
        setFeedback({ kind: 'error', message: result.message });
        return;
      }

      setFeedback({
        kind: 'success',
        message: 'Listing removed. Returning to the marketplace…',
      });
    });
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Trigger asChild>
        <button
          className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-um-sm bg-red-50 px-4 text-sm font-semibold text-red-700 transition hover:bg-red-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2"
          type="button"
        >
          <Trash2 aria-hidden="true" className="h-4 w-4" />
          Remove listing
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-um-ink-950/75 backdrop-blur-[2px] data-[state=closed]:animate-out data-[state=open]:animate-in" />
        <Dialog.Content
          aria-describedby="moderator-remove-description"
          className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-um-md border border-black/10 bg-um-canvas p-6 shadow-2xl focus:outline-none sm:p-7"
        >
          <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-red-700" />
          <div className="flex items-start gap-3.5 pr-10">
            <span className="grid size-10 shrink-0 place-items-center bg-red-100 text-red-700">
              <AlertTriangle aria-hidden="true" className="size-5" />
            </span>
            <div>
              <Dialog.Title className="text-lg font-semibold tracking-[-0.02em] text-um-text-strong">
                Remove this listing?
              </Dialog.Title>
              <Dialog.Description
                id="moderator-remove-description"
                className="mt-1.5 text-sm leading-6 text-um-text-muted"
              >
                “{listingTitle}” will disappear from the marketplace. The reason is saved in the
                moderation audit log.
              </Dialog.Description>
            </div>
          </div>

          <form className="mt-6" onSubmit={handleSubmit}>
            <label
              className="text-sm font-semibold text-um-text-strong"
              htmlFor="moderation-reason"
            >
              Reason for removal
            </label>
            <Textarea
              aria-describedby="moderation-reason-help moderation-reason-count moderator-remove-feedback"
              aria-invalid={feedback.kind === 'error'}
              autoFocus
              className="mt-2 min-h-28 rounded-um-sm border-black/10 bg-um-surface"
              disabled={isPending || succeeded}
              id="moderation-reason"
              maxLength={MAX_REASON_LENGTH}
              onChange={(event) => {
                setReason(event.target.value);
                if (feedback.kind === 'error') {
                  setFeedback({ kind: 'idle', message: '' });
                }
              }}
              placeholder="Explain the policy or safety issue clearly."
              required
              value={reason}
            />
            <div className="mt-1.5 flex items-start justify-between gap-4 text-xs text-um-text-muted">
              <p id="moderation-reason-help">At least {MIN_REASON_LENGTH} characters required.</p>
              <p id="moderation-reason-count" className="tabular-nums">
                {trimmedReasonLength}/{MAX_REASON_LENGTH}
              </p>
            </div>

            <p
              aria-live={feedback.kind === 'error' ? 'assertive' : 'polite'}
              className={`mt-4 min-h-5 text-sm font-medium ${
                feedback.kind === 'error'
                  ? 'text-red-700'
                  : feedback.kind === 'success'
                    ? 'text-emerald-700'
                    : ''
              }`}
              id="moderator-remove-feedback"
              role={feedback.kind === 'error' ? 'alert' : 'status'}
            >
              {feedback.message}
            </p>

            <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Dialog.Close asChild>
                <Button disabled={isPending || succeeded} type="button" variant="secondary">
                  Cancel
                </Button>
              </Dialog.Close>
              <Button
                disabled={
                  isPending ||
                  succeeded ||
                  trimmedReasonLength < MIN_REASON_LENGTH ||
                  trimmedReasonLength > MAX_REASON_LENGTH
                }
                type="submit"
                variant="danger"
              >
                {isPending ? (
                  <Loader2 aria-hidden="true" className="size-4 animate-spin" />
                ) : succeeded ? (
                  <CircleCheck aria-hidden="true" className="size-4" />
                ) : (
                  <Trash2 aria-hidden="true" className="size-4" />
                )}
                {isPending ? 'Removing…' : succeeded ? 'Removed' : 'Remove listing'}
              </Button>
            </div>
          </form>

          <Dialog.Close asChild>
            <button
              aria-label="Close removal dialog"
              className="absolute right-2 top-2 grid size-11 place-items-center rounded-um-sm text-um-text-muted transition hover:bg-um-surface-warm hover:text-um-text-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-um-ink-950 disabled:pointer-events-none disabled:opacity-40 sm:right-3 sm:top-3"
              disabled={isPending || succeeded}
              type="button"
            >
              <X aria-hidden="true" className="size-4" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
