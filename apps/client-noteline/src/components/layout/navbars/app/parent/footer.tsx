'use client';

import React from 'react';
import { Group, Skeleton, Stack } from '@mantine/core';
import IndicatorNetworkStatus from '@repo/components/common/indicators/network-status';
import { useStoreSession } from '@repo/libraries/zustand/stores/session';
import { useStoreSyncStatus } from '@repo/libraries/zustand/stores/sync-status';
import MenuUser from '@repo/components/common/menus/user';
import AvatarMain from '@repo/components/common/avatars/main';
import { ICON_WRAPPER_SIZE } from '@repo/constants/sizes';

export default function Footer() {
  const session = useStoreSession((s) => s.session);
  const syncStatus = useStoreSyncStatus((s) => s.syncStatus);

  return (
    <Stack p={'xs'} align="center">
      <Stack gap={0}>
        <IndicatorNetworkStatus props={{ syncStatus }} />

        {/* <IconNotificationPermission /> */}
      </Stack>

      {session && (
        <Group>
          <MenuUser>
            <AvatarMain size={ICON_WRAPPER_SIZE} />
          </MenuUser>
        </Group>
      )}
    </Stack>
  );
}
