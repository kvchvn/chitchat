import { redirect } from 'next/navigation';
import type React from 'react';
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
      <main className="bg-background-light py-6 dark:bg-background-dark">{children}</main>
      <footer></footer>
    </>
  );
}
