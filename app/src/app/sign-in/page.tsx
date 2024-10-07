import { getProviders } from 'next-auth/react';
import { Providers } from './_components/providers';

export default async function SignInPage() {
  const providers = await getProviders();

  console.log(providers);

  if (!providers) {
  } else {
    return (
      <main className="flex h-dvh items-center justify-center overflow-y-hidden">
        <section className="flex flex-col items-center gap-6 rounded-xl border border-gray-light px-14 py-10">
          <h1 className="title font-title">Sign in to your account</h1>
          <h3>Choose your preferred sign in method</h3>
          <Providers providers={providers} />
        </section>
      </main>
    );
  }
}
