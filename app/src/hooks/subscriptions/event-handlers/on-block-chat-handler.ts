import { type BaseHandlerArgs } from './types';

export const onBlockChatHandler = ({ utils, data }: BaseHandlerArgs<'onBlockChat'>) => {
  utils.chats.getByCompanionId.setData({ companionId: data.blockedById }, (oldData) =>
    oldData
      ? {
          ...oldData,
          chat: {
            ...oldData.chat,
            blockedBy: data.shouldBlock ? data.blockedById : null,
          },
        }
      : oldData
  );
};
