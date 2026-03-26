'use client';

import React from 'react';
import { ActionIcon, Group, Skeleton, Tooltip } from '@mantine/core';
import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
  WEEK,
} from '@repo/constants/sizes';
import {
  IconLayoutSidebarLeftCollapse,
  IconLayoutSidebarLeftExpand,
  IconLayoutSidebarRightCollapse,
  IconLayoutSidebarRightExpand,
} from '@tabler/icons-react';
import { useStoreAppShell } from '@repo/libraries/zustand/stores/shell';
import { AppShell } from '@repo/types/components';
import DrawerAppAside from '@/components/common/drawers/app/aside';
import IndicatorNetworkStatus from '@repo/components/common/indicators/network-status';
import { useStoreSyncStatus } from '@repo/libraries/zustand/stores/sync-status';
import NavbarAppMainParent from '../../navbars/app/parent/main';
import { useMediaQuery } from '@mantine/hooks';
import ButtonAppshellNavbar from '@repo/components/common/buttons/appshell/navbar';
import AvatarMain from '@repo/components/common/avatars/main';
import { useStoreSession } from '@repo/libraries/zustand/stores/session';
import ModalUser from '@repo/components/common/modals/user';

export default function Main() {
  const syncStatus = useStoreSyncStatus((s) => s.syncStatus);
  const session = useStoreSession((s) => s.session);

  return (
    <Group justify="space-between" h={'100%'} px={'xs'}>
      <Group gap={5}>
        <Group gap={5} hiddenFrom="xs">
          <NavbarAppMainParent props={{ options: { mobile: true } }} />
          <IndicatorNetworkStatus props={{ syncStatus }} />
        </Group>
      </Group>

      <Group justify="end" hiddenFrom="xs">
        {session && (
          <ModalUser>
            <AvatarMain size={ICON_WRAPPER_SIZE} />
          </ModalUser>
        )}

        {/* {appshell === undefined ? (
          <Skeleton h={ICON_WRAPPER_SIZE} w={ICON_WRAPPER_SIZE} />
        ) : !appshell ? (
          <></>
        ) : (
          <Tooltip
            label={appshell?.child?.aside ? 'Collapse' : 'Expand'}
            position="left"
          >
            <DrawerAppAside>
              <Group>
                <ActionIcon
                  variant="subtle"
                  color="pri.5"
                  aria-label={appshell?.child?.aside ? 'Collapse' : 'Expand'}
                  onClick={() => {
                    if (mobile) return;
                    if (!appshell) return;

                    handleAppshellChange({
                      ...appshell,
                      child: {
                        ...appshell.child,
                        aside: !appshell?.child?.aside,
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
