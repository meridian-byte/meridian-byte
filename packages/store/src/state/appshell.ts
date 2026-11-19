import { create } from 'zustand';
import { AppShell } from '@repo/types';
import { isProduction, setCookieClient } from '@repo/utils';
import { COOKIE_NAME, SECONDS_WEEK } from '@repo/constants';

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

      const nextAppShell: AppShellValue = {
        ...state.appshell,
        child: {
          ...state.appshell.child,
          navbar: !state.appshell.child?.navbar,
        },
      };

      persistAppShellCookie(nextAppShell);
      return { appshell: nextAppShell };
    });
  },

  toggleAsideChild: () => {
    set((state) => {
      if (!state.appshell) return state;

      const nextAppShell: AppShellValue = {
        ...state.appshell,
        child: {
          ...state.appshell.child,
          aside: !state.appshell.child?.aside,
        },
      };

      persistAppShellCookie(nextAppShell);
      return { appshell: nextAppShell };
    });
  },

  setAppShell: (data) => {
    set(() => {
      persistAppShellCookie(data);
      return { appshell: data };
    });
  },

  clearAppShell: () => {
    set(() => {
      persistAppShellCookie(null);
      return { appshell: null };
    });
  },
}));

const persistAppShellCookie = (value: AppShellValue | null) => {
  if (typeof window === 'undefined') return;

  if (!value) {
    // or deleteCookieClient if you have one
    return;
  }

  setCookieClient(COOKIE_NAME.APP_SHELL, value, {
    expiryInSeconds: SECONDS_WEEK,
    secure: isProduction(),
    sameSite: 'Lax',
  });
};
