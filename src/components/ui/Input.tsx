import * as React from 'react';
import { cn } from '@/lib/utils';

export const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, type, ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(
        'flex h-12 w-full rounded-um-sm border border-black/[0.08] bg-um-canvas-soft px-4 text-sm text-um-text-strong shadow-um-xs outline-none transition duration-160 placeholder:text-um-text-muted/70 focus:border-um-gold-500/70 focus:bg-um-surface focus:ring-4 focus:ring-um-gold-400/10 disabled:cursor-not-allowed disabled:bg-um-surface-warm disabled:text-um-text-muted',
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = 'Input';
