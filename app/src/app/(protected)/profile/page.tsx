'use client';

import { NotFoundProfile } from '~/components/profile/not-found-profile';
import { ProfileForm } from '~/components/profile/profile-form';
import { ProfileFormSkeleton } from '~/components/profile/profile-form-skeleton';
import { api } from '~/trpc/react';

export default function ProfilePage() {
  const { data: user, isLoading } = api.users.getCurrent.useQuery();

  if (isLoading) {
    return <ProfileFormSkeleton />;
  }

  if (!user) {
    return <NotFoundProfile />;
  }

  return <ProfileForm user={user} />;
}
