import { api } from '~/trpc/react';
import { useCompanionId } from '../use-companion-id';

export const useReadNewMessagesOptimisticMutation = () => {
  const utils = api.useUtils();
  const companionId = useCompanionId();

  return api.messages.readUnreadMessages.useMutation({
    onMutate: async (data) => {
      // no need to update current chat (just invalidation will be performed)
      // only unread messages indicator (badge) will be updated (decreased) optimistically

      await utils.users.getAllWithChatPreview.cancel();

      const previousUsers = utils.users.getAllWithChatPreview.getData();

      utils.users.getAllWithChatPreview.setData(undefined, (staleUsers) => {
        if (staleUsers) {
          const messagesSenderIndex = staleUsers.findIndex((u) => u.id === data.senderId);

          if (messagesSenderIndex !== -1) {
            const messagesSender = staleUsers[messagesSenderIndex]!;
            const messageSenderCopy: typeof messagesSender = {
              ...messagesSender,
              unreadMessagesCount: messagesSender.unreadMessagesCount - data.messagesIds.length,
            };

            return staleUsers
              .slice(0, messagesSenderIndex)
              .concat(messageSenderCopy, staleUsers.slice(messagesSenderIndex + 1));
          }
        }

        return staleUsers;
      });

      return { previousUsers };
    },
    onError: (_, __, ctx) => {
      utils.users.getAllWithChatPreview.setData(undefined, ctx?.previousUsers);
    },
    onSettled: () => {
      void Promise.allSettled([
        utils.users.getAllWithChatPreview.invalidate(),
        utils.chats.getByCompanionId.invalidate({ companionId }),
      ]);
    },
  });
};
