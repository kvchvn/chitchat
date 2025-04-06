import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { createSelectors } from './selectors';
import { createMessageSlice } from './slices/message';
import { type AppStore } from './types';

const useStoreBase = create<AppStore>()(
  devtools(
    immer((...args) => ({
      ...createMessageSlice(...args),
    }))
  )
);

export const useStore = createSelectors(useStoreBase);
