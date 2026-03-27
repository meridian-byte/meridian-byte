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
  const { session } = useStoreSession();
  const { syncStatus, setSyncStatus } = useStoreSyncStatus();
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
    clientOnly: true,
  };

  useSyncStores({
    syncFunction: (i: SyncParams) => enqueueSync({ ...i, ...restProps }),
    online: networkStatus.online,
    storesToSync: {
      categories: true,
      budgets: true,
      accounts: true,
      accountGroups: true,
      transactions: true,
    },
  });

  return <div>{children}</div>;
}
