'use client';

import { ErrorBoundary } from '~/components/global/error-boundary';

export default function PublicError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ErrorBoundary error={error} reset={reset} className="mt-48" />;
}
