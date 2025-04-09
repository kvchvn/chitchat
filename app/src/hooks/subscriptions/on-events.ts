import { api } from '~/trpc/react';
import { onBlockChatHandler } from './event-handlers/on-block-chat-handler';
import { onClearChatHandler } from './event-handlers/on-clear-chat-handler';
import { onEditMessageHandler } from './event-handlers/on-edit-message-handler';
import { onLikeMessageHandler } from './event-handlers/on-like-message-handler';
import { onReadMessagesHandler } from './event-handlers/on-read-messages-handler';
import { onRemoveMessageHandler } from './event-handlers/on-remove-message-handler';
import { onSendMessageHandler } from './event-handlers/on-send-message-handler';
import { onUpdateChatPreviewHandler } from './event-handlers/on-update-chat-preview-handler';

export const onEvents = () => {
  const utils = api.useUtils();

  api.events.onEvent.useSubscription(undefined, {
    onData: ({ action, data }) => {
      switch (action) {
        case 'onSendMessage':
          onSendMessageHandler({ utils, data });
          break;
        case 'onEditMessage':
          onEditMessageHandler({ utils, data });
          break;
        case 'onReadMessages':
          onReadMessagesHandler({ utils, data });
          break;
        case 'onClearChat':
          onClearChatHandler({ utils, data });
          break;
        case 'onBlockChat':
          onBlockChatHandler({ utils, data });
          break;
        case 'onUpdateChatPreview':
          onUpdateChatPreviewHandler({ utils, data });
          break;
        case 'onRemoveMessage':
          onRemoveMessageHandler({ utils, data });
          break;
        case 'onLikeMessage':
          onLikeMessageHandler({ utils, data });
          break;
      }
    },
  });
};
