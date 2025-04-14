import * as React from 'react';

import { cn } from '~/lib/utils';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-md bg-transparent p-1 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-text-light placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-text-light focus-visible:ring-offset-1 dark:focus-visible:ring-slate-400',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
