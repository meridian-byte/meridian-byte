import { config } from '@/libraries/indexed-db';
import { openDatabase } from '@repo/libraries/indexed-db/actions';
import { SyncStatus } from '@repo/types/models/enums';
import { SyncItem, SyncParams } from '@repo/types/sync';
import { DatabaseError } from '@repo/libraries/indexed-db/transactions';
import { SyncStatusValue } from '@/libraries/zustand/stores/sync-status';
import { SessionValue } from '@/libraries/zustand/stores/session';
import { UserNetworkReturnValue } from '@mantine/hooks';

export const syncToServerAfterDelay = async (
  params: SyncParams & {
    setSyncStatus: (data: SyncStatusValue) => void;
    session: SessionValue;
    networkStatus: UserNetworkReturnValue;
  }
) => {
  const { setSyncStatus, session, networkStatus, ...syncParams } = params;

  try {
    const db = await openDatabase(config);
    const clientDbItems: any[] | undefined = await db.get(syncParams.dataStore);

    const clientDbItemsWithSessionId = clientDbItems?.map((cdi) => {
      return { ...cdi, profile_id: session?.id };
    });

    const serverItems = await syncToServerDB({
      ...syncParams,
      items: clientDbItemsWithSessionId || [],
    });

    if (!clientDbItems) return;

    if (serverItems?.errorItems) {
      // update the client DB items' to error status
      await syncToClientDB({
        ...syncParams,
        online: networkStatus.online,
        items: serverItems.errorItems.map((ei) => {
          const clientDbItem =
            clientDbItems.find((cdi) => cdi.id === ei.id) || ei;
          return {
            ...clientDbItem,
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
          const clientDbItem =
            clientDbItems.find((cdi) => cdi.id === ui.id) || ui;
          return {
            ...clientDbItem,
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
    syncStatus,
    debounceSyncToServer,
    clientOnly,
    ...syncParams
  } = params;

  try {
    const isOnline = networkStatus.online;

    const triggerClient = triggerClientSync({
      items: syncParams.items,
      deletedItems: syncParams.deletedItems || [],
      syncStatus,
      online: networkStatus.online,
    });

    if (!triggerClient) return;

    setSyncStatus(SyncStatus.PENDING);

    // update the client DB with pending items
    await syncToClientDB({ ...syncParams, online: isOnline, sameDate: true });

    // sync to the server if online and signed in and not client only
    if (isOnline && session && !clientOnly) {
      // Start/restart debounce timer
      debounceSyncToServer(params);
    } else {
      setSyncStatus(SyncStatus.SAVED);
    }

    syncParams.stateUpdateFunctionDeleted();
  } catch (error) {
    setSyncStatus(SyncStatus.ERROR);
    console.error('Sync Error:', (error as Error).message);
  }
};

export const triggerClientSync = (params: {
  items: any[];
  deletedItems: any[];
  syncStatus: SyncStatus;
  online: boolean;
}) => {
  const hasDeletedTasks = params.deletedItems.length > 0;

  let hasPendingTasks: boolean = false;

  hasPendingTasks = params.items.some(
    (i) => i.sync_status === SyncStatus.PENDING
  );

  if (hasPendingTasks || hasDeletedTasks) return true;

  return false;
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
  const syncedItems = params.items.filter(
    (p) => p.sync_status == SyncStatus.SYNCED
  );

  const unsyncedItems = [
    ...params.items,
    ...(params.deletedItems || []),
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

    const deletedItems = savedItems.filter(
      (i) => i.sync_status == SyncStatus.DELETED
    );

    if (params.cleanup && deletedItems.length) {
      // remove items with sync status DELETE from client
      await db.delete(params.dataStore, deletedItems);
    }

    const savedItemsNotDeleted: any[] = savedItems.filter(
      (i) => i.sync_status != SyncStatus.DELETED
    );

    const newItems = params.cleanup ? savedItemsNotDeleted : savedItems;

    const finalItems = params.options?.fromServer
      ? newItems
      : [...newItems, ...syncedItems];

    await db.put(params.dataStore, finalItems);

    const finalStateItems = finalItems.filter(
      (i) => i.sync_status != SyncStatus.DELETED
    );

    params.stateUpdateFunction(finalStateItems);
  } catch (error) {
    console.error('Client DB Sync Error:', (error as DatabaseError).message);
    throw error;
  }
};
