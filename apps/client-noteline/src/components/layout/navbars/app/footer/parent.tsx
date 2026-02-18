'use client';

import React from 'react';
import { Group, Skeleton, Stack } from '@mantine/core';
import MenuUser from '@/components/common/menu/user';
import IndicatorNetworkStatus from '@repo/components/common/indicators/network-status';
import { useStoreSession } from '@repo/libraries/zustand/stores/session';
import { useStoreSyncStatus } from '@repo/libraries/zustand/stores/sync-status';
import AvatarMain from '@/components/common/avatars/main';
import IndicatorTheme from '@repo/components/common/indicators/theme';
import { useStoreTheme } from '@repo/libraries/zustand/stores/theme';
import { ICON_WRAPPER_SIZE } from '@repo/constants/sizes';

export default function Parent() {
  const { session } = useStoreSession();
  const { syncStatus } = useStoreSyncStatus();
  const { theme, setTheme } = useStoreTheme();

  return (
    <Stack p={'xs'} align="center">
      <IndicatorNetworkStatus props={{ syncStatus }} />

      {/* <IconNotificationPermission /> */}

      {theme === undefined ? (
        <Skeleton w={ICON_WRAPPER_SIZE} h={ICON_WRAPPER_SIZE} />
      ) : !theme ? (
        <></>
      ) : (
        <IndicatorTheme
          props={{ colorScheme: theme, setColorScheme: setTheme }}
        />
      )}

      {session && (
        <Group>
          <MenuUser>
            <AvatarMain />
          </MenuUser>
        </Group>
      )}
    </Stack>
  );
}
