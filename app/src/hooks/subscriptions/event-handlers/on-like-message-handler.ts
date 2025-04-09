import { generateChatDateKey } from '~/lib/utils';
import { type BaseHandlerArgs } from './types';

export const onLikeMessageHandler = ({ utils, data }: BaseHandlerArgs<'onLikeMessage'>) => {
  utils.chats.getByCompanionId.setData({ companionId: data.likedMessage.receiverId }, (oldData) => {
    if (oldData) {
      const updatedMessagesMap = new Map(oldData.messagesMap);
      const dateKey = generateChatDateKey(data.likedMessage.createdAt);

      const messagesByDate = updatedMessagesMap.get(dateKey);

      if (messagesByDate) {
        const currentMessageIndex = messagesByDate.findIndex((m) => m.id === data.likedMessage.id);

        if (currentMessageIndex !== -1) {
          const currentMessage = messagesByDate[currentMessageIndex]!;
          const updatedMessage: typeof currentMessage = {
            ...currentMessage,
            isLiked: data.likedMessage.isLiked,
          };

          const updatedMessagesByDate = messagesByDate
            .slice(0, currentMessageIndex)
            .concat(updatedMessage, messagesByDate.slice(currentMessageIndex + 1));

          updatedMessagesMap.set(dateKey, updatedMessagesByDate);

          return {
            ...oldData,
            messagesMap: updatedMessagesMap,
          };
        }
      }
    }

    return oldData;
  });
};
