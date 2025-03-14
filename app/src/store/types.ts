import { type ChatMessage } from '~/server/db/schema/messages';

export type MessageSlice = {
  messageToEdit: ChatMessage | null;
  setMessageToEdit: (message: ChatMessage | null) => void;
};

export type AppStore = MessageSlice;
