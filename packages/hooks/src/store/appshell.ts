'use client';

import { useEffect } from 'react';
import { getCookieClient, getFromSessionStorage, isProduction, setCookieClient } from '@repo/utils';
import { COOKIE_NAME, SECONDS_WEEK, STORAGE_NAME } from '@repo/constants';
import { useBreakpointFlags } from '../viewport';
import { AppShellValue, useStoreAppShell, useStoreView } from '@repo/store';

export const useAppshellInitialize = (params?: { cookie?: AppShellValue }) => {
  const { ready, isDesktop } = useBreakpointFlags();

  const setAppShell = useStoreAppShell((s) => s.setAppShell);

  // Track the actual view state reactively
  const view = useStoreView((s) => s.view);

  useEffect(() => {
    if (!ready) return;

    const storedCookie: AppShellValue | undefined = getCookieClient(COOKIE_NAME.APP_SHELL);

    // 1. Establish base defaults
    const base = params?.cookie ??
      storedCookie ?? {
        navbar: true,
        aside: false,
        child: { navbar: true, aside: false },
      };

    // 2. Read session storage to see if an aside view is active
    const sessionView = getFromSessionStorage(STORAGE_NAME.VIEW);
    const hasAsideView = !!sessionView?.asideView;

    // 3. Apply Mobile/Non-Desktop Constraints & View Overrides
    // If hasAsideView is true, force aside to true on desktop
    const resolvedChild = {
      navbar: isDesktop ? base.child.navbar : false,
      aside: isDesktop ? hasAsideView || base.child.aside : false,
    };

    const resolvedShell: AppShellValue = {
      ...base,
      child: resolvedChild,
    };

    setAppShell(resolvedShell);

    const timer = window.setTimeout(() => {
      setCookieClient(COOKIE_NAME.APP_SHELL, resolvedShell, {
        expiryInSeconds: SECONDS_WEEK,
        secure: isProduction(),
        sameSite: 'Lax',
      });
    }, 100);

    return () => window.clearTimeout(timer);
  }, [ready, isDesktop, params?.cookie, setAppShell]);

  // Runtime View Observer Effect
  useEffect(() => {
    if (!ready || view === undefined) return;

    const hasAsideView = !!view?.asideView;

    if (isDesktop && hasAsideView) {
      // Pull the absolute freshest state directly from the store to bypass stale closures
      const currentShell = useStoreAppShell.getState().appshell;

      if (currentShell && currentShell.child.aside === false) {
        const nextShell: AppShellValue = {
          ...currentShell,
          child: {
            ...currentShell.child,
            aside: true,
          },
        };

        useStoreAppShell.getState().setAppShell(nextShell);

        setCookieClient(COOKIE_NAME.APP_SHELL, nextShell, {
          expiryInSeconds: SECONDS_WEEK,
          secure: isProduction(),
          sameSite: 'Lax',
        });
      }
    }
  }, [ready, isDesktop, view]);
};
