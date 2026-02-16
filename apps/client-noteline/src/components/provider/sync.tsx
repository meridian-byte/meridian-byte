'use client';

/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import React, { useEffect } from 'react';
import { useDebouncedCallback, useNetwork } from '@mantine/hooks';
import { useStoreSession } from '@/libraries/zustand/stores/session';
import { useStoreSyncStatus } from '@/libraries/zustand/stores/sync-status';
import { handleSync, syncToServerAfterDelay } from '@/utilities/sync';
import { useSyncLinks, useSyncNotebooks, useSyncNotes } from '@/hooks/sync';
import { SyncParams } from '@repo/types/sync';
import { useSyncQueue } from '@repo/utilities/sync';

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

  // const { syncPosts } = useSyncPosts({
  //   syncFunction: (i: SyncParams) => enqueueSync({ ...i, ...restProps }),
  //   online: networkStatus.online,
  // });

  // const { syncCategories } = useSyncCategories({
  //   syncFunction: (i: SyncParams) => enqueueSync({ ...i, ...restProps }),
  //   online: networkStatus.online,
  // });

  const { syncNotebooks } = useSyncNotebooks({
    syncFunction: (i: SyncParams) => enqueueSync({ ...i, ...restProps }),
    online: networkStatus.online,
  });

  const { syncNotes } = useSyncNotes({
    syncFunction: (i: SyncParams) => enqueueSync({ ...i, ...restProps }),
    online: networkStatus.online,
  });

  const { syncLinks } = useSyncLinks({
    syncFunction: (i: SyncParams) => enqueueSync({ ...i, ...restProps }),
    online: networkStatus.online,
  });

  useEffect(() => {
    if (!networkStatus.online) return;

    // syncPosts();
    // syncCategories();
    syncNotes();
    syncNotebooks();
    syncLinks();
  }, [
    networkStatus.online,
    // syncPosts,
    // syncCategories,
    syncNotes,
    syncNotebooks,
    syncLinks,
  ]);

  return <div>{children}</div>;
}
