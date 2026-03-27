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
  IconLayoutSidebar,
  IconLayoutSidebarFilled,
  IconLayoutSidebarRight,
  IconLayoutSidebarRightFilled,
} from '@tabler/icons-react';
import { useStoreAppShell } from '@/libraries/zustand/stores/shell';
import { AppShell } from '@repo/types/components';
import DrawerAppNavbar from '@/components/common/drawers/app/navbar';
import DrawerAppAside from '@/components/common/drawers/app/aside';

export default function Main() {
  const { appshell, setAppShell } = useStoreAppShell();

  const states = {
    iconLeft: !appshell?.child.navbar
      ? IconLayoutSidebar
      : IconLayoutSidebarFilled,
    iconRight: !appshell?.child.aside
      ? IconLayoutSidebarRight
      : IconLayoutSidebarRightFilled,
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
      <Group p={'xs'}>
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
              <ActionIcon
                variant="subtle"
                color="pri.5"
                aria-label={appshell.child.navbar ? 'Collapse' : 'Expand'}
                onClick={() =>
                  handleAppshellChange({
                    ...appshell,
                    child: {
                      ...appshell.child,
                      navbar: !appshell?.child.navbar,
                    },
                  })
                }
                size={ICON_WRAPPER_SIZE}
              >
                <states.iconLeft size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
              </ActionIcon>
            </DrawerAppNavbar>
          </Tooltip>
        )}
      </Group>

      <Group justify="end" p={'xs'}>
        {appshell === undefined ? (
          <Skeleton h={ICON_WRAPPER_SIZE} w={ICON_WRAPPER_SIZE} />
        ) : !appshell ? (
          <></>
        ) : (
          <Tooltip
            label={appshell.child.aside ? 'Collapse' : 'Expand'}
            position="left"
          >
            <DrawerAppAside>
              <ActionIcon
                variant="subtle"
                color="pri.5"
                aria-label={appshell.child.aside ? 'Collapse' : 'Expand'}
                onClick={() =>
                  handleAppshellChange({
                    ...appshell,
                    child: {
                      ...appshell.child,
                      aside: !appshell?.child.aside,
                    },
                  })
                }
                size={ICON_WRAPPER_SIZE}
              >
                <states.iconRight size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
              </ActionIcon>
            </DrawerAppAside>
          </Tooltip>
        )}
      </Group>
    </Group>
  );
}
