import * as React from 'react';
import { cn } from '@/lib/utils';

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<'textarea'>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        'flex min-h-32 w-full resize-y rounded-um-sm border border-black/[0.08] bg-um-canvas-soft px-4 py-3 text-sm text-um-text-strong shadow-um-xs outline-none transition duration-160 placeholder:text-um-text-muted/70 focus:border-um-gold-500/70 focus:bg-um-surface focus:ring-4 focus:ring-um-gold-400/10 disabled:cursor-not-allowed disabled:bg-um-surface-warm',
        className,
      )}
      {...props}
    />
  ),
);
Textarea.displayName = 'Textarea';
