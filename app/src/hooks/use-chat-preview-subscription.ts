import { api } from '~/trpc/react';

type Args = {
  userId: string;
};

export const useChatPreviewSubscription = ({ userId }: Args) => {
  const utils = api.useUtils();

  api.messages.onUpdateChatPreview.useSubscription(
    { userId },
    {
      onData: ({ newPreviewMessage, resetUnreadMessages, senderId, receiverId }) => {
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
              const count = updatingUser.unreadMessagesCount;
              const newCount = resetUnreadMessages ? 0 : count + 1;

              const updatedUser: typeof updatingUser = {
                ...updatingUser,
                unreadMessagesCount: userId !== senderId ? newCount : count,
                lastMessage: newPreviewMessage,
              };

              return staleAllUsers
                .slice(0, index)
                .concat(updatedUser, staleAllUsers.slice(index + 1));
            }
          }

          return staleAllUsers;
        });
      },
    }
  );
};
