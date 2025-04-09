import { type ChatMessage } from '../db/schema/messages';

export type EventAction =
  | 'onSendMessage'
  | 'onReadMessages'
  | 'onEditMessage'
  | 'onUpdateChatPreview'
  | 'onClearChat'
  | 'onBlockChat'
  | 'onRemoveMessage'
  | 'onLikeMessage';

export type EventData =
  | OnSendMessageEvent
  | OnEditMessage
  | OnReadMessages
  | OnUpdateChatPreview
  | OnClearChat
  | OnBlockChat
  | OnRemoveMessage
  | OnLikeMessage;

type EventDataGenerator<Action extends EventAction, Data extends Record<string, unknown>> = {
  action: Action;
  eventReceiverId: string;
  data: Data;
};

export type ExtractDataFromAction<Action extends EventAction> = Extract<
  EventData,
  { action: Action }
>['data'];

export type OnSendMessageEvent = EventDataGenerator<
  'onSendMessage',
  {
    newMessage: ChatMessage;
  }
>;

export type OnEditMessage = EventDataGenerator<
  'onEditMessage',
  {
    updatedMessage: ChatMessage;
  }
>;

export type OnReadMessages = EventDataGenerator<
  'onReadMessages',
  {
    readMessages: ChatMessage[];
  }
>;

export type OnUpdateChatPreview = EventDataGenerator<
  'onUpdateChatPreview',
  {
    chatWithId: string;
    // undefined - leave a preview message the same, null - to remove a preview message
    previewMessage?: ChatMessage | null;
    blockedBy?: string | null;
    // undefined - keep it the same, 0 (zero) - to reset the value
    unreadMessagesDiff?: number;
  }
>;

export type OnClearChat = EventDataGenerator<
  'onClearChat',
  {
    clearedById: string;
  }
>;

export type OnBlockChat = EventDataGenerator<
  'onBlockChat',
  {
    blockedById: string;
    shouldBlock: boolean;
  }
>;

export type OnRemoveMessage = EventDataGenerator<
  'onRemoveMessage',
  {
    removedMessage: ChatMessage;
  }
>;

export type OnLikeMessage = EventDataGenerator<
  'onLikeMessage',
  {
    likedMessage: ChatMessage;
  }
>;
