import { api } from '~/trpc/react';

type Args = {
  userId: string;
};

export const useChatPreviewSubscription = ({ userId }: Args) => {
  const utils = api.useUtils();

  api.messages.onUpdateChatPreview.useSubscription(
    { userId },
    {
      onData: (newLastMessage) => {
        // Update (the last) message in the chat preview
        utils.users.getAllWithTheLastMessage.setData(undefined, (staleAllUsers) => {
          if (staleAllUsers) {
            let index = -1;

            if (newLastMessage.senderId === userId) {
              // update chat with the message receiver
              index = staleAllUsers.findIndex((user) => user.id === newLastMessage.receiverId);
            } else {
              // update chat with the sender
              index = staleAllUsers.findIndex((user) => user.id === newLastMessage.senderId);
            }

            const updatingUser = staleAllUsers[index];

            if (updatingUser) {
              updatingUser.lastMessage = {
                id: newLastMessage.id,
                createdAt: newLastMessage.createdAt,
                text: newLastMessage.text,
                senderId: newLastMessage.senderId,
                receiverId: newLastMessage.receiverId,
              };

              return staleAllUsers
                .slice(0, index)
                .concat(updatingUser, staleAllUsers.slice(index + 1));
            }
          }

          return staleAllUsers;
        });

        // Update unread messages indicator
        utils.users.getAllWithSentUnreadMessages.setData(undefined, (staleCountsRecord) => {
          if (staleCountsRecord && newLastMessage.senderId in staleCountsRecord) {
            let count = staleCountsRecord[newLastMessage.senderId] ?? 0;

            return { ...staleCountsRecord, [newLastMessage.senderId]: count + 1 };
          }

          return staleCountsRecord;
        });
      },
    }
  );
};
