'use client';

import { RefreshCw } from 'lucide-react';
import { LoadingIcon } from '~/components/ui/loading-icon';
import { UserItemMemo } from '~/components/user/user-item';
import { api } from '~/trpc/react';
import { Button } from '../ui/button';

type Props = {
  currentUserId: string;
};

export const UsersList = ({ currentUserId }: Props) => {
  const {
    isLoading: isLoadingUsersWithLastMessage,
    isError: isErrorUsersWithLastMessage,
    data: usersWithLastMessage,
    refetch: refetchUsersWithLastMessage,
  } = api.users.getAllWithTheLastMessage.useQuery(undefined, {
    retry: false,
  });

  const {
    isLoading: isLoadingUsersWithUnreadMessages,
    data: usersWithUnreadMessages,
    refetch: refetchUsersWithUnreadMessages,
  } = api.users.getAllWithSentUnreadMessages.useQuery(undefined, { retry: false });

  const handleClick = () => {
    void refetchUsersWithLastMessage();
    void refetchUsersWithUnreadMessages();
  };

  if (isLoadingUsersWithLastMessage || isLoadingUsersWithUnreadMessages) {
    return (
      <div className="flex h-full items-center justify-center">
        <LoadingIcon className="h-6 w-6" strokeWidth={2} />
      </div>
    );
  }

  if (isErrorUsersWithLastMessage || !usersWithLastMessage) {
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
      {usersWithLastMessage.map((user) => (
        <UserItemMemo
          key={user.id}
          id={user.id}
          isCurrentUser={currentUserId === user.id}
          name={user.name}
          image={user.image}
          lastMessage={user.lastMessage}
          unreadMessagesCount={usersWithUnreadMessages?.[user.id]}
        />
      ))}
    </ul>
  );
};
