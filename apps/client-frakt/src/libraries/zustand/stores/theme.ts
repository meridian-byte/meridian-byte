import { create } from 'zustand';
import { ColorScheme } from '@repo/types/enums';

export type ThemeValue = ColorScheme | null | undefined;

interface ThemeState {
  theme: ThemeValue;
  setTheme: (data: ThemeValue) => void;
  clearTheme: () => void;
}

export const useStoreTheme = create<ThemeState>((set) => ({
  theme: undefined,

  setTheme: (data) => {
    set({ theme: data });
  },

  clearTheme: () => {
    set({ theme: undefined });
  },
}));
