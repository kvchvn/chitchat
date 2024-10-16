import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '~/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center w-fit text-text-light rounded-full border dark:text-text-dark px-2 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary-light hover:bg-primary-hover-light dark:bg-primary-dark dark:hover:bg-primary-hover-dark',
        outline:
          'bg-transparent text-text-light border border-primary-light hover:border-primary-hover-light dark:border-primary-dark dark:text-text-dark dark:hover:bg-background-dark',
        destructive:
          'border-transparent bg-error-light hover:bg-error-hover-light dark:bg-error-dark dark:hover:bg-error-hover-dark',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
