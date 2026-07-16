import * as React from 'react';
import { cn } from '@/lib/utils';

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<'textarea'>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        'flex min-h-32 w-full resize-y rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-950 shadow-sm outline-none transition placeholder:text-stone-400 focus:border-stone-500 focus:ring-4 focus:ring-stone-950/5 disabled:cursor-not-allowed disabled:bg-stone-100',
        className,
      )}
      {...props}
    />
  ),
);
Textarea.displayName = 'Textarea';
