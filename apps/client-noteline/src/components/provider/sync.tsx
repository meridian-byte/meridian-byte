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
import { handleSync, syncToServerAfterDelay } from '@repo/libraries/sync';
import { useSyncStores } from '@repo/hooks/sync';
import { SyncParams } from '@repo/types/sync';
import { useSyncQueue } from '@repo/libraries/sync';

export default function Sync({ children }: { children: React.ReactNode }) {
  const networkStatus = useNetwork();

  const session = useStoreSession((s) => s.session);
  const syncStatus = useStoreSyncStatus((s) => s.syncStatus);
  const setSyncStatus = useStoreSyncStatus((s) => s.setSyncStatus);

  const enqueueSync = useSyncQueue({ syncFunction: handleSync });

  const debounceSyncToServer = useDebouncedCallback(
    syncToServerAfterDelay,
    500
  );

  const restProps = {
    setSyncStatus,
    session,
    networkStatus,
    syncStatus,
    debounceSyncToServer,
    clientOnly: false,
  };

  useSyncStores({
    syncFunction: (i: SyncParams) => enqueueSync({ ...i, ...restProps }),
    online: networkStatus.online,
    storesToSync: {
      notes: true,
    },
  });

  return <div>{children}</div>;
}
