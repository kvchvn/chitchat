import { generateChatDateKey } from '~/lib/utils';
import { api } from '~/trpc/react';

type Args = {
  companionId: string;
};

export const useNewReadMessagesSubscription = ({ companionId }: Args) => {
  const utils = api.useUtils();

  api.messages.onReadMessages.useSubscription(undefined, {
    onData: (newlyReadMessages) => {
      utils.chats.getByCompanionId.setData({ companionId }, (oldData) => {
        if (oldData) {
          const updatedMessagesMap = new Map(oldData.messagesMap);

          newlyReadMessages.forEach((message) => {
            const dateKey = generateChatDateKey(message.createdAt);

            const dateMessages = updatedMessagesMap.get(dateKey);
            const foundMessage = dateMessages?.find((m) => m.id === message.id);

            if (foundMessage) {
              foundMessage.isRead = true;
            }
          });

          return {
            chat: oldData.chat,
            messagesMap: updatedMessagesMap,
          };
        }

        return oldData;
      });

      // reset indicator at the chat preview
      utils.users.getAllWithChatPreview.setData(undefined, (staleUsers) => {
        if (!staleUsers) {
          return staleUsers;
        }

        const companionIndex = staleUsers.findIndex((u) => u.id === companionId);

        if (companionIndex !== -1 && staleUsers[companionIndex]) {
          const companion = staleUsers[companionIndex];
          const count = companion.unreadMessagesCount;

          const updatedCompanion: typeof companion = {
            ...companion,
            unreadMessagesCount:
              count > newlyReadMessages.length ? count - newlyReadMessages.length : 0,
          };

          return staleUsers
            .slice(0, companionIndex)
            .concat(updatedCompanion, staleUsers.slice(companionIndex + 1));
        }

        return staleUsers;
      });
    },
  });
};
