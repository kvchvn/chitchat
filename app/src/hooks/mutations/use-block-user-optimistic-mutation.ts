import { useUserId } from '~/components/contexts/user-id-provider';
import { api } from '~/trpc/react';
import { useCompanionId } from '../use-companion-id';
import { useToast } from '../use-toast';

export const useBlockUserOptimisticMutation = () => {
  const userId = useUserId();
  const companionId = useCompanionId();
  const utils = api.useUtils();
  const { toast } = useToast();

  return api.chats.toggleBlocking.useMutation({
    onMutate: async () => {
      await Promise.allSettled([
        utils.chats.getByCompanionId.cancel({ companionId }),
        utils.users.getAllWithChatPreview.cancel(),
      ]);

      const previousChat = utils.chats.getByCompanionId.getData({ companionId });
      const previousUsers = utils.users.getAllWithChatPreview.getData();

      // update chat
      utils.chats.getByCompanionId.setData({ companionId }, (staleChat) =>
        staleChat
          ? {
              ...staleChat,
              chat: { ...staleChat.chat, blockedBy: userId },
            }
          : staleChat
      );

      // update chat preview
      utils.users.getAllWithChatPreview.setData(undefined, (staleUsers) => {
        if (staleUsers) {
          const messageReceiverIndex = staleUsers.findIndex((u) => u.id === companionId);

          if (messageReceiverIndex !== -1) {
            const messageReceiver = staleUsers[messageReceiverIndex]!;
            const messageReceiverCopy: typeof messageReceiver = {
              ...messageReceiver,
              chat: messageReceiver.chat
                ? {
                    ...messageReceiver.chat,
                    blockedBy: userId,
                  }
                : messageReceiver.chat,
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
        title: 'User blocking failed',
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
