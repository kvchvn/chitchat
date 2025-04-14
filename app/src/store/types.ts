import { type ChatMessage } from '~/server/db/schema/messages';

export type MessageSlice = {
  messageToEdit: ChatMessage | null;
  setMessageToEdit: (message: ChatMessage | null) => void;
};

export type ChatSlice = {
  isSearchOn: boolean;
  toggleOnSearch: () => void;
  toggleOffSearch: () => void;
  activeSearchMessageId: string | null;
  setActiveSearchMessageId: (id: string) => void;
  resetActiveSearchMessageId: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
};

export type AppStore = MessageSlice & ChatSlice;
