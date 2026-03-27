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
  Drawer,
  Loader,
  MantineThemeOverride,
  Menu,
  Modal,
  Notification,
  NumberFormatter,
  ScrollArea,
  ScrollAreaAutosize,
  Tooltip,
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
        '#fef4e8',
        '#f2e7dc',
        '#decebc',
        '#cbb399',
        '#ba9c7b',
        '#b08e67', // src (5)
        '#ac865c',
        '#97734b',
        '#876640',
        '#775732',
      ],
    },

    primaryColor: 'pri',
    defaultRadius: 'md',
    primaryShade: { light: 5, dark: 5 },
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

      ScrollArea: ScrollArea.extend({
        defaultProps: {
          type: 'auto',
          scrollbarSize: 8,
        },
      }),

      ScrollAreaAutosize: ScrollAreaAutosize.extend({
        defaultProps: {
          type: 'auto',
          scrollbarSize: 8,
        },
      }),

      NumberFormatter: NumberFormatter.extend({
        defaultProps: {
          thousandSeparator: true,
        },
      }),

      Drawer: Drawer.extend({
        defaultProps: {
          transitionProps: {
            duration: 100,
          },
        },
      }),

      Menu: Menu.extend({
        defaultProps: {
          transitionProps: {
            enterDelay: 0,
            duration: 100,
            exitDuration: 100,
            exitDelay: 0,
          },
          overlayProps: { backgroundOpacity: 0.5, blur: 4 },
        },
        // classNames: classesMenu,
      }),

      // Popover: Popover.extend({
      //   defaultProps: {
      //     transitionProps: {
      //       enterDelay: 0,
      //       duration: 100,
      //       exitDuration: 100,
      //       exitDelay: 0,
      //     },
      //   },
      //   // classNames: classesPopover,
      // }),

      Tooltip: Tooltip.extend({
        defaultProps: {
          withArrow: true,
          transitionProps: {
            duration: 100,
            transition: 'fade',
            exitDuration: 100,
            enterDelay: 500,
            exitDelay: 0,
          },
        },
      }),

      Modal: Modal.extend({
        defaultProps: {
          centered: true,
          withCloseButton: false,
          padding: 0,
          transitionProps: {
            enterDelay: 0,
            duration: 100,
            exitDuration: 100,
            exitDelay: 0,
            transition: 'fade',
          },
          overlayProps: {
            backgroundOpacity: 0.33,
            blur: 3,
          },
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
