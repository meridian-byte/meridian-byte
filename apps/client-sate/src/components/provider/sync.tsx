'use client';

/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import React, { useEffect } from 'react';
import {
  useDebouncedCallback,
  useNetwork,
  useThrottledCallback,
} from '@mantine/hooks';
import { useStoreSession } from '@/libraries/zustand/stores/session';
import { useStoreSyncStatus } from '@/libraries/zustand/stores/sync-status';
import { handleSync, syncToServerAfterDelay } from '@/utilities/sync';
import {
  useSyncFoods,
  useSyncMeals,
  useSyncServings,
  useSyncEats,
} from '@/hooks/sync';
import { SyncParams } from '@repo/types/sync';

export default function Sync({
  children,
  options,
}: {
  children: React.ReactNode;
  options?: { clientOnly?: boolean };
}) {
  const { clientOnly } = options || {};

  const networkStatus = useNetwork();

  const { session } = useStoreSession();
  const { syncStatus, setSyncStatus } = useStoreSyncStatus();

  const debounceSync = useThrottledCallback(handleSync, 1000);

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
    clientOnly,
  };

  const { syncFoods } = useSyncFoods({
    syncFunction: (i: SyncParams) => debounceSync({ ...i, ...restProps }),
    online: networkStatus.online,
  });

  const { syncMeals } = useSyncMeals({
    syncFunction: (i: SyncParams) => debounceSync({ ...i, ...restProps }),
    online: networkStatus.online,
  });

  const { syncServings } = useSyncServings({
    syncFunction: (i: SyncParams) => debounceSync({ ...i, ...restProps }),
    online: networkStatus.online,
  });

  const { syncEats } = useSyncEats({
    syncFunction: (i: SyncParams) => debounceSync({ ...i, ...restProps }),
    online: networkStatus.online,
  });

  useEffect(() => {
    if (!networkStatus.online) return;

    syncFoods();
    syncMeals();
    syncServings();
    syncEats();
  }, [networkStatus.online, syncFoods, syncMeals, syncServings, syncEats]);

  return <div>{children}</div>;
}
