import { generateChatDateKey } from '~/lib/utils';
import { type BaseHandlerArgs } from './types';

export const onReadMessagesHandler = ({ utils, data }: BaseHandlerArgs<'onReadMessages'>) => {
  if (!data.readMessages.length) {
    return;
  }

  utils.chats.getByCompanionId.setData(
    { companionId: data.readMessages[0]!.receiverId },
    (staleChat) => {
      if (staleChat) {
        const updatedMessagesMap = new Map(staleChat.messagesMap);

        data.readMessages.forEach((message) => {
          const dateKey = generateChatDateKey(message.createdAt);

          const messagesByDate = updatedMessagesMap.get(dateKey);
          const currentMessage = messagesByDate?.find((m) => m.id === message.id);

          if (currentMessage) {
            currentMessage.isRead = true;
          }
        });

        return {
          chat: staleChat.chat,
          messagesMap: updatedMessagesMap,
        };
      }

      return staleChat;
    }
  );
};
