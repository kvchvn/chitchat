import * as React from 'react';

import { cn } from '~/lib/utils';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-9 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-text-light placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-text-light disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-500 dark:file:text-text-dark dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-400',
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
