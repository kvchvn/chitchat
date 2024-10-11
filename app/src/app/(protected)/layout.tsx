import { redirect } from 'next/navigation';
import type React from 'react';
import { ROUTES } from '~/constants/routes';
import { getServerAuthSession } from '~/server/auth';

export default async function ProtectedLayout({ children }: React.PropsWithChildren) {
  const session = await getServerAuthSession();

  if (!session) {
    redirect(ROUTES.signIn);
  }

  return children;
}
