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
    isLoading,
    isError,
    data: users,
    refetch,
  } = api.users.getAllWithChatPreview.useQuery(undefined, { retry: false });

  useChatPreviewSubscription({ userId: currentUserId });

  const handleClick = () => {
    void refetch();
  };

  if (isLoading) {
    return (
      <ul className="flex flex-col">
        <UserItemSkeleton count={5} />
      </ul>
    );
  }

  if (isError || !users) {
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
      {users.map((user) => (
        <UserItemMemo
          key={user.id}
          id={user.id}
          currentUserId={currentUserId}
          name={user.name}
          image={user.image}
          lastMessage={user.lastMessage}
          unreadMessagesCount={user.unreadMessagesCount}
        />
      ))}
    </ul>
  );
};
