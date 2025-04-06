import { type BaseHandlerArgs } from '~/hooks/subscriptions/event-handlers/types';
import { generateChatDateKey } from '~/lib/utils';

export const onSendMessageHandler = ({ utils, data }: BaseHandlerArgs<'onSendMessage'>) => {
  utils.chats.getByCompanionId.setData({ companionId: data.newMessage.senderId }, (oldData) => {
    if (oldData) {
      const updatedMessagesMap = new Map(oldData.messagesMap);
      const dateKey = generateChatDateKey(data.newMessage.createdAt);

      if (!updatedMessagesMap.has(dateKey)) {
        updatedMessagesMap.set(dateKey, []);
      }

      updatedMessagesMap.get(dateKey)?.push(data.newMessage);

      return {
        chat: oldData.chat,
        messagesMap: updatedMessagesMap,
      };
    }

    return oldData;
  });
};
