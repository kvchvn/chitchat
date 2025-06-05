'use client';

import { ErrorBoundary } from '~/components/global/error-boundary';

export default function SignInError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ErrorBoundary error={error} reset={reset} className="py-10" />;
}
