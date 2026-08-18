'use client';

/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { useEffect } from 'react';
import { STORE_NAME } from '@repo/constants';
import { useStoreWorkspace } from '../workspace';
import { SessionValue, useStoreSession } from '../session';
import { useStoreNote } from '../note';
import { useStoreEvent } from '../event';
import { useStoreLink } from '../link';
import { openDatabase } from '../../indexed-db/actions';
import { config } from '../../indexed-db/config';
import { FileSyncAdapter, SyncStatus } from '@repo/types';
import { useStoreCalendar } from '../calendar';
import { useStoreTaskList } from '../task-list';
import { useStoreTask } from '../task';
import { useStoreRecurringRule } from '../recurring-rule';
import { useStoreReminder } from '../reminder';

const mergeItems = async (
  dataStore: string,
  clientItems: any[],
  serverItems: any[],
): Promise<any[]> => {
  const db = await openDatabase(config);

  // 1. Identify items the server says are deleted
  const serverDeletedItems = serverItems
    .filter((item) => item.syncStatus === SyncStatus.DELETED)
    .map((item) => ({ id: item.id })); // Wrap in object to satisfy your helper's 'item[actualKeyPath]'

  const serverDeletedIds = serverDeletedItems.map((i) => i.id);

  // 2. Remove those IDs from IndexedDB immediately to ensure consistency
  if (serverDeletedItems.length > 0) {
    await db.delete(dataStore, serverDeletedItems);
  }

  // 3. Filter client items: remove what server deleted + what client marked deleted
  const activeClientItems = clientItems.filter(
    (item) => !serverDeletedIds.includes(item.id) && item.syncStatus !== SyncStatus.DELETED,
  );

  const mergedMap = new Map(activeClientItems.map((item) => [item.id, item]));

  // 4. Merge Server updates
  serverItems.forEach((serverItem) => {
    if (serverItem.syncStatus === SyncStatus.DELETED) return;

    const localItem = mergedMap.get(serverItem.id);
    const serverTime = new Date(serverItem.updatedAt).getTime();
    const localTime = localItem ? new Date(localItem.updatedAt).getTime() : 0;

    // Update if local doesn't exist OR server is strictly newer
    if (!localItem || serverTime > localTime) {
      mergedMap.set(serverItem.id, {
        ...serverItem,
        syncStatus: SyncStatus.SYNCED,
        updatedAt: new Date(serverItem.updatedAt).toISOString(),
      });
    }
  });

  return Array.from(mergedMap.values());
};

const loadInitialData = async (params: {
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

    // 1. Attach profileId for offline-created items if session exists
    if (session?.id) {
      clientItems = clientItems.map((i) => ({
        ...i,
        profileId: i.profileId || session.id,
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
      combinedItems = source.filter((i) => i.syncStatus !== SyncStatus.DELETED);
    }

    // 3. Scenario B: Server-Sync Mode
    else {
      if (clientItems.length === 0 && serverItems.length > 0) {
        // First-time sync (Cold start)
        combinedItems = serverItems
          .filter((item) => item.syncStatus !== SyncStatus.DELETED)
          .map((item) => ({
            ...item,
            updatedAt: new Date(item.updatedAt).toISOString(),
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

type LoadStoreConfig<TItems = any, THookReturn = any> = {
  dataStore: (typeof STORE_NAME)[keyof typeof STORE_NAME];
  useStoreHook: () => THookReturn;
  setState: (store: THookReturn, items: TItems[]) => void;
};

export const LOAD_STORES: Record<string, LoadStoreConfig> = {
  workspaces: {
    dataStore: STORE_NAME.WORKSPACES,
    useStoreHook: useStoreWorkspace,
    setState: (store, items) => store.setWorkspaces(items),
  },

  // Pave
  calendars: {
    dataStore: STORE_NAME.CALENDARS,
    useStoreHook: useStoreCalendar,
    setState: (store, items) => store.setCalendars(items),
  },
  events: {
    dataStore: STORE_NAME.EVENTS,
    useStoreHook: useStoreEvent,
    setState: (store, items) => store.setEvents(items),
  },

  // Jot
  notes: {
    dataStore: STORE_NAME.NOTES,
    useStoreHook: useStoreNote,
    setState: (store, items) => store.setNotes(items),
  },
  links: {
    dataStore: STORE_NAME.LINKS,
    useStoreHook: useStoreLink,
    setState: (store, items) => store.setLinks(items),
  },

  // Stride
  taskLists: {
    dataStore: STORE_NAME.TASK_LISTS,
    useStoreHook: useStoreTaskList,
    setState: (store, items) => store.setTaskLists(items),
  },
  recurringRules: {
    dataStore: STORE_NAME.RECURRING_RULES,
    useStoreHook: useStoreRecurringRule,
    setState: (store, items) => store.setRecurringRules(items),
  },
  tasks: {
    dataStore: STORE_NAME.TASKS,
    useStoreHook: useStoreTask,
    setState: (store, items) => store.setTasks(items),
  },
  reminders: {
    dataStore: STORE_NAME.REMINDERS,
    useStoreHook: useStoreReminder,
    setState: (store, items) => store.setReminders(items),
  },
} as const;

type LoadStoreKey = keyof typeof LOAD_STORES;

export const useLoadAppData = (options: {
  apiUrl: string;
  storesToLoad: Partial<Record<LoadStoreKey, boolean>>;
  clientOnly?: boolean;
}) => {
  const session = useStoreSession((s) => s.session);

  const stores = {
    [STORE_NAME.WORKSPACES]: useStoreWorkspace(),

    // Pave
    [STORE_NAME.CALENDARS]: useStoreCalendar(),
    [STORE_NAME.EVENTS]: useStoreEvent(),

    // Jot
    [STORE_NAME.NOTES]: useStoreNote(),
    [STORE_NAME.LINKS]: useStoreLink(),

    // Stride
    [STORE_NAME.TASK_LISTS]: useStoreTaskList(),
    [STORE_NAME.RECURRING_RULES]: useStoreRecurringRule(),
    [STORE_NAME.TASKS]: useStoreTask(),
    [STORE_NAME.REMINDERS]: useStoreReminder(),
  };

  useEffect(() => {
    if (!session?.id) return;

    const syncAll = async () => {
      try {
        // 1. Identify which keys are set to 'true'
        const activeStoreKeys = (Object.keys(options.storesToLoad) as LoadStoreKey[]).filter(
          (key) => options.storesToLoad[key],
        );

        if (activeStoreKeys.length === 0) return;

        // 2. Fetch only the required data
        // Pass the requested stores as a query param so the server can optimize
        const storeQuery = activeStoreKeys.join(',');

        const res = await fetch(
          `${options.apiUrl}/app-data?userId=${session.id}&stores=${storeQuery}`,
        );

        if (!res.ok) {
          const errorText = await res.text().catch(() => 'No response body');

          throw new Error(
            `Failed to fetch app data (${res.status} ${res.statusText}): ${errorText}`,
          );
        }

        const fullPayload = await res.json();

        // 2. Process each store in parallel (only the active stores)
        const syncPromises = activeStoreKeys.map(async (key) => {
          const config = LOAD_STORES[key];
          const serverData = fullPayload[key] || [];
          const storeInstance = stores[key as keyof typeof stores];

          if (!config || !storeInstance) return;

          return loadInitialData({
            dataStore: config.dataStore,
            session,
            options: { clientOnly: options.clientOnly },
            serverItems: serverData,
            stateUpdateFunction: (items) => config.setState(storeInstance, items),
          });
        });

        await Promise.all(syncPromises);
      } catch (e) {
        console.error('Data initialization failed:', e);
      }
    };

    syncAll();
  }, [session?.id, JSON.stringify(options.storesToLoad), options.clientOnly]);
};
