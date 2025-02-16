import { api } from '~/trpc/react';

type Args = {
  userId: string;
  companionId: string;
};

export const useNewReadMessagesSubscription = ({ userId, companionId }: Args) => {
  const utils = api.useUtils();

  api.messages.onReadMessages.useSubscription(undefined, {
    onData: (messagesIds) => {
      utils.chats.getByMembersIds.setData({ userId, companionId }, (oldData) =>
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
    },
  });
};
