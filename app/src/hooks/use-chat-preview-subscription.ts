import { api } from '~/trpc/react';

type Args = {
  userId: string;
};

export const useChatPreviewSubscription = ({ userId }: Args) => {
  const utils = api.useUtils();

  api.messages.onUpdateChatPreview.useSubscription(undefined, {
    onData: ({ senderId, receiverId, ...restArgs }) => {
      // Update (the last) message in the chat preview
      utils.users.getAllWithChatPreview.setData(undefined, (staleAllUsers) => {
        if (staleAllUsers) {
          let index = -1;

          if (senderId === userId) {
            // update chat with the message receiver
            index = staleAllUsers.findIndex((user) => user.id === receiverId);
          } else {
            // update chat with the sender
            index = staleAllUsers.findIndex((user) => user.id === senderId);
          }

          const updatingUser = staleAllUsers[index];

          if (updatingUser) {
            const updatedUser = { ...updatingUser };

            if ('newPreviewMessage' in restArgs) {
              // when new message was received or messages were removed
              const count = updatingUser.unreadMessagesCount;
              const newCount = restArgs.resetUnreadMessages ? 0 : count + 1;

              updatedUser.unreadMessagesCount = userId !== senderId ? newCount : count;
              updatedUser.lastMessage = restArgs.newPreviewMessage;
            } else if (updatedUser.chat) {
              // when chat was blocked
              updatedUser.chat = {
                ...updatedUser.chat,
                blockedBy: restArgs.isBlocked ? senderId : null,
              };
            }

            return staleAllUsers
              .slice(0, index)
              .concat(updatedUser, staleAllUsers.slice(index + 1));
          }
        }

        return staleAllUsers;
      });
    },
  });
};
