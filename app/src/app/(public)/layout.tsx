import { redirect, RedirectType } from 'next/navigation';
import type React from 'react';
import { ROUTES } from '~/constants/routes';
import { getServerAuthSession } from '~/server/auth';

export default async function PublicLayout({ children }: React.PropsWithChildren) {
  const session = await getServerAuthSession();

  if (session) {
    if (!session.user.hasApprovedName) {
      redirect(ROUTES.signInUsername, RedirectType.replace);
    } else if (!session.user.isNewUser) {
      /**
       * if user signs in for the first time (isNewUser = true),
       * the user will be redirected to welcome-page
       */
      redirect(ROUTES.chats, RedirectType.replace);
    }
  }

  return children;
}
