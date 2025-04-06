import { useCompanionId } from '~/hooks/use-companion-id';
import { useToast } from '~/hooks/use-toast';
import { api } from '~/trpc/react';

export const useClearMessagesOptimisticMutation = () => {
  const companionId = useCompanionId();

  const utils = api.useUtils();
  const { toast } = useToast();

  return api.messages.clearAllFromChat.useMutation({
    onMutate: async () => {
      await Promise.allSettled([
        utils.chats.getByCompanionId.cancel({ companionId }),
        utils.users.getAllWithChatPreview.cancel(),
      ]);

      const previousChat = utils.chats.getByCompanionId.getData({ companionId });
      const previousUsers = utils.users.getAllWithChatPreview.getData();

      // update current chat
      utils.chats.getByCompanionId.setData({ companionId }, (staleChat) =>
        staleChat
          ? {
              ...staleChat,
              messagesMap: new Map(),
            }
          : staleChat
      );

      utils.users.getAllWithChatPreview.setData(undefined, (staleUsers) => {
        if (staleUsers) {
          const messageReceiverIndex = staleUsers.findIndex((u) => u.id === companionId);

          if (messageReceiverIndex !== -1) {
            const messageReceiver = staleUsers[messageReceiverIndex]!;
            const messageReceiverCopy: typeof messageReceiver = {
              ...messageReceiver,
              lastMessage: undefined,
              unreadMessagesCount: 0,
            };

            return staleUsers
              .slice(0, messageReceiverIndex)
              .concat(messageReceiverCopy, staleUsers.slice(messageReceiverIndex + 1));
          }
        }

        return staleUsers;
      });

      return { previousChat, previousUsers };
    },
    onError: (_, __, ctx) => {
      utils.chats.getByCompanionId.setData({ companionId }, ctx?.previousChat);
      utils.users.getAllWithChatPreview.setData(undefined, ctx?.previousUsers);

      toast({
        variant: 'destructive',
        title: 'Clearing the chat failed',
        description: 'Something went wrong. Please try again later',
      });
    },
    onSettled: () => {
      void Promise.allSettled([
        utils.chats.getByCompanionId.invalidate({ companionId }),
        utils.users.getAllWithChatPreview.invalidate(),
      ]);
    },
  });
};
