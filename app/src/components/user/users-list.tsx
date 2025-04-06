'use client';

import { RefreshCw } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { UserItemMemo } from '~/components/user/user-item';
import { api } from '~/trpc/react';
import { LoadingIcon } from '../ui/loading-icon';
import { UserListSkeleton } from './user-list-skeleton';

export const UsersList = () => {
  const {
    isLoading,
    isFetching,
    isError,
    data: users,
    refetch,
  } = api.users.getAllWithChatPreview.useQuery(undefined, { retry: false });

  const handleClick = () => {
    void refetch();
  };

  if (isLoading) {
    return (
      <ul className="flex flex-col">
        <UserListSkeleton count={5} />
      </ul>
    );
  }

  if (isError || !users) {
    return (
      <div className="flex h-full items-center justify-center">
        <Button onClick={handleClick} size="icon" className="rounded-full">
          {isFetching ? <LoadingIcon /> : <RefreshCw />}
        </Button>
      </div>
    );
  }

  return (
    <ul className="flex flex-col">
      {users.map((user) => (
        <UserItemMemo
          key={user.id}
          id={user.id}
          name={user.name}
          image={user.image}
          lastMessage={user.lastMessage}
          unreadMessagesCount={user.unreadMessagesCount}
          isBlocked={Boolean(user.chat?.blockedBy)}
        />
      ))}
    </ul>
  );
};
