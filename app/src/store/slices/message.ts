import { type StateCreator } from 'zustand';
import { type MessageSlice } from '../types';

export const createMessageSlice: StateCreator<MessageSlice, [], [], MessageSlice> = (set) => ({
  messageToEdit: null,
  setMessageToEdit: (message) => set({ messageToEdit: message }),
});
