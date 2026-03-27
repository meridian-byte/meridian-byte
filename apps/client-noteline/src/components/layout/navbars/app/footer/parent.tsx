'use client';

import React from 'react';
import { Group, Skeleton, Stack, ThemeIcon } from '@mantine/core';
import MenuUser from '@repo/components/common/menus/user';
import IndicatorNetworkStatus from '@repo/components/common/indicators/network-status';
import { useStoreSession } from '@repo/libraries/zustand/stores/session';
import { useStoreSyncStatus } from '@repo/libraries/zustand/stores/sync-status';
import AvatarMain from '@repo/components/common/avatars/main';
import IndicatorTheme from '@repo/components/common/indicators/theme';
import { useStoreTheme } from '@repo/libraries/zustand/stores/theme';
import { ICON_WRAPPER_SIZE } from '@repo/constants/sizes';

export default function Parent() {
  const session = useStoreSession((s) => s.session);
  const syncStatus = useStoreSyncStatus((s) => s.syncStatus);
  const theme = useStoreTheme((s) => s.theme);
  const setTheme = useStoreTheme((s) => s.setTheme);

  return (
    <Stack p={'xs'} align="center">
      <Stack gap={0}>
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
