import { api } from '~/trpc/react';

export const useBlockUserSubscription = () => {
  const utils = api.useUtils();

  api.chats.onToggleBlocking.useSubscription(undefined, {
    onData: ({ initiatorId, block }) => {
      utils.chats.getByCompanionId.setData({ companionId: initiatorId }, (oldData) =>
        oldData
          ? {
              ...oldData,
              chat: {
                ...oldData.chat,
                blockedBy: block ? initiatorId : null,
              },
            }
          : oldData
      );
    },
  });
};
