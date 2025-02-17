'use client';

import { api } from '~/trpc/react';
import { ChatIsNotCreated } from './chat-is-not-created';
import { ChatSkeleton } from './chat-skeleton';
import { ExistingChat } from './existing-chat';

type Props = {
  userId: string;
  companionId: string;
  companionName: string;
};

export const ChatWindow = ({ userId, companionId, companionName }: Props) => {
  const { isError, isLoading, data } = api.chats.getByMembersIds.useQuery(
    { userId, companionId },
    { retry: false }
  );

  if (isLoading) {
    return <ChatSkeleton />;
  }

  if (isError || !data) {
    return (
      <ChatIsNotCreated userId={userId} companionId={companionId} companionName={companionName} />
    );
  }

  return (
    <ExistingChat messages={data.messages} chat={{ chatId: data.chat.id, userId, companionId }} />
  );
};
