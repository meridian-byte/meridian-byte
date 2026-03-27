'use client';

import React from 'react';
import { ActionIcon, Group, Skeleton, Tooltip } from '@mantine/core';
import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
  WEEK,
} from '@repo/constants/sizes';
import { COOKIE_NAME } from '@repo/constants/names';
import { setCookieClient } from '@repo/utilities/cookie-client';
import {
  IconLayoutSidebarLeftCollapse,
  IconLayoutSidebarLeftExpand,
  IconLayoutSidebarRightCollapse,
  IconLayoutSidebarRightExpand,
} from '@tabler/icons-react';
import { useStoreAppShell } from '@repo/libraries/zustand/stores/shell';
import { AppShell } from '@repo/types/components';
import DrawerAppNavbar from '@/components/common/drawers/app/navbar';
import DrawerAppAside from '@/components/common/drawers/app/aside';
import IndicatorNetworkStatus from '@repo/components/common/indicators/network-status';
import { useStoreSyncStatus } from '@repo/libraries/zustand/stores/sync-status';
import { useStoreTheme } from '@repo/libraries/zustand/stores/theme';
import IndicatorTheme from '@repo/components/common/indicators/theme';
import NavbarAppMainParent from '../../navbars/app/main/parent';
import { useMediaQuery } from '@mantine/hooks';

export default function Main() {
  const appshell = useStoreAppShell((s) => s.appshell);
  const setAppShell = useStoreAppShell((s) => s.setAppShell);
  const syncStatus = useStoreSyncStatus((s) => s.syncStatus);
  const theme = useStoreTheme((s) => s.theme);
  const setTheme = useStoreTheme((s) => s.setTheme);
  const mobile = useMediaQuery('(max-width: 36em)');

  const states = {
    iconLeft: !appshell?.child.navbar
      ? IconLayoutSidebarLeftExpand
      : IconLayoutSidebarLeftCollapse,
    iconRight: !appshell?.child.aside
      ? IconLayoutSidebarRightExpand
      : IconLayoutSidebarRightCollapse,
  };

  const handleAppshellChange = (params: AppShell) => {
    if (!appshell) return;

    setAppShell(params);

    setCookieClient(COOKIE_NAME.APP_SHELL, params, {
      expiryInSeconds: WEEK,
    });
  };

  return (
    <Group justify="space-between">
      <Group p={'xs'} gap={5}>
        {appshell === undefined ? (
          <Skeleton h={ICON_WRAPPER_SIZE} w={ICON_WRAPPER_SIZE} />
        ) : !appshell ? (
          <></>
        ) : (
          <Tooltip
            label={appshell.child.navbar ? 'Collapse' : 'Expand'}
            position="right"
          >
            <DrawerAppNavbar>
              <Group>
                <ActionIcon
                  variant="subtle"
                  color="pri.5"
                  aria-label={appshell.child.navbar ? 'Collapse' : 'Expand'}
                  onClick={() => {
                    if (mobile) return;
                    if (!appshell) return;

                    handleAppshellChange({
                      ...appshell,
                      child: {
                        ...appshell.child,
                        navbar: !appshell?.child.navbar,
                      },
                    });
                  }}
                  size={ICON_WRAPPER_SIZE}
                >
                  <states.iconLeft
                    size={ICON_SIZE}
                    stroke={ICON_STROKE_WIDTH}
                  />
                </ActionIcon>
              </Group>
            </DrawerAppNavbar>
          </Tooltip>
        )}

        <Group gap={5} hiddenFrom="xs">
          <NavbarAppMainParent props={{ options: { mobile: true } }} />
        </Group>
      </Group>

      <Group justify="end" p={'xs'} gap={5}>
        <Group gap={5} hiddenFrom="xs">
          <IndicatorNetworkStatus props={{ syncStatus }} />

          {theme === undefined ? (
            <Skeleton w={ICON_WRAPPER_SIZE} h={ICON_WRAPPER_SIZE} />
          ) : !theme ? (
            <></>
          ) : (
            <IndicatorTheme
              props={{ colorScheme: theme, setColorScheme: setTheme }}
            />
          )}
        </Group>

        {/* {appshell === undefined ? (
          <Skeleton h={ICON_WRAPPER_SIZE} w={ICON_WRAPPER_SIZE} />
        ) : !appshell ? (
          <></>
        ) : (
          <Tooltip
            label={appshell.child.aside ? 'Collapse' : 'Expand'}
            position="left"
          >
            <DrawerAppAside>
              <Group>
                <ActionIcon
                  variant="subtle"
                  color="pri.5"
                  aria-label={appshell.child.aside ? 'Collapse' : 'Expand'}
                  onClick={() => {
                    if (mobile) return;
                    if (!appshell) return;

                    handleAppshellChange({
                      ...appshell,
                      child: {
                        ...appshell.child,
                        aside: !appshell?.child.aside,
                      },
                    });
                  }}
                  size={ICON_WRAPPER_SIZE}
                >
                  <states.iconRight
                    size={ICON_SIZE}
                    stroke={ICON_STROKE_WIDTH}
                  />
                </ActionIcon>
              </Group>
            </DrawerAppAside>
          </Tooltip>
        )} */}
      </Group>
    </Group>
  );
}
