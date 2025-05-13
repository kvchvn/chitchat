import React from 'react';
import { ProfileNav } from '~/components/profile/profile-nav';
import { ProfilePromo } from '~/components/profile/profile-promo';

export default async function ProfileLayout({ children }: React.PropsWithChildren) {
  return (
    <section className="flex h-full flex-col gap-24 lg:gap-16">
      <ProfilePromo />
      <div className="relative flex h-full gap-4 lg:gap-8">
        <ProfileNav />
        {children}
      </div>
    </section>
  );
}
