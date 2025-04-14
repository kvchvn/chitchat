import { type StateCreator } from 'zustand';
import { type AppStore, type MessageSlice } from '../types';

export const createMessageSlice: StateCreator<AppStore, [], [], MessageSlice> = (set) => ({
  messageToEdit: null,
  setMessageToEdit: (message) => set({ messageToEdit: message }),
});
