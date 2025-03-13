'use client';

import { useEffect } from 'react';
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
  const utils = api.useUtils();

  const { isError, isPending, data, isSuccess } = api.chats.getByCompanionId.useQuery(
    { companionId },
    { retry: false, refetchOnMount: 'always' }
  );

  useEffect(() => {
    /**
     * reset the chat's cache on unmount
     * in order to load the freshest data on the next mount
     */
    if (isSuccess) {
      return () => {
        void utils.chats.getByCompanionId.reset({ companionId });
      };
    }
  }, [isSuccess, utils.chats.getByCompanionId, companionId]);

  if (isPending) {
    return <ChatSkeleton />;
  }

  if (isError || !data) {
    return <ChatIsNotCreated companionName={companionName} />;
  }

  return (
    <ChatIdProvider chatId={data.chat.id}>
      <ExistingChat messagesMap={data.messagesMap} blockedBy={data.chat.blockedBy} />
    </ChatIdProvider>
  );
};
