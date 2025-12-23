import { MantineColorScheme } from '@mantine/core';
import { DEFAULT_COLOR_SCHEME } from '@repo/constants/other';
import { COOKIE_NAME } from '@repo/constants/names';
import { WEEK } from '@repo/constants/sizes';
import {
  setCookieClient,
  getCookieClient,
} from '@repo/utilities/cookie-client';
import { getOSTheme } from '@repo/utilities/misc';
import { useEffect } from 'react';
import { ColorScheme } from '@repo/types/enums';

export const useColorSchemeHandler = (params: {
  schemeState: string;
  setSchemeState: (schemeState: ColorScheme) => void;
  setMantineScheme: (scheme: MantineColorScheme) => void;
}) => {
  const handleChange = (value: ColorScheme) => {
    // update in state
    params.setSchemeState(value);

    // update scheme state cookie
    setCookieClient(COOKIE_NAME.COLOR_SCHEME_STATE, value, {
      expiryInSeconds: WEEK,
    });

    const scheme = getOSTheme(value as ColorScheme);

    // update mantine color scheme
    params.setMantineScheme(scheme as MantineColorScheme);

    // update scheme cookie
    setCookieClient(COOKIE_NAME.COLOR_SCHEME, scheme, {
      expiryInSeconds: WEEK,
    });
  };

  useEffect(() => {
    const cookieValueState = getCookieClient(COOKIE_NAME.COLOR_SCHEME_STATE);

    if (!cookieValueState) {
      setCookieClient(COOKIE_NAME.COLOR_SCHEME_STATE, DEFAULT_COLOR_SCHEME, {
        expiryInSeconds: WEEK,
      });
    }

    const cookieValue = getCookieClient(COOKIE_NAME.COLOR_SCHEME);

    if (!cookieValue) {
      setCookieClient(COOKIE_NAME.COLOR_SCHEME, DEFAULT_COLOR_SCHEME, {
        expiryInSeconds: WEEK,
      });
    }

    params.setSchemeState(
      (cookieValueState || DEFAULT_COLOR_SCHEME) as ColorScheme
    );
    params.setMantineScheme(
      (cookieValue as MantineColorScheme) || DEFAULT_COLOR_SCHEME
    );
  }, []);

  return { handleChange };
};
