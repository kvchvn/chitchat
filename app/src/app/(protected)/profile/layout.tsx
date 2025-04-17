import { redirect } from 'next/navigation';
import React from 'react';
import { ProfileNav } from '~/components/profile/profile-nav';
import { ProfilePromo } from '~/components/profile/profile-promo';
import { ROUTES } from '~/constants/routes';
import { getServerAuthSession } from '~/server/auth';

export default async function ProfileLayout({ children }: React.PropsWithChildren) {
  const session = await getServerAuthSession();

  if (!session) {
    redirect(ROUTES.signIn);
  }

  return (
    <section className="flex h-full flex-col gap-24 md:gap-16">
      <ProfilePromo user={session.user} />
      <div className="flex h-full gap-3">
        <ProfileNav />
        {children}
      </div>
    </section>
  );
}
