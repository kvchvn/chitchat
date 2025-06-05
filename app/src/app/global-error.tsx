'use client';

import { ErrorBoundary } from '~/components/global/error-boundary';
import { cn } from '~/lib/utils';
import { inter } from '~/styles/fonts/font';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html className={cn(inter.variable)}>
      <body className="h-dvh">
        <section className="h-full">
          <ErrorBoundary error={error} reset={reset} />
        </section>
      </body>
    </html>
  );
}
