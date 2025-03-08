'use client';

import { ChatIsNotCreated } from '~/components/chat/chat-is-not-created';
import { ChatSkeleton } from '~/components/chat/chat-skeleton';
import { ExistingChat } from '~/components/chat/existing-chat';
import { ChatIdProvider } from '~/components/contexts/chat-id-provider';
import { useCompanionId } from '~/hooks/use-companion-id';
import { api } from '~/trpc/react';

type Props = {
  companionName: string;
};

export const ChatWindow = ({ companionName }: Props) => {
  const companionId = useCompanionId();

  const { isError, isLoading, data } = api.chats.getByCompanionId.useQuery(
    { companionId },
    { retry: false, refetchOnMount: 'always' }
  );

  if (isLoading) {
    return <ChatSkeleton />;
  }

  if (isError || !data) {
    return <ChatIsNotCreated companionName={companionName} />;
  }

  return (
    <ChatIdProvider chatId={data.chat.id}>
      <ExistingChat messages={data.messages} />
    </ChatIdProvider>
  );
};
