/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { openDatabase } from '@repo/libraries/indexed-db/actions';
import { config } from '@/libraries/indexed-db';
import { SyncStatus } from '@repo/types/models/enums';
import { RefObject } from 'react';
import { FileSyncAdapter } from '@repo/types/fsa';
import { SessionValue } from '@/libraries/zustand/stores/session';

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

    const serverItemLastUpdated = new Date(serverItem.updatedAt);
    const localItemLastUpdated = new Date(localItem?.updatedAt || now);

    if (
      !localItem ||
      serverItemLastUpdated.getTime() > localItemLastUpdated.getTime()
    ) {
      const updatedItem = {
        ...serverItem,
        sync_status: SyncStatus.SYNCED,
        updated_at: serverItem.updated_at.toISOString(),
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
  prevItemsRef: RefObject<any[]>;
  dataStore: string;
  session: SessionValue;
  fileSyncAdapter?: FileSyncAdapter;
  options?: { clientOnly?: boolean };
  dataFetchFunction: (items?: any[]) => Promise<{ items: any[] }>;
  stateUpdateFunction: (items: any[]) => void;
  // deletedStateUpdateFunction?: (items: any[]) => void;
}) => {
  const { clientOnly } = params.options || {};

  let combinedItems: any[] = [];

  const db = await openDatabase(config);
  let clientItems: any[] = [];

  clientItems = await db.get(params.dataStore);

  // reconcile possible case of multiple temporary user ids
  const { session } = params;

  if (session) {
    clientItems.map((i) => {
      return { ...i, profile_id: session.id || null };
    });
  }

  try {
    let serverItems: any[] = [];

    const fetchedServerItems: { items: any[]; deletedItems?: any[] } =
      await params.dataFetchFunction();

    serverItems = fetchedServerItems.items;

    if (!clientOnly && !clientItems?.length) {
      // filter out items with DELETED sync status from server items
      const filteredServerItems = serverItems.filter(
        (item) => item.sync_status !== SyncStatus.DELETED
      );

      if (filteredServerItems.length) {
        const indexedServerItems = filteredServerItems.map((item) => ({
          ...item,
          // sync_status: SyncStatus.SYNCED,
          updated_at: new Date(item.updated_at).toISOString(),
        }));

        await db.put(params.dataStore, indexedServerItems);

        combinedItems = indexedServerItems as any[];

        // Initialize prevItemsRef with indexed items
        params.prevItemsRef.current = indexedServerItems as any[];
      }
    } else {
      let mergedItems: any[] = [];
      let fsItems: any[] = [];

      if (clientOnly && params.fileSyncAdapter) {
        const bundle = await params.fileSyncAdapter.readBackup();
        fsItems = bundle?.[params.dataStore.toLowerCase()] || [];
      }

      const source = clientItems?.length ? clientItems : fsItems;

      const filteredItems = source.filter(
        (item) => item.sync_status != SyncStatus.DELETED
      );

      let lengthComparison;
      let serialComparison;

      if (!serverItems.length) {
        mergedItems = filteredItems;
        lengthComparison = mergedItems.length !== filteredItems.length;
        serialComparison =
          JSON.stringify(mergedItems) !== JSON.stringify(filteredItems);
      } else {
        mergedItems = await mergeItems(
          params.dataStore,
          clientItems,
          serverItems
        );
        lengthComparison = mergedItems.length !== clientItems.length;
        serialComparison =
          JSON.stringify(mergedItems) !== JSON.stringify(clientItems);
      }

      if (lengthComparison || serialComparison) {
        await db.put(params.dataStore, mergedItems);
      }

      combinedItems = mergedItems;

      // Initialize prevItemsRef with indexed items
      params.prevItemsRef.current = mergedItems;
    }
  } catch (error) {
    console.error('Initial data load error: ', (error as Error).message);
  }

  params.stateUpdateFunction(combinedItems);
};
