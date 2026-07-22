import type { Metadata } from 'next';
import { MessageCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Messages',
};

export default function MessagesPage() {
  return (
    <div className="grid min-h-[calc(100dvh-4.35rem)] place-items-center bg-um-canvas px-6 text-center">
      <div>
        <span className="mx-auto grid size-12 place-items-center rounded-full border border-white/[0.1] bg-white/[0.045] text-um-gold-300">
          <MessageCircle className="size-5" aria-hidden="true" />
        </span>
        <h1 className="mt-4 text-xl font-bold tracking-[-0.035em] text-um-text-strong">
          Your messages
        </h1>
      </div>
    </div>
  );
}
