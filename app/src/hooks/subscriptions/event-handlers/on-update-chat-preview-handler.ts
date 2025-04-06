import { type BaseHandlerArgs } from './types';

export const onUpdateChatPreviewHandler = ({
  utils,
  data,
}: BaseHandlerArgs<'onUpdateChatPreview'>) => {
  // Update (the last) message in the chat preview
  utils.users.getAllWithChatPreview.setData(undefined, (allUsers) => {
    if (allUsers) {
      // update the chat with the sender
      const chatIndex = allUsers.findIndex((user) => user.id === data.chatWithId);
      const currentUser = allUsers[chatIndex];

      if (currentUser) {
        const currentUserCopy = { ...currentUser };

        if (typeof data.previewMessage !== 'undefined') {
          currentUserCopy.lastMessage = data.previewMessage ?? undefined;
        }

        if (currentUserCopy.chat && typeof data.blockedBy !== 'undefined') {
          currentUserCopy.chat = {
            ...currentUserCopy.chat,
            blockedBy: data.blockedBy,
          };
        }

        if (typeof data.unreadMessagesDiff !== 'undefined') {
          // not equal zero, might be positive or negative
          if (data.unreadMessagesDiff) {
            currentUserCopy.unreadMessagesCount += data.unreadMessagesDiff;
          } else {
            currentUserCopy.unreadMessagesCount = 0;
          }
        }

        return allUsers.slice(0, chatIndex).concat(currentUserCopy, allUsers.slice(chatIndex + 1));
      }
    }

    return allUsers;
  });
};
