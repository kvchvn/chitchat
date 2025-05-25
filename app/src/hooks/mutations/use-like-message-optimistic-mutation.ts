import { api } from '~/trpc/react';
import { useCompanionId } from '../use-companion-id';
import { useToast } from '../use-toast';

export const useLikeMessageOptimisticMutation = () => {
  const utils = api.useUtils();
  const companionId = useCompanionId();
  const { toast } = useToast();

  return api.messages.like.useMutation({
    onMutate: async (data) => {
      await utils.chats.getByCompanionId.cancel({ companionId });

      const previousChat = utils.chats.getByCompanionId.getData({ companionId });

      utils.chats.getByCompanionId.setData({ companionId }, (staleChat) => {
        if (staleChat) {
          const updatedMessagesMap = new Map(staleChat.messagesMap);
          const messagesByDate = updatedMessagesMap.get(data.dateKey);

          if (messagesByDate) {
            const likingMessageIndex = messagesByDate.findIndex((m) => m.id === data.id);

            if (likingMessageIndex !== -1) {
              const likingMessage = messagesByDate[likingMessageIndex]!;
              const likingMessageCopy: typeof likingMessage = {
                ...likingMessage,
                isLiked: data.like,
              };

              const updatedMessagesByDate = messagesByDate
                .slice(0, likingMessageIndex)
                .concat(likingMessageCopy, messagesByDate.slice(likingMessageIndex + 1));

              updatedMessagesMap.set(data.dateKey, updatedMessagesByDate);

              return {
                ...staleChat,
                messagesMap: updatedMessagesMap,
              };
            }
          }
        }

        return staleChat;
      });

      return { previousChat };
    },
    onError: (_, __, ctx) => {
      utils.chats.getByCompanionId.setData({ companionId }, ctx?.previousChat);

      toast({
        variant: 'destructive',
        title: 'Liking the message failed',
        description: 'Something went wrong. Please try again later',
      });
    },
    onSettled: () => {
      void utils.chats.getByCompanionId.invalidate({ companionId });
    },
  });
};
