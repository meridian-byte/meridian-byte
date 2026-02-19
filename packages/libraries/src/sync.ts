import { config } from './indexed-db/config';
import { openDatabase } from '@repo/libraries/indexed-db/actions';
import { SyncStatus } from '@repo/types/models/enums';
import { SyncItem, SyncParams } from '@repo/types/sync';
import { DatabaseError } from '@repo/libraries/indexed-db/transactions';
import { SyncStatusValue } from '@repo/libraries/zustand/stores/sync-status';
import { SessionValue } from '@repo/libraries/zustand/stores/session';
import { UserNetworkReturnValue } from '@mantine/hooks';
import React from 'react';

export const handleSync = async (
  params: SyncParams & {
    setSyncStatus: (data: SyncStatusValue) => void;
    session: SessionValue;
    networkStatus: UserNetworkReturnValue;
    syncStatus: SyncStatusValue;
    debounceSyncToServer: (...args: any) => void;
    clientOnly?: boolean;
  }
) => {
  const {
    setSyncStatus,
    session,
    networkStatus,
    debounceSyncToServer,
    clientOnly,
    ...syncParams
  } = params;

  try {
    const isOnline = networkStatus.online;

    const { hasPendingItems, hasDeletedItems, hasSavedItems, hasErrorItems } =
      triggerClientSync({
        items: syncParams.items,
        deletedItems: syncParams.deletedItems || [],
        syncStatus: params.syncStatus,
        online: isOnline,
      });

    if (hasPendingItems || hasDeletedItems) {
      setSyncStatus(SyncStatus.PENDING);

      // update the client DB with pending items
      await syncToClientDB({ ...syncParams, online: isOnline, sameDate: true });

      if (params.clientOnly) {
        setSyncStatus(SyncStatus.SAVED);
      }
    }

    // sync to the server if online and signed in and not client only
    if (isOnline && session && !clientOnly) {
      if (
        hasPendingItems ||
        hasDeletedItems ||
        hasSavedItems ||
        hasErrorItems
      ) {
        // Start/restart debounce timer
        debounceSyncToServer(params);
      }
    }
  } catch (error) {
    setSyncStatus(SyncStatus.ERROR);
    console.error('Sync Error:', (error as Error).message);
  }
};

export const syncToServerDB = async (
  params: SyncParams
): Promise<void | { updatedItems?: SyncItem[]; errorItems?: SyncItem[] }> => {
  const syncedItems = params.items.filter(
    (p) => p.sync_status == SyncStatus.SYNCED
  );

  const unsyncedItems = [
    ...params.items,
    ...(params.deletedItems || []),
  ].filter((p) => p.sync_status != SyncStatus.SYNCED);

  const now = new Date();

  try {
    // Prepare updated items for syncing
    const updatedI = unsyncedItems.map((item) => {
      return {
        ...item,
        updated_at: now,
        sync_status:
          item.sync_status == SyncStatus.DELETED
            ? SyncStatus.DELETED
            : SyncStatus.SYNCED,
      };
    });

    // Sync with server DB
    await params.serverUpdateFunction(
      updatedI,
      (params.deletedItems || []).map((i) => i.id)
    );

    return { updatedItems: [...updatedI, ...syncedItems] };
  } catch (error) {
    // Mark items as error if sync fails
    const errorI = unsyncedItems.map((item) => {
      return { ...item, updated_at: now, sync_status: SyncStatus.ERROR };
    });

    console.error('Sync to Server Error:', (error as Error).message);

    return { errorItems: errorI };
  }
};

export const syncToClientDB = async (
  params: SyncParams & {
    sameDate?: boolean;
    online?: boolean;
    cleanup?: boolean;
    options?: { fromServer?: boolean };
  }
) => {
  if (params.options?.fromServer) {
    params.items = dedupeBy(params.items, (i) => i.id);
    params.deletedItems = dedupeBy(params.deletedItems || [], (i) => i.id);
  }

  const syncedItems = params.items.filter(
    (p) => p.sync_status == SyncStatus.SYNCED
  );

  const unsyncedItems = [
    ...params.items,
    ...(params.options?.fromServer ? [] : params.deletedItems || []),
  ].filter((p) => p.sync_status != SyncStatus.SYNCED);

  try {
    const db = await openDatabase(config);

    // Update IndexedDB with unsynced items items

    let savedItems: any[] = params.options?.fromServer ? params.items : [];

    if (unsyncedItems.length) {
      savedItems = unsyncedItems.map((item) => {
        return {
          ...item,
          updated_at: params.sameDate
            ? item.updated_at
            : new Date().toISOString(),
          sync_status:
            item.sync_status == SyncStatus.DELETED
              ? SyncStatus.DELETED
              : item.sync_status == SyncStatus.ERROR
                ? SyncStatus.ERROR
                : SyncStatus.SAVED,
        };
      });
    }

    if (!savedItems.length) return;

    if (params.cleanup) {
      const deletedItems = savedItems.filter(
        (i) => i.sync_status == SyncStatus.DELETED
      );

      if (deletedItems.length) {
        // remove items with sync status DELETE from client
        await db.delete(params.dataStore, deletedItems);
      }
    }

    const savedItemsNotDeleted: any[] = savedItems.filter(
      (i) => i.sync_status != SyncStatus.DELETED
    );

    const clientDbItems = params.cleanup ? savedItemsNotDeleted : savedItems;

    const finalClientDbItems = params.options?.fromServer
      ? clientDbItems
      : [...clientDbItems, ...syncedItems];

    await db.put(params.dataStore, finalClientDbItems);

    const stateItems = params.options?.fromServer
      ? syncedItems
      : finalClientDbItems.filter((i) => i.sync_status != SyncStatus.DELETED);

    if (params.deletedItems?.length) {
      params.stateUpdateFunctionDeleted();
    }

    params.stateUpdateFunction(stateItems);
  } catch (error) {
    console.error('Client DB Sync Error:', (error as DatabaseError).message);
    throw error;
  }
};

export const syncToServerAfterDelay = async (
  params: SyncParams & {
    setSyncStatus: (data: SyncStatusValue) => void;
    session: SessionValue;
    networkStatus: UserNetworkReturnValue;
    syncStatus: SyncStatusValue;
  }
) => {
  const { setSyncStatus, networkStatus, ...syncParams } = params;

  try {
    const db = await openDatabase(config);
    const clientDbItems: any[] | undefined = await db.get(syncParams.dataStore);

    const serverItems = await syncToServerDB({
      ...syncParams,
      items: clientDbItems || [],
    });

    if (!clientDbItems) return;

    if (serverItems?.errorItems) {
      // update the client DB items' to error status
      await syncToClientDB({
        ...syncParams,
        online: networkStatus.online,
        items: serverItems.errorItems.map((ei) => {
          const latest = params.items.find((i) => i.id === ei.id);

          if (!latest) return ei;

          return {
            ...latest,
            sync_status: SyncStatus.ERROR,
          };
        }),
        options: { fromServer: true },
      });

      setSyncStatus(SyncStatus.ERROR);

      return;
    }

    if (serverItems?.updatedItems) {
      // update the client DB items' to synced status
      await syncToClientDB({
        ...syncParams,
        online: networkStatus.online,
        cleanup: true, // cleanup deleted items
        items: serverItems.updatedItems.map((ui) => {
          const latest = params.items.find((i) => i.id === ui.id);

          if (!latest) return ui;

          return {
            ...latest,
            sync_status: ui.sync_status,
          };
        }),
        options: { fromServer: true },
      });

      setSyncStatus(SyncStatus.SYNCED);
    }
  } catch (error) {
    console.error('Sync to Server Error:', (error as Error).message);
  }
};

export const useSyncQueue = (params: {
  syncFunction: (input: any) => void;
}) => {
  const queue = React.useRef<any[]>([]);
  const running = React.useRef(false);

  const runNext = React.useCallback(async () => {
    if (running.current) return;
    const job = queue.current.shift();
    if (!job) return;

    running.current = true;

    try {
      await params.syncFunction(job); // <-- your existing sync logic
    } finally {
      running.current = false;
      runNext(); // process next
    }
  }, []);

  const enqueue = React.useCallback(
    (job: any) => {
      // queue.current = queue.current.filter((j) => j.type !== job.type); // remove old same-type
      queue.current.push(job);
      runNext();
    },
    [runNext]
  );

  return enqueue;
};

export const triggerClientSync = (params: {
  items: any[];
  deletedItems: any[];
  syncStatus: SyncStatus;
  online: boolean;
}) => {
  const hasDeletedItems = params.deletedItems.length > 0;

  let hasPendingItems: boolean = false;

  hasPendingItems = params.items.some(
    (i) => i.sync_status == SyncStatus.PENDING
  );

  let hasSavedItems: boolean = false;
  let hasErrorItems: boolean = false;

  if (params.online) {
    hasSavedItems = params.items.some((i) => i.sync_status == SyncStatus.SAVED);
    hasErrorItems = params.items.some((i) => i.sync_status == SyncStatus.ERROR);
  }

  return { hasPendingItems, hasSavedItems, hasDeletedItems, hasErrorItems };
};

function dedupeBy<T, K>(arr: T[], key: (item: T) => K): T[] {
  return Array.from(new Map(arr.map((i) => [key(i), i])).values());
}
