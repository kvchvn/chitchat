import { useEffect, useRef } from 'react';
import { useCompanionId } from '~/hooks/use-companion-id';
import { useToast } from '~/hooks/use-toast';
import { generateChatDateKey } from '~/lib/utils';
import { type ChatMessage } from '~/server/db/schema/messages';
import { api } from '~/trpc/react';

type Args = {
  onMutateSideEffect: () => void;
};

export const useSendMessageOptimisticMutation = ({ onMutateSideEffect }: Args) => {
  const companionId = useCompanionId();

  const utils = api.useUtils();
  const { toast } = useToast();
  const timerIdRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    return () => {
      clearTimeout(timerIdRef.current);
    };
  }, []);

  return api.messages.create.useMutation({
    onMutate: async (newMessage) => {
      const newMessageDraft: ChatMessage = {
        // it's temporary id
        id: `${Math.random()}`,
        chatId: newMessage.chatId,
        senderId: newMessage.senderId,
        receiverId: newMessage.receiverId,
        text: newMessage.text,
        createdAt: new Date(),
        updatedAt: new Date(),
        isRead: newMessage.senderId === newMessage.receiverId,
        isSent: false,
        isLiked: false,
      };

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
          const dateKey = generateChatDateKey(newMessageDraft.createdAt);

          if (!updatedMessagesMap.has(dateKey)) {
            updatedMessagesMap.set(dateKey, []);
          }

          updatedMessagesMap.get(dateKey)?.push(newMessageDraft);

          return {
            ...staleChat,
            messagesMap: updatedMessagesMap,
          };
        }

        return staleChat;
      });

      // update current chat preview
      utils.users.getAllWithChatPreview.setData(undefined, (staleUsers) => {
        if (staleUsers) {
          const messageReceiverIndex = staleUsers.findIndex((u) => u.id === newMessage.receiverId);

          if (messageReceiverIndex !== -1) {
            const messageReceiver = staleUsers[messageReceiverIndex]!;
            const messageReceiverCopy: typeof messageReceiver = {
              ...messageReceiver,
              lastMessage: newMessageDraft,
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
        title: 'Sending the message failed',
        description: 'Something went wrong. Please try again later',
      });
    },
    onSettled: () => {
      clearTimeout(timerIdRef.current);
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      timerIdRef.current = setTimeout(async () => {
        await Promise.allSettled([
          utils.chats.getByCompanionId.invalidate({ companionId }),
          utils.users.getAllWithChatPreview.invalidate(),
        ]);
      }, 1000);
    },
  });
};
