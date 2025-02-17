'use client';

import { RefreshCw } from 'lucide-react';
import { LoadingIcon } from '~/components/ui/loading-icon';
import { UserItemMemo } from '~/components/user/user-item';
import { api } from '~/trpc/react';
import { Button } from '../ui/button';

export const UsersList = () => {
  const {
    isLoading,
    isError,
    data: allUsers,
    refetch,
  } = api.users.getAll.useQuery(undefined, {
    retry: false,
  });

  const handleClick = async () => {
    await refetch();
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <LoadingIcon className="h-8 w-8" />
      </div>
    );
  }

  if (isError || !allUsers) {
    return (
      <div className="flex h-full items-center justify-center">
        <Button onClick={handleClick} size="icon" className="rounded-full">
          <RefreshCw />
        </Button>
      </div>
    );
  }

  return (
    <ul className="flex flex-col">
      {allUsers.map((user) => (
        <UserItemMemo key={user.id} id={user.id} name={user.name} image={user.image} />
      ))}
    </ul>
  );
};
