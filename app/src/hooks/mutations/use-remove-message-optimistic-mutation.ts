import { type ChatMessage } from '~/server/db/schema/messages';
import { api } from '~/trpc/react';
import { useCompanionId } from '../use-companion-id';
import { toast } from '../use-toast';

export const useRemoveMessageOptimisticMutation = () => {
  const utils = api.useUtils();
  const companionId = useCompanionId();

  return api.messages.remove.useMutation({
    onMutate: async (data) => {
      await Promise.allSettled([
        utils.chats.getByCompanionId.cancel({ companionId }),
        utils.users.getAllWithChatPreview.cancel(),
      ]);

      const previousChat = utils.chats.getByCompanionId.getData({ companionId });
      const previousUsers = utils.users.getAllWithChatPreview.getData();

      let newLastMessage: ChatMessage | null = null;

      // update current chat
      utils.chats.getByCompanionId.setData({ companionId }, (staleChat) => {
        if (staleChat) {
          const updatedMessagesMap = new Map(staleChat.messagesMap);
          const messagesByDate = updatedMessagesMap.get(data.dateKey);
          const allFlatMessages = Object.values(
            Object.fromEntries(updatedMessagesMap.entries())
          ).flat();
          const isLastMessage = allFlatMessages.at(-1)?.id === data.id;

          if (isLastMessage) {
            newLastMessage = allFlatMessages.at(-2) ?? null;
          }

          if (messagesByDate) {
            const removingMessageIndex = messagesByDate.findIndex((m) => m.id === data.id);

            if (removingMessageIndex !== -1) {
              messagesByDate.splice(removingMessageIndex, 1);

              if (!messagesByDate.length) {
                updatedMessagesMap.delete(data.dateKey);
              }

              return {
                ...staleChat,
                messagesMap: updatedMessagesMap,
              };
            }
          }
        }

        return staleChat;
      });

      // update current chat preview
      utils.users.getAllWithChatPreview.setData(undefined, (staleUsers) => {
        if (staleUsers && newLastMessage) {
          const messageReceiverIndex = staleUsers.findIndex((u) => u.id === data.receiverId);

          if (messageReceiverIndex !== -1) {
            const messageReceiver = staleUsers[messageReceiverIndex]!;
            const messageReceiverCopy: typeof messageReceiver = {
              ...messageReceiver,
              lastMessage: newLastMessage,
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
        title: 'Removing the message failed',
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
