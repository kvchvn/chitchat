import { api } from '~/trpc/react';

type Args = {
  companionId: string;
};

export const useRemoveMessagesSubscription = ({ companionId }: Args) => {
  const utils = api.useUtils();

  api.messages.onRemoveMessages.useSubscription(undefined, {
    onData: () => {
      utils.chats.getByCompanionId.setData({ companionId }, (staleChat) => {
        return staleChat
          ? {
              chat: staleChat.chat,
              messages: [],
            }
          : staleChat;
      });
    },
  });
};
