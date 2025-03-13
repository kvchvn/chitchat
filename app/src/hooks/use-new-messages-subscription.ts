import { generateChatDateKey } from '~/lib/utils';
import { api } from '~/trpc/react';

export const useNewMessagesSubscription = () => {
  const utils = api.useUtils();

  api.messages.onCreateMessage.useSubscription(undefined, {
    onData: (newMessage) => {
      utils.chats.getByCompanionId.setData({ companionId: newMessage.senderId }, (oldData) => {
        if (oldData) {
          const updatedMessagesMap = new Map(oldData.messagesMap);

          const dateKey = generateChatDateKey(newMessage.createdAt);

          if (!updatedMessagesMap.has(dateKey)) {
            updatedMessagesMap.set(dateKey, []);
          }

          updatedMessagesMap.get(dateKey)?.push(newMessage);

          return {
            chat: oldData.chat,
            messagesMap: updatedMessagesMap,
          };
        }

        return oldData;
      });
    },
  });
};
