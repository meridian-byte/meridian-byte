'use client';

import React from 'react';
import { useDebouncedCallback, useNetwork } from '@mantine/hooks';
import {
  useStoreSession,
  useStoreSyncStatus,
  handleMergedSync,
  MergedSyncPayload,
  syncToServerAfterDelay,
  useMergedSync,
} from '@repo/store';
import { getClientApiUrl, STORE_NAME } from '@repo/constants';

export default function Sync({ children }: { children: React.ReactNode }) {
  const networkStatus = useNetwork();

  const session = useStoreSession((s) => s.session);
  const syncStatus = useStoreSyncStatus((s) => s.syncStatus);
  const setSyncStatus = useStoreSyncStatus((s) => s.setSyncStatus);

  // This now handles a MergedSyncPayload rather than one store's SyncParams
  const debounceMergedSyncToServer = useDebouncedCallback(syncToServerAfterDelay, 500);

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
    // Use an array of keys for stability in the hook's dependency array
    storesToSync: STORES_TO_SYNC,
    // The payload (i) passed here is now the MergedSyncPayload { notes, categories }
    handleSync: (payload: MergedSyncPayload) =>
      handleMergedSync({ payload, ...restProps, apiUrl: getClientApiUrl() }),
  });

  return <div>{children}</div>;
}

const STORES_TO_SYNC = [
  STORE_NAME.WORKSPACES,

  // Pave
  STORE_NAME.CALENDARS,
  STORE_NAME.EVENTS,

  // Jot
  STORE_NAME.NOTES,
  STORE_NAME.LINKS,

  // Stride
  STORE_NAME.TASK_LISTS,
  // STORE_NAME.RECURRING_RULES,
  STORE_NAME.TASKS,
  // STORE_NAME.REMINDERS,
];
