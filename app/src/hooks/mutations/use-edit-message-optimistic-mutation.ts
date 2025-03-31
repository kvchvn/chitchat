import { useCompanionId } from '~/hooks/use-companion-id';
import { useToast } from '~/hooks/use-toast';
import { api } from '~/trpc/react';

type Args = {
  onMutateSideEffect: () => void;
};

export const useEditMessageOptimisticMutation = ({ onMutateSideEffect }: Args) => {
  const companionId = useCompanionId();

  const utils = api.useUtils();
  const { toast } = useToast();

  return api.messages.edit.useMutation({
    onMutate: async (newMessageData) => {
      await Promise.allSettled([
        utils.chats.getByCompanionId.cancel({ companionId }),
        utils.users.getAllWithChatPreview.cancel(),
      ]);

      const previousChat = utils.chats.getByCompanionId.getData({ companionId });
      const previousUsers = utils.users.getAllWithChatPreview.getData();

      // update current chat
      utils.chats.getByCompanionId.setData({ companionId }, (staleChat) => {
        if (staleChat) {
          const updatedMessagesMap = new Map(staleChat.messagesMap);
          const messagesByDate = updatedMessagesMap.get(newMessageData.dateKey);

          if (messagesByDate) {
            const editingMessageIndex = messagesByDate.findIndex((m) => m.id === newMessageData.id);

            if (editingMessageIndex !== -1) {
              const editingMessage = messagesByDate[editingMessageIndex]!;
              const editingMessageCopy: typeof editingMessage = {
                ...editingMessage,
                text: newMessageData.newText,
                updatedAt: new Date(),
              };

              const updatedMessagesByDate = messagesByDate
                .slice(0, editingMessageIndex)
                .concat(editingMessageCopy, messagesByDate.slice(editingMessageIndex + 1));

              updatedMessagesMap.set(newMessageData.dateKey, updatedMessagesByDate);

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
        if (staleUsers) {
          const messageReceiverIndex = staleUsers.findIndex(
            (u) => u.id === newMessageData.receiverId
          );

          if (messageReceiverIndex !== -1) {
            const messageReceiver = staleUsers[messageReceiverIndex]!;
            const messageReceiverCopy: typeof messageReceiver = {
              ...messageReceiver,
              lastMessage: { ...messageReceiver.lastMessage!, text: newMessageData.newText },
            };

            return staleUsers
              .slice(0, messageReceiverIndex)
              .concat(messageReceiverCopy, staleUsers.slice(messageReceiverIndex + 1));
          }
        }

        return staleUsers;
      });

      onMutateSideEffect();

      return { previousChat, previousUsers };
    },
    onError: (_, __, ctx) => {
      utils.chats.getByCompanionId.setData({ companionId }, ctx?.previousChat);
      utils.users.getAllWithChatPreview.setData(undefined, ctx?.previousUsers);

      toast({
        variant: 'destructive',
        title: 'Message sending failed',
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
