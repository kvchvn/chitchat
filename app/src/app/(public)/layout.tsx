import { redirect } from 'next/navigation';
import type React from 'react';
import { ROUTES } from '~/constants/routes';
import { getServerAuthSession } from '~/server/auth';

export default async function PublicLayout({ children }: React.PropsWithChildren) {
  const session = await getServerAuthSession();

  /**
   * if user signs in for the first time (isNewUser = true),
   * the user will be redirected to welcome-page
   */
  if (session && !session.user.isNewUser) {
    redirect(ROUTES.chats);
  }

  return children;
}
