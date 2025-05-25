import { redirect, RedirectType } from 'next/navigation';
import type React from 'react';
import { ROUTES } from '~/constants/routes';
import { getServerAuthSession } from '~/server/auth';

export default async function PublicLayout({ children }: React.PropsWithChildren) {
  const session = await getServerAuthSession();

  if (session && session.user.hasApprovedName && !session.user.isNewUser) {
    redirect(ROUTES.chats, RedirectType.replace);
  }

  return children;
}
