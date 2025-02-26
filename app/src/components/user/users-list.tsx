'use client';

import { RefreshCw } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { UserItemMemo } from '~/components/user/user-item';
import { useChatPreviewSubscription } from '~/hooks/use-chat-preview-subscription';
import { api } from '~/trpc/react';
import { UserItemSkeleton } from './user-item-skeleton';

type Props = {
  currentUserId: string;
};

export const UsersList = ({ currentUserId }: Props) => {
  const {
    isLoading: isLoadingUsersWithLastMessage,
    isError: isErrorUsersWithLastMessage,
    data: usersWithLastMessage,
    refetch: refetchUsersWithLastMessage,
  } = api.users.getAllWithTheLastMessage.useQuery(undefined, { retry: false });

  const {
    isLoading: isLoadingUsersWithUnreadMessages,
    data: usersWithUnreadMessages,
    refetch: refetchUsersWithUnreadMessages,
  } = api.users.getAllWithSentUnreadMessages.useQuery(undefined, { retry: false });

  useChatPreviewSubscription({ userId: currentUserId });

  const handleClick = () => {
    void refetchUsersWithLastMessage();
    void refetchUsersWithUnreadMessages();
  };

  if (isLoadingUsersWithLastMessage || isLoadingUsersWithUnreadMessages) {
    return (
      <ul className="flex flex-col">
        <UserItemSkeleton count={5} />
      </ul>
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
          currentUserId={currentUserId}
          name={user.name}
          image={user.image}
          lastMessage={user.lastMessage}
          unreadMessagesCount={usersWithUnreadMessages?.[user.id]}
        />
      ))}
    </ul>
  );
};
