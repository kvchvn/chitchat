import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '~/lib/utils';

const inputVariants = cva(
  'p-1 flex h-10 rounded-md shadow-sm w-full text-sm transition-colors placeholder:text-slate-400 focus-ring-default',
  {
    variants: {
      variant: {
        default: 'bg-transparent',
        primary: 'bg-slate-200 px-2 tracking-wider border border-transparent dark:bg-slate-600',
      },
      file: {
        true: 'cursor-pointer focus-within:outline-none focus-within:ring-1 focus-within:ring-neutral-950 focus-within:ring-offset-1 dark:focus-within:ring-neutral-300',
        false:
          'read-only:bg-slate-300 read-only:border-slate-400 dark:read-only:bg-slate-700 read-only:border-dashed',
      },
      disabled: {
        true: 'bg-slate-300 border-slate-400 border-dashed',
      },
      withError: {
        true: 'border-error-light dark:border-error-dark bg-error-light/5 dark:bg-error-dark/10',
      },
    },
    defaultVariants: {
      variant: 'default',
      file: false,
      disabled: false,
      withError: false,
    },
  }
);

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> &
  VariantProps<typeof inputVariants> & {
    withError?: boolean;
    postfix?: React.ReactElement;
    suffix?: React.ReactElement;
  };

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant, suffix, postfix, withError, ...props }, ref) => {
    return (
      <>
        {suffix}
        <input
          type={type}
          className={cn(inputVariants({ variant, withError: withError }), className)}
          ref={ref}
          {...props}
        />
        {postfix}
      </>
    );
  }
);

Input.displayName = 'Input';

const InputFile = React.forwardRef<HTMLInputElement, Omit<InputProps, 'type'>>(
  ({ className, variant, children, ...props }, ref) => {
    return (
      <label
        className={cn(inputVariants({ variant, file: true, disabled: props.disabled }), className)}>
        <input type="file" className="h-0 w-0 opacity-0" ref={ref} {...props} />
        {children}
      </label>
    );
  }
);

InputFile.displayName = 'InputFile';

export { Input, InputFile };

