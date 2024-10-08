import { getProviders } from 'next-auth/react';
import Link from 'next/link';
import { Providers } from './_components/providers';
import { ProvidersFetchError } from './_components/providers-fetch-error';
import { ThemeToggler } from './_components/theme-toggler';

export default async function SignInPage() {
  const providers = await getProviders();

  return (
    <main className="relative flex h-dvh items-center justify-center overflow-y-hidden bg-background-light dark:bg-background-dark">
      <section className="xs:max-w-[420px] xs:px-14 xs:py-10 mx-4 flex max-w-full flex-col items-center gap-6 rounded-xl border border-gray-light bg-white px-6 py-12 text-center dark:border-transparent dark:bg-gray-950 dark:text-text-dark">
        {providers ? (
          <>
            <h1 className="title font-title">Sign in to your account</h1>
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
        ) : (
          <ProvidersFetchError />
        )}
      </section>
      <ThemeToggler />
    </main>
  );
}
