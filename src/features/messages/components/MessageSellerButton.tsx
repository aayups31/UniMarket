'use client';

import { LoaderCircle, MessageCircle } from 'lucide-react';
import { useState } from 'react';

import { cn } from '@/lib/utils';

import { OPEN_MESSAGES_EVENT, type OpenMessagesDetail } from '../events';

type MessageSellerButtonProps = {
  className?: string;
  listingId: string;
};

export function MessageSellerButton({ className, listingId }: MessageSellerButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startConversation = async () => {
    if (loading) return;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/messages/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listingId }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error || 'Messaging is unavailable right now.');
      }

      const payload = (await response.json()) as { conversationId: string };
      window.dispatchEvent(
        new CustomEvent<OpenMessagesDetail>(OPEN_MESSAGES_EVENT, {
          detail: { conversationId: payload.conversationId },
        }),
      );
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Messaging is unavailable right now.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <button
        className={cn(
          'flex min-h-12 w-full items-center justify-center gap-2 rounded-[0.8rem] bg-um-gold-300 px-5 text-sm font-black text-um-ink-950 shadow-[0_14px_36px_rgba(231,188,53,0.12)] transition duration-160 ease-um-out hover:-translate-y-0.5 hover:bg-um-gold-200 disabled:cursor-wait disabled:opacity-70',
          className,
        )}
        disabled={loading}
        onClick={startConversation}
        type="button"
      >
        {loading ? (
          <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
        ) : (
          <MessageCircle className="size-4" aria-hidden="true" />
        )}
        {loading ? 'Opening…' : 'Message seller'}
      </button>
      {error ? (
        <p className="mt-2 text-center text-xs leading-5 text-[#ffb4b8]" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
