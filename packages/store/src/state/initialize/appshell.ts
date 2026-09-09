'use client';

import { useEffect } from 'react';
import { getCookieClient, getFromSessionStorage, setCookieClient } from '@repo/utils';
import { WEEK, COOKIE_NAME, SESSION_STORAGE_NAME } from '@repo/constants';
import { AppShellValue, useStoreAppShell } from '../../state/appshell';
import { useStoreView } from '../view';
import { useMediaQuery } from '@mantine/hooks';

export const useAppshellInitialize = (params?: { cookie?: AppShellValue }) => {
  const desktop = useMediaQuery('(min-width: 62em)');

  const appshell = useStoreAppShell((s) => s.appshell);
  const setAppShell = useStoreAppShell((s) => s.setAppShell);

  const cookie: AppShellValue = getCookieClient(COOKIE_NAME.APP_SHELL);

  // Track the actual view state reactively
  const view = useStoreView((s) => s.view);

  useEffect(() => {
    // 1. Establish base defaults
    const base = params?.cookie ??
      cookie ?? {
        navbar: true,
        aside: false,
        child: { navbar: true, aside: false },
      };

    // 2. Read session storage to see if an aside view is active
    const sessionView = getFromSessionStorage(SESSION_STORAGE_NAME.VIEW);
    const hasAsideView = !!sessionView?.asideView;

    // 3. Apply Mobile Constraints & View Overrides
    // If hasAsideView is true, force aside to true (as long as we are on desktop)
    const resolvedChild = {
      navbar: desktop ? base.child.navbar : false,
      aside: desktop ? hasAsideView || base.child.aside : false,
    };

    const resolvedShell = {
      ...base,
      child: resolvedChild,
    };

    setTimeout(() => {
      setCookieClient(COOKIE_NAME.APP_SHELL, resolvedShell, {
        expiryInSeconds: WEEK,
      });
    }, 100);

    setAppShell(resolvedShell);
  }, [desktop, setAppShell]);

  // Runtime View Observer Effect
  useEffect(() => {
    if (view === undefined) return;

    const hasAsideView = !!view?.asideView;

    if (desktop && hasAsideView) {
      // Pull the absolute freshest state directly from the store bypasses stale closures
      const currentShell = useStoreAppShell.getState().appshell;

      // Only update if the store is ready and the aside is currently closed
      if (currentShell && currentShell.child.aside === false) {
        useStoreAppShell.getState().setAppShell({
          ...currentShell, // Safely preserves navbar and all other shell properties
          child: {
            ...currentShell.child,
            aside: true,
          },
        });
      }
    }
  }, [view, desktop]);

  useEffect(() => {
    if (appshell === undefined) return;

    setTimeout(() => {
      setCookieClient(COOKIE_NAME.APP_SHELL, appshell, {
        expiryInSeconds: WEEK,
      });
    }, 100);
  }, [appshell]);
};
