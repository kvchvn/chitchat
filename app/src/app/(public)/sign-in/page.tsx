import { getProviders } from 'next-auth/react';
import Link from 'next/link';
import { Providers } from './_components/providers';
import { ProvidersFetchError } from './_components/providers-fetch-error';

export default async function SignInPage() {
  const providers = await getProviders();

  if (!providers) {
    return <ProvidersFetchError />;
  }

  return (
    <>
      <h1>Sign in to your account</h1>
      <h3>Choose your preferred sign in method</h3>
      <Providers providers={providers} />
      <p className="text-sm text-gray-400 dark:text-gray-500">
        By signing in, you agree our{' '}
        <Link href="/terms" className="link">
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link href="/privacy" className="link">
          Privacy Policy
        </Link>
        .
      </p>
    </>
  );
}
