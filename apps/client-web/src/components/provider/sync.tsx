'use client';

/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import React from 'react';
import { useDebouncedCallback, useNetwork } from '@mantine/hooks';
import { useStoreSession } from '@repo/libraries/zustand/stores/session';
import { useStoreSyncStatus } from '@repo/libraries/zustand/stores/sync-status';
import {
  handleMergedSync,
  MergedSyncPayload,
  syncToServerAfterDelay,
  useMergedSync,
} from '@repo/hooks/sync';
import { STORE_NAME } from '@repo/constants/names';

export default function Sync({ children }: { children: React.ReactNode }) {
  const networkStatus = useNetwork();

  const session = useStoreSession((s) => s.session);
  const syncStatus = useStoreSyncStatus((s) => s.syncStatus);
  const setSyncStatus = useStoreSyncStatus((s) => s.setSyncStatus);

  // This now handles a MergedSyncPayload rather than one store's SyncParams
  const debounceMergedSyncToServer = useDebouncedCallback(
    syncToServerAfterDelay,
    500
  );

  const restProps = {
    setSyncStatus,
    session,
    networkStatus,
    syncStatus,
    debounceMergedSyncToServer,
    clientOnly: false,
  };

  useMergedSync({
    syncStatus: restProps.syncStatus,
    online: networkStatus.online,
    storesToSync: [],
    handleSync: (payload: MergedSyncPayload) =>
      handleMergedSync({ payload, ...restProps }),
  });

  return <div>{children}</div>;
}
