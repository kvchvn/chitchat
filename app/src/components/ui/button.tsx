import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '~/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center tracking-wider leading-[1em] justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 focus-ring-default',
  {
    variants: {
      variant: {
        default:
          'bg-primary-light text-text-light shadow hover:bg-primary-hover-light active:bg-primary-active-light dark:bg-primary-dark dark:hover:bg-primary-hover-dark dark:active:bg-primary-active-dark dark:text-text-dark',
        destructive:
          'bg-error-light text-text-light shadow-sm hover:bg-error-hover-light active:bg-error-active-light dark:bg-error-dark dark:hover:bg-error-hover-dark dark:active:bg-error-active-dark dark:text-text-dark',
        outline:
          'border border-gray-light bg-background-light shadow-sm hover:bg-muted-light hover:text-text-light dark:border-gray-dark dark:bg-background-dark dark:hover:bg-muted-dark dark:hover:text-text-dark',
        secondary:
          'bg-secondary-light text-text-light shadow-sm hover:bg-secondary-hover-light dark:bg-secondary-dark dark:text-text-dark dark:hover:bg-secondary-hover-dark',
        ghost:
          'hover:bg-muted-light hover:text-text-light dark:hover:bg-muted-dark dark:hover:text-text-dark',
        link: 'text-text-light underline-offset-4 hover:underline dark:text-text-dark',
        transparent:
          'bg-transparent border border-transparent hover:border-text-light active:border-text-light dark:hover:border-text-dark dark:active:border-text-dark',
      },
      size: {
        default: 'h-10 px-4 py-2 text-base',
        xs: 'h-8 rounded-md px-4 text-xs',
        sm: 'h-9 rounded-md px-4 text-sm',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-9 w-9',
        'icon-sm': 'h-8 w-8',
        'icon-lg': 'h-10 w-10',
        'icon-xs': 'h-6 w-6',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      fullWidth: false,
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className, fullWidth }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
