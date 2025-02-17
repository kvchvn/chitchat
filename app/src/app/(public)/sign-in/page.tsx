import { getProviders } from 'next-auth/react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { AuthProviders } from '~/components/auth/auth-providers';
import { AuthProvidersFetchError } from '~/components/auth/auth-providers-fetch-error';
import { ROUTES } from '~/constants/routes';

type Props = {
  searchParams: Record<string, string>;
};

export default async function SignInPage({ searchParams }: Props) {
  if ('error' in searchParams) {
    const sp = new URLSearchParams({ error: searchParams.error });
    redirect(`${ROUTES.signInError}?${sp.toString()}`);
  }

  const providers = await getProviders();

  if (!providers) {
    return <AuthProvidersFetchError />;
  }

  return (
    <>
      <h1>Sign in to your account</h1>
      <h3>Choose your preferred sign in method</h3>
      <AuthProviders providers={providers} />
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
