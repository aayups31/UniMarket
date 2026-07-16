import * as React from 'react';
import { cn } from '@/lib/utils';

export const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, type, ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(
        'flex h-12 w-full rounded-xl border border-stone-200 bg-white px-4 text-sm text-stone-950 shadow-sm outline-none transition placeholder:text-stone-400 focus:border-stone-500 focus:ring-4 focus:ring-stone-950/5 disabled:cursor-not-allowed disabled:bg-stone-100 disabled:text-stone-500',
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = 'Input';
