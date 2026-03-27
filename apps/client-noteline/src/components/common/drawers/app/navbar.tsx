'use client';

import React, { useEffect } from 'react';
import {
  Box,
  ActionIcon,
  Drawer,
  Group,
  ScrollArea,
  Tooltip,
} from '@mantine/core';
import { useStoreAppShell } from '@repo/libraries/zustand/stores/shell';
import { AppShell } from '@repo/types/components';
import { COOKIE_NAME } from '@repo/constants/names';
import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
  WEEK,
} from '@repo/constants/sizes';
import { setCookieClient } from '@repo/utilities/cookie-client';
import TabNavbarLeft from '../../tabs/navbar/left';
import { IconLayoutSidebarLeftCollapse } from '@tabler/icons-react';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';

export default function Navbar({
  options,
  children,
}: {
  options?: { hover?: true };
  children: React.ReactNode;
}) {
  const mobile = useMediaQuery('(max-width: 36em)');
  const appshell = useStoreAppShell((s) => s.appshell);
  const setAppShell = useStoreAppShell((s) => s.setAppShell);
  const [opened, { open, close }] = useDisclosure(false);

  const handleAppshellChange = (params: AppShell) => {
    if (!mobile) return;
    if (!appshell) return;

    setAppShell(params);

    // To defer this operation and prevent blocking the main thread, wrap it in setTimeout or use scheduler.postTask
    setTimeout(() => {
      setCookieClient(COOKIE_NAME.APP_SHELL, params, {
        expiryInSeconds: WEEK,
      });
    }, 0);
  };

  const handleClose = () => {
    if (!mobile) return;
    if (!appshell) return;

    handleAppshellChange({
      ...appshell,
      child: {
        ...appshell.child,
        navbar: false,
      },
    });
  };

  useEffect(() => {
    if (options?.hover && appshell?.child.navbar && opened) close();
  }, [appshell?.child.navbar, opened]);

  return (
    <>
      <Drawer
        size={options?.hover ? 'xs' : undefined}
        hiddenFrom={!options?.hover ? 'xs' : undefined}
        keepMounted
        opened={!mobile ? opened : (appshell?.child.navbar ?? false)}
        padding={0}
        transitionProps={{ enterDelay: 500 }}
        withCloseButton={false}
        onClose={handleClose}
        styles={{
          content: {
            backgroundColor:
              'light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-8))',
          },
        }}
        display={
          (options?.hover || mobile) && !appshell?.child.navbar
            ? undefined
            : 'none'
        }
      >
        <ScrollArea
          h="100vh"
          onMouseLeave={() => {
            if (mobile) return;
            close();
          }}
        >
          <Group p={'xs'} justify="end">
            <Tooltip
              label={
                (options?.hover ? opened : appshell?.child.navbar)
                  ? 'Collapse'
                  : 'Expand'
              }
              position="right"
            >
              <ActionIcon
                size={ICON_WRAPPER_SIZE}
                variant={'subtle'}
                onClick={options?.hover ? close : handleClose}
              >
                <IconLayoutSidebarLeftCollapse
                  size={ICON_SIZE}
                  stroke={ICON_STROKE_WIDTH}
                />
              </ActionIcon>
            </Tooltip>
          </Group>

          <TabNavbarLeft />
        </ScrollArea>
      </Drawer>

      <span
        onMouseEnter={() => {
          if (mobile) return;
          if (!appshell) return;
          if (!appshell.child.navbar && !opened) open();
        }}
        onClick={() => {
          if (!mobile) return;
          if (!appshell) return;

          handleAppshellChange({
            ...appshell,
            child: {
              ...appshell.child,
              navbar: !appshell?.child.navbar,
            },
          });
        }}
      >
        {children}
      </span>
    </>
  );
}
