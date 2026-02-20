'use client';

import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
} from '@repo/constants/sizes';
import { useDebouncedCallback } from '@repo/hooks/utility';
import { Group, ThemeIcon, Tooltip, Transition } from '@mantine/core';
import { useMediaQuery, useNetwork } from '@mantine/hooks';
import { SyncStatus } from '@repo/types/models/enums';
import {
  IconCheck,
  IconCloudX,
  IconDeviceDesktopCheck,
  IconDeviceMobileCheck,
  IconWifi,
  IconWifiOff,
} from '@tabler/icons-react';
import React, { useEffect, useState } from 'react';
import SpinnerApp from '@repo/components/common/spinners/app';

enum Context {
  NETWORK = 'network',
  SYNC = 'sync',
}

export default function NetworkStatus({
  props,
}: {
  props: { itemSyncStatus?: SyncStatus; syncStatus: SyncStatus };
}) {
  const networkStatus = useNetwork();
  const [offline, setOffline] = useState(!networkStatus.online);
  useEffect(() => setOffline(!networkStatus.online), [networkStatus.online]);

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

  const mobile = useMediaQuery('(max-width: 36em)');
  const syncStatusProps = getSycnStatusProps({
    syncStatus: props.syncStatus,
    mobile,
  });

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
          <Tooltip
            label={!networkStatus.online ? 'Working Offline' : 'Back Online'}
          >
            <Group>
              <ThemeIcon
                size={ICON_WRAPPER_SIZE}
                variant="transparent"
                color={!networkStatus.online ? 'yellow.6' : 'green.6'}
              >
                {!networkStatus.online ? (
                  <IconWifiOff size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
                ) : (
                  <IconWifi size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
                )}
              </ThemeIcon>
            </Group>
          </Tooltip>
        </div>
      )}
    </Transition>
  ) : (
    <Transition
      mounted={(props?.itemSyncStatus || props.syncStatus) != SyncStatus.SYNCED}
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
                size={ICON_WRAPPER_SIZE}
                variant="transparent"
                color={`${syncStatusProps.color}.6`}
                c={`${syncStatusProps.color}.6`}
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

const getSycnStatusProps = (params: {
  syncStatus: SyncStatus;
  mobile: boolean;
}) => {
  const spinner = <SpinnerApp props={{ size: ICON_WRAPPER_SIZE / 1.5 }} />;

  const iconProp = {
    icon: params.mobile ? IconDeviceMobileCheck : IconDeviceDesktopCheck,
  };

  switch (params.syncStatus) {
    case SyncStatus.ERROR:
      return {
        label: 'Sync Error',
        color: 'red',
        icon: <IconCloudX size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />,
      };
    case SyncStatus.PENDING:
      return {
        label: 'Syncing',
        color: 'gray',
        icon: spinner,
      };
    case SyncStatus.SAVED:
      return {
        label: 'Saved to Device',
        color: 'yellow',
        icon: <iconProp.icon size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />,
      };
    case SyncStatus.SYNCED:
      return {
        label: 'Saved to Cloud',
        color: 'green',
        icon: <IconCheck size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />,
      };
    default:
      return {
        label: '',
        color: undefined,
        icon: undefined,
      };
  }
};
