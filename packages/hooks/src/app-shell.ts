import { COOKIE_NAME } from '@repo/constants/names';
import { WEEK } from '@repo/constants/sizes';
import { useStoreAppShell } from '@repo/libraries/zustand/stores/shell';
import { AppShell } from '@repo/types/components';
import { setCookieClient } from '@repo/utilities/cookie-client';

export const useAppshellNavbar = () => {
  const appshell = useStoreAppShell((s) => s.appshell);
  const setAppShell = useStoreAppShell((s) => s.setAppShell);

  const handleAppshellChange = (params: AppShell) => {
    if (!appshell) return;

    setAppShell(params);

    setCookieClient(COOKIE_NAME.APP_SHELL, params, {
      expiryInSeconds: WEEK,
    });
  };

  return { appshell, handleAppshellChange };
};
