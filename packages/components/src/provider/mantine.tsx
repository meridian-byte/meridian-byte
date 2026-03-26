'use client';

/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import React from 'react';
import {
  MantineProvider,
  MantineColorScheme,
  ConvertCSSVariablesInput,
} from '@mantine/core';
import { linkify } from '@repo/utilities/url';
import { Notifications } from '@mantine/notifications';
import { DEFAULT_COLOR_SCHEME } from '@repo/constants/other';
import { getAppTheme, AppThemeProps } from '@repo/constants/theme';
import { getAppResolver } from '@repo/constants/resolver';
import { COOKIE_NAME } from '@repo/constants/names';
import { WEEK } from '@repo/constants/sizes';
import {
  setCookieClient,
  getCookieClient,
} from '@repo/utilities/cookie-client';
import { getOSTheme } from '@repo/utilities/misc';

import { MantineColorSchemeManager } from '@mantine/core';
import { ColorScheme } from '@repo/types/enums';

export default function Mantine({
  appName,
  colorScheme,
  options,
  appThemeProps,
  appResolverProps,
  children,
}: {
  appName?: string;
  colorScheme?: MantineColorScheme;
  options?: { withNotifications?: boolean };
  appThemeProps?: AppThemeProps;
  appResolverProps?: ConvertCSSVariablesInput;
  children: React.ReactNode;
}) {
  const colorSchemeManager = customColorSchemeManager();

  return (
    <MantineProvider
      theme={getAppTheme(appThemeProps)}
      cssVariablesResolver={getAppResolver({ cssVars: appResolverProps })}
      classNamesPrefix={linkify(appName || 'template-next')}
      defaultColorScheme={colorScheme || DEFAULT_COLOR_SCHEME}
      colorSchemeManager={colorSchemeManager}
    >
      {children}

      {options?.withNotifications && <Notifications limit={3} />}
    </MantineProvider>
  );
}

const customColorSchemeManager = (): MantineColorSchemeManager => {
  return {
    get: (defaultValue) => {
      if (typeof window === 'undefined') return defaultValue;
      // Get the specific state (Light/Dark/Auto) from cookies
      const stored = getCookieClient(
        COOKIE_NAME.COLOR_SCHEME_STATE
      ) as MantineColorScheme;
      return stored || defaultValue;
    },

    set: (value) => {
      // 1. Determine what the OS actually wants right now
      const systemScheme = getOSTheme(ColorScheme.AUTO);
      const currentState = getCookieClient(COOKIE_NAME.COLOR_SCHEME_STATE);

      queueMicrotask(() => {
        // 2. THE LOGIC LEVERAGE:
        // If we are currently in 'auto' mode AND the value Mantine is trying to set
        // matches the system's current theme, DO NOT save it to the STATE cookie.
        // This prevents the "Auto" preference from being overwritten by the "Result".
        if (currentState === 'auto' && value === systemScheme) {
          // Only update the result cookie for the middleware/server
          setCookieClient(COOKIE_NAME.COLOR_SCHEME, value, {
            expiryInSeconds: WEEK,
          });
          return;
        }

        // 3. Otherwise, this is a manual user selection. Save both.
        setCookieClient(COOKIE_NAME.COLOR_SCHEME_STATE, value, {
          expiryInSeconds: WEEK,
        });
        setCookieClient(
          COOKIE_NAME.COLOR_SCHEME,
          getOSTheme(value as ColorScheme),
          { expiryInSeconds: WEEK }
        );
      });
    },

    subscribe: (onUpdate) => {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = () => {
        const state = getCookieClient(COOKIE_NAME.COLOR_SCHEME_STATE);
        if (state === 'auto') {
          // Tell Mantine to re-evaluate 'auto'.
          // This triggers the 'set' method above, which our new guard handles.
          onUpdate('auto' as MantineColorScheme);
        }
      };

      mq.addEventListener('change', listener);
      return () => mq.removeEventListener('change', listener);
    },

    unsubscribe: () => {},

    clear: () => {
      // Logic to remove cookies if needed
    },
  };
};
