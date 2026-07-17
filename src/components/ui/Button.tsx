import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-um-sm text-sm font-semibold tracking-[-0.01em] transition-all duration-160 ease-um-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-um-gold-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'bg-um-ink-950 text-um-text-inverse shadow-um-xs hover:-translate-y-0.5 hover:bg-um-ink-800 hover:shadow-um-sm',
        gold: 'bg-um-gold-400 text-um-ink-1000 shadow-um-xs hover:-translate-y-0.5 hover:bg-um-gold-300 hover:shadow-um-gold',
        secondary:
          'border border-black/[0.08] bg-um-surface text-um-text-strong shadow-um-xs hover:bg-um-surface-warm',
        ghost: 'text-um-text hover:bg-black/[0.05] hover:text-um-text-strong',
        danger: 'bg-um-danger text-white shadow-um-xs hover:bg-red-700',
      },
      size: {
        sm: 'h-9 px-3',
        md: 'h-11 px-5',
        lg: 'h-12 px-6 text-base',
        icon: 'size-10',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({ className, variant, size, asChild, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : 'button';
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

export { buttonVariants };
