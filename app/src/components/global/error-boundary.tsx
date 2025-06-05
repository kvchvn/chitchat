'use client';

import * as Sentry from '@sentry/nextjs';
import { Construction, RefreshCcw } from 'lucide-react';
import { useEffect } from 'react';
import { Button } from '~/components/ui/button';
import { cn } from '~/lib/utils';

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
  className?: string;
};

export const ErrorBoundary = ({ error, reset, className }: Props) => {
  useEffect(() => {
    Sentry.captureException(error, { level: 'fatal' });
  }, [error]);

  return (
    <div
      className={cn(
        'mx-auto flex h-full max-w-96 flex-col items-center justify-center gap-4 text-balance text-center',
        className
      )}>
      <Construction className="h-20 w-20 -skew-x-6" strokeWidth={1} />
      <h2>Something went wrong!</h2>
      <p>We have already received the issue report and will try to fix it as soon as possible</p>
      <Button onClick={reset}>
        <RefreshCcw />
        Try again
      </Button>
    </div>
  );
};
