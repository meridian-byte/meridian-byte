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
import { appName } from '@repo/constants/app';
import { Notifications } from '@mantine/notifications';
import { DEFAULT_COLOR_SCHEME } from '@repo/constants/other';
import { getAppTheme, AppThemeProps } from '@repo/constants/theme';
import { getAppResolver } from '@repo/constants/resolver';

export default function Mantine({
  colorScheme,
  options,
  appThemeProps,
  appResolverProps,
  children,
}: {
  colorScheme?: MantineColorScheme;
  options?: { withNotifications?: boolean };
  appThemeProps?: AppThemeProps;
  appResolverProps?: ConvertCSSVariablesInput;
  children: React.ReactNode;
}) {
  return (
    <MantineProvider
      theme={getAppTheme(appThemeProps)}
      cssVariablesResolver={getAppResolver({ cssVars: appResolverProps })}
      classNamesPrefix={linkify(appName)}
      defaultColorScheme={colorScheme || DEFAULT_COLOR_SCHEME}
    >
      {children}

      {options?.withNotifications && <Notifications limit={3} />}
    </MantineProvider>
  );
}
