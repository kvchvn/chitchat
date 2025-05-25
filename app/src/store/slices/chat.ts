import { type StateCreator } from 'zustand';
import { type AppStore, type ChatSlice } from '../types';

export const createChatSlice: StateCreator<AppStore, [], [], ChatSlice> = (set) => ({
  isSearchOn: false,
  toggleOnSearch: () => set({ isSearchOn: true }),
  toggleOffSearch: () => set({ isSearchOn: false, activeSearchMessageId: null, searchQuery: '' }),
  activeSearchMessageId: null,
  setActiveSearchMessageId: (id) => set({ activeSearchMessageId: id }),
  resetActiveSearchMessageId: () => set({ activeSearchMessageId: null }),
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
});
