import { redirect } from 'next/navigation';
import type React from 'react';
import { Wrapper } from '~/components/ui/wrapper';
import { ROUTES } from '~/constants/routes';
import { getServerAuthSession } from '~/server/auth';
import { Header } from './_components/header';

export default async function ProtectedLayout({ children }: React.PropsWithChildren) {
  const session = await getServerAuthSession();

  if (!session) {
    redirect(ROUTES.signIn);
  }

  return (
    <>
      <Header />
      <main className="flex grow items-stretch bg-background-light py-6 dark:bg-background-dark">
        <Wrapper>{children}</Wrapper>
      </main>
    </>
  );
}
