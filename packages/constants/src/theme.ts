'use client';

/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import {
  Anchor,
  Container,
  createTheme,
  Loader,
  MantineThemeOverride,
  Notification,
} from '@mantine/core';
import cx from 'clsx';

export type AppThemeProps = {
  theme?: MantineThemeOverride;
  styleSheets?: { anchor?: any; container?: any; notification?: any };
};

export const getAppTheme = (params?: AppThemeProps) => {
  const componentAnchor = {
    Anchor: Anchor.extend({
      defaultProps: { underline: 'never' },
      classNames: params?.styleSheets?.anchor,
    }),
  };

  const componentContainer = {
    Container: Container.extend({
      defaultProps: {
        mx: 'auto',
      },

      classNames: (_: unknown, { size }: { size?: unknown }) => ({
        root: cx({
          [params?.styleSheets?.container.root]: size === 'responsive',
        }),
      }),
    }),
  };

  const componentNotification = {
    Notification: Notification.extend({
      classNames: params?.styleSheets?.notification,
    }),
  };

  const componentsWithStyles = {
    ...(params?.styleSheets?.anchor ? componentAnchor : {}),
    ...(params?.styleSheets?.container ? componentContainer : {}),
    ...(params?.styleSheets?.notification ? componentNotification : {}),
  };

  const baseTheme: MantineThemeOverride = {
    colors: {
      pri: [
        '#e1f8ff',
        '#cbedff',
        '#9ad7ff',
        '#64c1ff',
        '#3aaefe',
        '#20a2fe',
        '#099cff',
        '#0088e4',
        '#0079cd',
        '#0068b6',
      ],
    },

    primaryColor: 'pri',
    defaultRadius: 'sm',
    primaryShade: { light: 6, dark: 6 },
    cursorType: 'pointer',

    headings: {
      fontFamily: 'var(--font-geist-sans)',
    },

    components: {
      Container: Container.extend({
        defaultProps: {
          mx: 'auto',
        },

        classNames: (_: unknown, { size }: { size?: unknown }) => ({
          root: cx({
            [params?.styleSheets?.container.root]: size === 'responsive',
          }),
        }),
      }),

      Loader: Loader.extend({
        defaultProps: {
          type: 'bars',
          size: 'sm',
        },
      }),

      ...componentsWithStyles,
    },
  };

  return createTheme({
    ...baseTheme,
    ...(params?.theme || {}),
  });
};
