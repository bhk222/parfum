import { create } from 'zustand';

interface TipState {
  enabled: boolean;
  toggle(): void;
}

export const useTipStore = create<TipState>((set, get) => ({
  enabled: true,
  toggle() {
    set({ enabled: !get().enabled });
  }
}));