/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { openDatabase } from './indexed-db/actions';
import { config } from './indexed-db/config';
import { SyncStatus } from '@repo/types/models/enums';
import { FileSyncAdapter } from '@repo/types/fsa';
import { SessionValue } from '@repo/libraries/zustand/stores/session';
import { RefObject } from 'react';

// Helper function to merge local and server items
export const mergeItems = async (
  dataStore: string,
  clientItems: any[],
  serverItems: any[]
): Promise<any[]> => {
  // get items with DELETED sync status from server items
  const deletedServerItems = serverItems.filter(
    (item) => item.sync_status == SyncStatus.DELETED
  );

  let deletedItems: string[] = [];

  if (deletedServerItems.length) {
    deletedItems = clientItems
      .map((item) => item.id)
      .filter((id) => deletedServerItems.some((item) => item.id === id));

    if (deletedItems.length) {
      const db = await openDatabase(config);
      await db.delete(
        dataStore,
        clientItems.filter((i) => deletedItems.includes(i.id))
      );
    }
  }

  // filter out items with DELETED sync status from client items
  const filteredClientItems = clientItems.filter((item) => {
    const isNotDeletedOnServer = !deletedItems.includes(item.id);
    const isNotDeletedOnClient = item.sync_status != SyncStatus.DELETED;
    return isNotDeletedOnServer && isNotDeletedOnClient;
  });

  const mergedItems = [...filteredClientItems];

  // filter out items with DELETED sync status from server items
  const filteredServerItems = serverItems.filter(
    (item) => item.sync_status != SyncStatus.DELETED
  );

  const now = new Date();

  filteredServerItems.forEach((serverItem) => {
    const localIndex = mergedItems.findIndex((i) => i.id === serverItem.id);
    const localItem = localIndex !== -1 ? mergedItems[localIndex] : null;

    const serverItemLastUpdated = new Date(serverItem.updated_at);
    const localItemLastUpdated = new Date(localItem?.updated_at || now);

    if (
      !localItem ||
      serverItemLastUpdated.getTime() > localItemLastUpdated.getTime()
    ) {
      const updatedItem = {
        ...serverItem,
        sync_status: SyncStatus.SYNCED,
        updated_at: serverItemLastUpdated.toISOString(),
      };

      if (localIndex !== -1) {
        mergedItems[localIndex] = updatedItem;
      } else {
        mergedItems.push(updatedItem);
      }
    }
  });

  return mergedItems;
};

export const loadInitialData = async (params: {
  dataStore: string;
  session: SessionValue;
  serverItems: any[]; // Directly pass the data from the combined fetch
  options?: { clientOnly?: boolean; fileSyncAdapter?: FileSyncAdapter };
  stateUpdateFunction: (items: any[]) => void;
}) => {
  const { clientOnly, fileSyncAdapter } = params.options || {};
  const { session, dataStore, serverItems, stateUpdateFunction } = params;

  try {
    const db = await openDatabase(config);
    let clientItems: any[] = await db.get(dataStore);

    // 1. Reconcile profile IDs for offline-created items
    if (session?.id) {
      clientItems = clientItems.map((i) => ({
        ...i,
        profile_id: i.profile_id || session.id,
      }));
    }

    let combinedItems: any[] = [];

    // 2. Logic: Empty Local DB vs. Existing Local DB
    if (!clientOnly && (!clientItems || clientItems.length === 0)) {
      // First-time sync: Filter and save server data locally
      const filteredServerItems = serverItems
        .filter((item) => item.sync_status !== SyncStatus.DELETED)
        .map((item) => ({
          ...item,
          updated_at: new Date(item.updated_at).toISOString(),
        }));

      if (filteredServerItems.length > 0) {
        await db.add(dataStore, filteredServerItems);
      }
      combinedItems = filteredServerItems;
    } else {
      // Reconcile / Merge
      let source = clientItems;

      if (clientOnly && fileSyncAdapter) {
        const bundle = await fileSyncAdapter.readBackup();
        source = bundle?.[dataStore.toLowerCase()] || clientItems;
      }

      const filteredItems = source.filter(
        (i) => i.sync_status !== SyncStatus.DELETED
      );

      if (!serverItems.length) {
        combinedItems = filteredItems;
      } else {
        combinedItems = await mergeItems(dataStore, clientItems, serverItems);
      }

      // 3. Update IndexedDB if data has changed
      // Comparison logic is now internal to the sync process
      await db.put(dataStore, combinedItems);
    }

    // 4. Update the Zustand/Global Store
    stateUpdateFunction(combinedItems);
  } catch (error) {
    console.error(`Sync error for ${dataStore}:`, (error as Error).message);
  }
};
