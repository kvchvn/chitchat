'use client';

import { RefreshCw } from 'lucide-react';
import { useUserId } from '~/components/contexts/user-id-provider';
import { Button } from '~/components/ui/button';
import { UserItemMemo } from '~/components/user/user-item';
import { useChatPreviewSubscription } from '~/hooks/use-chat-preview-subscription';
import { useCompanionId } from '~/hooks/use-companion-id';
import { useRemoveMessagesSubscription } from '~/hooks/use-remove-messages-subscription';
import { api } from '~/trpc/react';
import { UserItemSkeleton } from './user-item-skeleton';

export const UsersList = () => {
  const userId = useUserId();
  const companionId = useCompanionId();

  const {
    isLoading,
    isError,
    data: users,
    refetch,
  } = api.users.getAllWithChatPreview.useQuery(undefined, { retry: false });

  useChatPreviewSubscription({ userId });
  useRemoveMessagesSubscription({ userId, companionId });

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
          name={user.name}
          image={user.image}
          lastMessage={user.lastMessage}
          unreadMessagesCount={user.unreadMessagesCount}
        />
      ))}
    </ul>
  );
};
