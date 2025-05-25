'use client';

import { cn } from '~/lib/utils';
import { api } from '~/trpc/react';
import { Skeleton } from '../ui/skeleton';

export const ProfilePromoName = () => {
  const { data: user, isLoading } = api.users.getCurrent.useQuery();

  if (isLoading) {
    return <Skeleton className="ml-auto mr-auto h-[3.75rem] w-96 max-w-full lg:mr-0" />;
  }

  const name = user?.name ?? 'Profile';

  return (
    <h1
      className={cn(
        'ml-auto max-w-full break-words text-center text-5xl tracking-wide lg:max-w-[70%] lg:text-right',
        {
          'text-4xl': name.length > 20,
          'text-5xl sm:text-6xl': name.length <= 20,
        }
      )}>
      {name}
    </h1>
  );
};
