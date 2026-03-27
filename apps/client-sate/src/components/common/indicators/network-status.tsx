'use client';

import { ICON_STROKE_WIDTH, ICON_WRAPPER_SIZE } from '@repo/constants/sizes';
import { useDebouncedCallback } from '@repo/hooks/utility';
import { Badge, Group, ThemeIcon, Tooltip, Transition } from '@mantine/core';
import { useNetwork } from '@mantine/hooks';
import { SyncStatus } from '@repo/types/models/enums';
import {
  IconCheck,
  IconCloudX,
  IconDeviceDesktopCheck,
  IconWifi,
  IconWifiOff,
} from '@tabler/icons-react';
import React, { useEffect, useState } from 'react';
import SpinnerApp from '@repo/components/common/spinners/app';
import { useStoreSyncStatus } from '@/libraries/zustand/stores/sync-status';

enum Context {
  NETWORK = 'network',
  SYNC = 'sync',
}

export default function NetworkStatus({
  props,
}: {
  props?: { itemSyncStatus?: SyncStatus };
}) {
  const networkStatus = useNetwork();
  const [offline, setOffline] = useState(!networkStatus.online);
  useEffect(() => setOffline(!networkStatus.online), [networkStatus.online]);

  const { syncStatus } = useStoreSyncStatus();

  const [context, setContext] = useState<Context>(
    !networkStatus.online ? Context.NETWORK : Context.SYNC
  );

  const { debouncedCallback, cancel } = useDebouncedCallback(
    () => setContext(Context.SYNC),
    2 * 1000
  );

  useEffect(() => {
    cancel(); // Cancel any scheduled unmount

    if (!networkStatus.online) {
      setContext(Context.NETWORK);
    } else {
      debouncedCallback();
    }
  }, [networkStatus.online, cancel, debouncedCallback]);

  const syncStatusProps = getSycnStatusProps({ syncStatus });

  return context == Context.NETWORK ? (
    <Transition
      mounted={offline}
      transition="fade"
      duration={250}
      enterDelay={2000}
      exitDelay={2000}
      timingFunction="ease"
      keepMounted
    >
      {(styles) => (
        <div style={styles}>
          <Badge
            variant="light"
            color={!networkStatus.online ? 'yellow' : 'green'}
            leftSection={
              !networkStatus.online ? (
                <IconWifiOff size={10} />
              ) : (
                <IconWifi size={10} />
              )
            }
          >
            {!networkStatus.online ? 'Working Offline' : 'Back Online'}
          </Badge>
        </div>
      )}
    </Transition>
  ) : (
    <Transition
      mounted={(props?.itemSyncStatus || syncStatus) != SyncStatus.SYNCED}
      transition="fade"
      duration={250}
      enterDelay={2000}
      exitDelay={2000}
      timingFunction="ease"
      keepMounted
    >
      {(styles) => (
        <div style={styles}>
          <Tooltip label={syncStatusProps.label}>
            <Group>
              <ThemeIcon
                size={ICON_WRAPPER_SIZE / 1.25}
                variant="transparent"
                c={syncStatusProps.color}
              >
                {syncStatusProps.icon}
              </ThemeIcon>
            </Group>
          </Tooltip>
        </div>
      )}
    </Transition>
  );
}

const getSycnStatusProps = (params: { syncStatus: SyncStatus }) => {
  const spinner = <SpinnerApp props={{ size: ICON_WRAPPER_SIZE / 1.5 }} />;

  switch (params.syncStatus) {
    case SyncStatus.ERROR:
      return {
        label: 'Sync Error',
        color: 'var(--mantine-color-red-6)',
        icon: (
          <IconCloudX
            size={ICON_WRAPPER_SIZE / 1.25}
            stroke={ICON_STROKE_WIDTH}
          />
        ),
      };
    case SyncStatus.PENDING:
      return {
        label: 'Syncing',
        color: 'var(--mantine-color-gray-6)',
        icon: spinner,
      };
    case SyncStatus.SAVED:
      return {
        label: 'Saved to Device',
        color: 'var(--mantine-color-yellow-6)',
        icon: (
          <IconDeviceDesktopCheck
            size={ICON_WRAPPER_SIZE / 1.25}
            stroke={ICON_STROKE_WIDTH}
          />
        ),
      };
    case SyncStatus.SYNCED:
      return {
        label: 'Saved to Cloud',
        color: 'var(--mantine-color-green-6)',
        icon: (
          <IconCheck
            size={ICON_WRAPPER_SIZE / 1.25}
            stroke={ICON_STROKE_WIDTH}
          />
        ),
      };
    default:
      return {
        label: '',
        color: undefined,
        icon: undefined,
      };
  }
};
