'use client';

import { ICON_SIZE, ICON_STROKE_WIDTH, ICON_WRAPPER_SIZE } from '@repo/constants';
import { useDebouncedCallback } from '@repo/utils';
import { Group, ThemeIcon, Tooltip, Transition } from '@mantine/core';
import { useMediaQuery, useNetwork } from '@mantine/hooks';
import { SyncStatus } from '@repo/types';
import {
  IconCheck,
  IconCloudX,
  IconDeviceDesktopCheck,
  IconDeviceMobileCheck,
  IconWifi,
  IconWifiOff,
} from '@tabler/icons-react';
import React, { useEffect, useState } from 'react';
import SpinnerApp from '../spinners/app';
import { SHELL_VALUES } from '@atlas/constants';

enum Context {
  NETWORK = 'network',
  SYNC = 'sync',
}

export default function NetworkStatus({
  props,
}: {
  props: { itemSyncStatus?: SyncStatus; syncStatus: SyncStatus };
}) {
  const desktop = useMediaQuery('(min-width: 62em)');

  const networkStatus = useNetwork();
  const [offline, setOffline] = useState(!networkStatus.online);
  useEffect(() => setOffline(!networkStatus.online), [networkStatus.online]);

  const [context, setContext] = useState<Context>(
    !networkStatus.online ? Context.NETWORK : Context.SYNC,
  );

  const { debouncedCallback, cancel } = useDebouncedCallback(
    () => setContext(Context.SYNC),
    2 * 1000,
  );

  useEffect(() => {
    cancel(); // Cancel any scheduled unmount

    if (!networkStatus.online) {
      setContext(Context.NETWORK);
    } else {
      debouncedCallback();
    }
  }, [networkStatus.online, cancel, debouncedCallback]);

  const syncStatusProps = getSycnStatusProps({
    syncStatus: props.syncStatus,
    mobile: !desktop,
  });

  if (context == Context.NETWORK) {
    return (
      <Tooltip label={!networkStatus.online ? 'Back online' : 'Working Offline'}>
        <ThemeIcon
          size={!desktop ? ICON_WRAPPER_SIZE * 1.25 : sharedHeight}
          variant="light"
          color={!networkStatus.online ? 'yellow' : 'green'}
          display={offline ? undefined : 'none'}
        >
          {!networkStatus.online ? (
            <IconWifiOff
              size={!desktop ? ICON_SIZE * 1.25 : sharedHeight - 8}
              stroke={ICON_STROKE_WIDTH}
            />
          ) : (
            <IconWifi
              size={!desktop ? ICON_SIZE * 1.25 : sharedHeight - 8}
              stroke={ICON_STROKE_WIDTH}
            />
          )}
        </ThemeIcon>
      </Tooltip>
    );
  }

  return (
    <Tooltip label={syncStatusProps.label}>
      <ThemeIcon
        size={!desktop ? ICON_WRAPPER_SIZE * 1.25 : sharedHeight}
        variant="transparent"
        color={`${syncStatusProps.color}`}
        c={`${syncStatusProps.color}`}
        display={offline ? 'none' : undefined}
      >
        {syncStatusProps.icon}
      </ThemeIcon>
    </Tooltip>
  );
}

const sharedHeight = SHELL_VALUES.FOOTER.HEIGHT.DESKTOP - 10;

const getSycnStatusProps = (params: { syncStatus: SyncStatus; mobile: boolean }) => {
  const spinner = <SpinnerApp props={{ size: params.mobile ? ICON_SIZE : sharedHeight - 8 }} />;

  const iconProp = {
    icon: params.mobile ? IconDeviceMobileCheck : IconDeviceDesktopCheck,
  };

  switch (params.syncStatus) {
    case SyncStatus.ERROR:
      return {
        label: 'Sync error',
        color: 'red',
        icon: (
          <IconCloudX
            size={params.mobile ? ICON_SIZE * 1.25 : sharedHeight - 8}
            stroke={ICON_STROKE_WIDTH}
          />
        ),
      };
    case SyncStatus.PENDING:
      return {
        label: 'Syncing',
        color: 'gray',
        icon: spinner,
      };
    case SyncStatus.SAVED:
      return {
        label: 'Saved to device',
        color: 'yellow',
        icon: (
          <iconProp.icon
            size={params.mobile ? ICON_SIZE * 1.25 : sharedHeight - 8}
            stroke={ICON_STROKE_WIDTH}
          />
        ),
      };
    case SyncStatus.SYNCED:
      return {
        label: 'Synced to cloud',
        color: 'green',
        icon: (
          <IconCheck
            size={params.mobile ? ICON_SIZE * 1.25 : sharedHeight - 8}
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
