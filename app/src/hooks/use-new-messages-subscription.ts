import { api } from '~/trpc/react';

export const useNewMessagesSubscription = () => {
  const utils = api.useUtils();

  api.messages.onCreateMessage.useSubscription(undefined, {
    onData: (newMessage) => {
      utils.chats.getByCompanionId.setData({ companionId: newMessage.senderId }, (oldData) =>
        oldData
          ? {
              chat: oldData.chat,
              messages: [...oldData.messages, newMessage],
            }
          : oldData
      );
    },
  });
};
