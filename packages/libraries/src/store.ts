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

export const mergeItems = async (
  dataStore: string,
  clientItems: any[],
  serverItems: any[]
): Promise<any[]> => {
  const db = await openDatabase(config);

  // 1. Identify items the server says are deleted
  const serverDeletedItems = serverItems
    .filter((item) => item.sync_status === SyncStatus.DELETED)
    .map((item) => ({ id: item.id })); // Wrap in object to satisfy your helper's 'item[actualKeyPath]'

  const serverDeletedIds = serverDeletedItems.map((i) => i.id);

  // 2. Remove those IDs from IndexedDB immediately to ensure consistency
  if (serverDeletedItems.length > 0) {
    await db.delete(dataStore, serverDeletedItems);
  }

  // 3. Filter client items: remove what server deleted + what client marked deleted
  const activeClientItems = clientItems.filter(
    (item) =>
      !serverDeletedIds.includes(item.id) &&
      item.sync_status !== SyncStatus.DELETED
  );

  const mergedMap = new Map(activeClientItems.map((item) => [item.id, item]));

  // 4. Merge Server updates
  serverItems.forEach((serverItem) => {
    if (serverItem.sync_status === SyncStatus.DELETED) return;

    const localItem = mergedMap.get(serverItem.id);
    const serverTime = new Date(serverItem.updated_at).getTime();
    const localTime = localItem ? new Date(localItem.updated_at).getTime() : 0;

    // Update if local doesn't exist OR server is strictly newer
    if (!localItem || serverTime > localTime) {
      mergedMap.set(serverItem.id, {
        ...serverItem,
        sync_status: SyncStatus.SYNCED,
        updated_at: new Date(serverItem.updated_at).toISOString(),
      });
    }
  });

  return Array.from(mergedMap.values());
};

export const loadInitialData = async (params: {
  dataStore: string;
  session: SessionValue;
  serverItems: any[];
  options?: { clientOnly?: boolean; fileSyncAdapter?: FileSyncAdapter };
  stateUpdateFunction: (items: any[]) => void;
}) => {
  const { clientOnly, fileSyncAdapter } = params.options || {};
  const { session, dataStore, serverItems, stateUpdateFunction } = params;

  try {
    const db = await openDatabase(config);
    let clientItems: any[] = (await db.get(dataStore)) || [];

    // 1. Attach profile_id for offline-created items if session exists
    if (session?.id) {
      clientItems = clientItems.map((i) => ({
        ...i,
        profile_id: i.profile_id || session.id,
      }));
    }

    let combinedItems: any[] = [];

    // 2. Scenario A: Local-Only Mode (Filesystem Backup or Pure Local)
    if (clientOnly) {
      let source = clientItems;
      if (fileSyncAdapter) {
        const bundle = await fileSyncAdapter.readBackup();
        source = bundle?.[dataStore.toLowerCase()] || clientItems;
      }
      // Filter out items the user deleted locally while offline
      combinedItems = source.filter(
        (i) => i.sync_status !== SyncStatus.DELETED
      );
    }

    // 3. Scenario B: Server-Sync Mode
    else {
      if (clientItems.length === 0 && serverItems.length > 0) {
        // First-time sync (Cold start)
        combinedItems = serverItems
          .filter((item) => item.sync_status !== SyncStatus.DELETED)
          .map((item) => ({
            ...item,
            updated_at: new Date(item.updated_at).toISOString(),
          }));
      } else {
        // Standard Reconcile (The logic that fixes your multi-device lag)
        combinedItems = await mergeItems(dataStore, clientItems, serverItems);
      }
    }

    // 4. Persistence: Sync the Merged State back to IndexedDB
    // We use .put to ensure the local DB is an exact mirror of our merged logic
    await db.put(dataStore, combinedItems);

    // 5. Update UI State (Zustand)
    stateUpdateFunction(combinedItems);
  } catch (error) {
    console.error(`Sync error for ${dataStore}:`, error);
  }
};
