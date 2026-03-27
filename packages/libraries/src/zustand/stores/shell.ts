import { create } from 'zustand';
import { AppShell } from '@repo/types/components';

export type AppShellValue = AppShell | null | undefined;

interface AppShellState {
  appshell: AppShellValue;
  setAppShell: (data: AppShellValue) => void;
  clearAppShell: () => void;
}

export const useStoreAppShell = create<AppShellState>((set) => ({
  appshell: undefined,

  setAppShell: (data) => {
    set({ appshell: data });
  },

  clearAppShell: () => {
    set({ appshell: undefined });
  },
}));
