'use client';

import { ErrorBoundary } from '~/components/global/error-boundary';

export default function ChatsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ErrorBoundary error={error} reset={reset} />;
}
