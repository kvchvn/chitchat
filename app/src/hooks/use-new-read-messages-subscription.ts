import { api } from '~/trpc/react';

type Args = {
  companionId: string;
};

export const useNewReadMessagesSubscription = ({ companionId }: Args) => {
  const utils = api.useUtils();

  api.messages.onReadMessages.useSubscription(undefined, {
    onData: (messagesIds) => {
      utils.chats.getByCompanionId.setData({ companionId }, (oldData) =>
        oldData
          ? {
              chat: oldData.chat,
              messages: oldData.messages.map((message) => {
                if (message && messagesIds.has(message.id)) {
                  return { ...message, isRead: true };
                }

                return message;
              }),
            }
          : oldData
      );

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
            unreadMessagesCount: count > messagesIds.size ? count - messagesIds.size : 0,
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
