import { create } from 'zustand';
import { AppShell } from '@repo/types/components';
import { setCookieClient } from '@repo/utilities/cookie-client';
import { COOKIE_NAME } from '@repo/constants/names';
import { WEEK } from '@repo/constants/sizes';

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

      // Move side effects here; they won't block the React render update
      setCookieClient(COOKIE_NAME.APP_SHELL, state, { expiryInSeconds: WEEK });

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

      // Move side effects here; they won't block the React render update
      setCookieClient(COOKIE_NAME.APP_SHELL, state, { expiryInSeconds: WEEK });

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
    set({ appshell: data });
  },

  clearAppShell: () => {
    set({ appshell: undefined });
  },
}));
