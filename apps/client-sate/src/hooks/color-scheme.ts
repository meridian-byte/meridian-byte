'use client';

/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { MantineColorScheme, useMantineColorScheme } from '@mantine/core';
import { DEFAULT_COLOR_SCHEME } from '@repo/constants/other';
import { COOKIE_NAME, LOCAL_STORAGE_NAME } from '@repo/constants/names';
import { WEEK } from '@repo/constants/sizes';
import {
  setCookieClient,
  getCookieClient,
} from '@repo/utilities/cookie-client';
import { getOSTheme } from '@repo/utilities/misc';
import { useCallback, useEffect } from 'react';
import { ColorScheme } from '@repo/types/enums';
import { removeFromLocalStorage } from '@repo/utilities/storage';
import { useStoreTheme } from '@/libraries/zustand/stores/theme';

export const useColorSchemeHandler = () => {
  const { setColorScheme } = useMantineColorScheme({ keepTransitions: true });

  const { theme, setTheme } = useStoreTheme();

  const persistCookies = useCallback(
    (stateValue: ColorScheme, schemeValue: MantineColorScheme) => {
      setCookieClient(COOKIE_NAME.COLOR_SCHEME_STATE, stateValue, {
        expiryInSeconds: WEEK,
      });
      setCookieClient(COOKIE_NAME.COLOR_SCHEME, schemeValue, {
        expiryInSeconds: WEEK,
      });
    },
    []
  );

  const handleChange = useCallback(
    (value: ColorScheme) => {
      if (value === theme) return; // ✅ no-op if same value

      setTheme(value);

      const scheme = getOSTheme(value as ColorScheme) as MantineColorScheme;

      // ✅ set Mantine scheme
      setColorScheme(scheme);

      // ✅ persist to cookies
      persistCookies(value, scheme);

      // don't persist mantine scheme in storage
      removeFromLocalStorage(LOCAL_STORAGE_NAME.MANTINE_COLOR_SCHEME_VALUE);
    },
    [theme, setColorScheme, persistCookies]
  );

  useEffect(() => {
    const stateValue = (getCookieClient(COOKIE_NAME.COLOR_SCHEME_STATE) ||
      DEFAULT_COLOR_SCHEME) as ColorScheme;
    const schemeValue = (getCookieClient(COOKIE_NAME.COLOR_SCHEME) ||
      getOSTheme(stateValue as ColorScheme)) as MantineColorScheme;

    // ✅ ensure both cookies are present and consistent
    persistCookies(stateValue, schemeValue);

    // ✅ update store and Mantine
    setTheme(stateValue);
    setColorScheme(schemeValue);

    // don't persist mantine scheme in storage
    removeFromLocalStorage(LOCAL_STORAGE_NAME.MANTINE_COLOR_SCHEME_VALUE);
  }, [setColorScheme, persistCookies]);

  // Auto-detect OS color scheme changes
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const listener = () => handleChange(ColorScheme.AUTO);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [handleChange]);

  const resolvedScheme = getOSTheme(theme as ColorScheme);

  return { theme, resolvedScheme, handleChange };
};
