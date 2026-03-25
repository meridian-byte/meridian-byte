import { create } from 'zustand';
import { AppShell } from '@repo/types/components';

export type AppShellValue = AppShell | null | undefined;

interface AppShellState {
  appshell: AppShellValue;
  toggleNavbarChild: () => void;
  toggleAsideChild: () => void;
  setAppShell: (data: AppShellValue) => void;
  clearAppShell: () => void;
}

export const useStoreAppShell = create<AppShellState>((set) => ({
  appshell: undefined,

  toggleNavbarChild: () => {
    set((state) => {
      if (!state.appshell) return state;

      return {
        appshell: {
          ...state.appshell,
          child: {
            ...state.appshell.child,
            navbar: !state.appshell?.child?.navbar,
          },
        },
      };
    });
  },

  toggleAsideChild: () => {
    set((state) => {
      if (!state.appshell) return state;

      return {
        appshell: {
          ...state.appshell,
          child: {
            ...state.appshell.child,
            aside: !state.appshell?.child?.aside,
          },
        },
      };
    });
  },

  setAppShell: (data) => {
    set((state) => {
      return { appshell: data };
    });
  },

  clearAppShell: () => {
    set(() => {
      return { appshell: null };
    });
  },
}));
