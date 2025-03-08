import { api } from '~/trpc/react';

type Args = {
  userId: string;
  companionId: string;
};

export const useRemoveMessagesSubscription = ({ userId, companionId }: Args) => {
  const utils = api.useUtils();

  api.messages.onRemoveMessages.useSubscription(
    { userId },
    {
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
    }
  );
};
