/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { useCallback, useEffect } from 'react';
import { useIdle, UserNetworkReturnValue } from '@mantine/hooks';
import { config } from './indexed-db/config';
import { openDatabase } from './indexed-db/actions';
import { Database, DatabaseError } from './indexed-db/transactions';

import { STORE_NAME } from '@repo/constants';
import { SyncParams, SyncStatus } from '@repo/types';
import {
  eventsUpdate,
  workspacesUpdate,
  notesUpdate,
  linksUpdate,
  calendarsUpdate,
  taskListsUpdate,
  recurringRulesUpdate,
  tasksUpdate,
  remindersUpdate,
} from '@repo/handlers';

import { SessionValue, useStoreSession } from './state/session';
import { useStoreNote } from './state/note';
import { useStoreLink } from './state/link';
import { SyncStatusValue } from './state/sync-status';
import { useStoreWorkspace } from './state/workspace';
import { useStoreEvent } from './state/event';
import { useStoreCalendar } from './state/calendar';
import { useStoreTaskList } from './state/task-list';
import { useStoreRecurringRule } from './state/recurring-rule';
import { useStoreTask } from './state/task';
import { useStoreReminder } from './state/reminder';

const useSessionCheck = () => {
  const session = useStoreSession((s) => s.session);
  const noSession =
    session === undefined || (!session && (!(session as SessionValue)?.email as any));

  return { noSession };
};

type SyncStoreConfig<TItems = any, THookReturn = any> = {
  dataStore: (typeof STORE_NAME)[keyof typeof STORE_NAME];
  useStoreHook: () => THookReturn;
  serverUpdate: (apiurl: string, items: TItems[], deleted: TItems[]) => Promise<any>;
  getItems: (store: THookReturn) => TItems[];
  getDeleted: (store: THookReturn) => TItems[];
  setItems: (store: THookReturn, items: TItems[]) => void;
  clearDeleted: (store: THookReturn) => void;
};

export const SYNC_STORES: Record<string, SyncStoreConfig> = {
  [STORE_NAME.WORKSPACES]: {
    dataStore: STORE_NAME.WORKSPACES,
    useStoreHook: useStoreWorkspace,
    serverUpdate: workspacesUpdate,
    getItems: (store) => store.workspaces,
    getDeleted: (store) => store.deleted,
    setItems: (store, items) => store.setWorkspaces(items),
    clearDeleted: (store) => store.clearDeletedWorkspaces(),
  },

  // Pave
  [STORE_NAME.CALENDARS]: {
    dataStore: STORE_NAME.CALENDARS,
    useStoreHook: useStoreCalendar,
    serverUpdate: calendarsUpdate,
    getItems: (store) => store.calendars,
    getDeleted: (store) => store.deleted,
    setItems: (store, items) => store.setCalendars(items),
    clearDeleted: (store) => store.clearDeletedCalendars(),
  },
  [STORE_NAME.EVENTS]: {
    dataStore: STORE_NAME.EVENTS,
    useStoreHook: useStoreEvent,
    serverUpdate: eventsUpdate,
    getItems: (store) => store.events,
    getDeleted: (store) => store.deleted,
    setItems: (store, items) => store.setEvents(items),
    clearDeleted: (store) => store.clearDeletedEvents(),
  },

  // Jot
  [STORE_NAME.NOTES]: {
    dataStore: STORE_NAME.NOTES,
    useStoreHook: useStoreNote,
    serverUpdate: notesUpdate,
    getItems: (store) => store.notes,
    getDeleted: (store) => store.deleted,
    setItems: (store, items) => store.setNotes(items),
    clearDeleted: (store) => store.clearDeletedNotes(),
  },
  [STORE_NAME.LINKS]: {
    dataStore: STORE_NAME.LINKS,
    useStoreHook: useStoreLink,
    serverUpdate: linksUpdate,
    getItems: (store) => store.links,
    getDeleted: (store) => store.deleted,
    setItems: (store, items) => store.setLinks(items),
    clearDeleted: (store) => store.clearDeletedLinks(),
  },

  // Stride
  [STORE_NAME.TASK_LISTS]: {
    dataStore: STORE_NAME.TASK_LISTS,
    useStoreHook: useStoreTaskList,
    serverUpdate: taskListsUpdate,
    getItems: (store) => store.taskLists,
    getDeleted: (store) => store.deleted,
    setItems: (store, items) => store.setTaskLists(items),
    clearDeleted: (store) => store.clearDeletedTaskLists(),
  },
  [STORE_NAME.RECURRING_RULES]: {
    dataStore: STORE_NAME.RECURRING_RULES,
    useStoreHook: useStoreRecurringRule,
    serverUpdate: recurringRulesUpdate,
    getItems: (store) => store.recurringRules,
    getDeleted: (store) => store.deleted,
    setItems: (store, items) => store.setRecurringRules(items),
    clearDeleted: (store) => store.clearDeletedRecurringRules(),
  },
  [STORE_NAME.TASKS]: {
    dataStore: STORE_NAME.TASKS,
    useStoreHook: useStoreTask,
    serverUpdate: tasksUpdate,
    getItems: (store) => store.tasks,
    getDeleted: (store) => store.deleted,
    setItems: (store, items) => store.setTasks(items),
    clearDeleted: (store) => store.clearDeletedTasks(),
  },
  [STORE_NAME.REMINDERS]: {
    dataStore: STORE_NAME.REMINDERS,
    useStoreHook: useStoreReminder,
    serverUpdate: remindersUpdate,
    getItems: (store) => store.reminders,
    getDeleted: (store) => store.deleted,
    setItems: (store, items) => store.setReminders(items),
    clearDeleted: (store) => store.clearDeletedReminders(),
  },
} as const;

type SyncStoreKey = keyof typeof SYNC_STORES;

const SYNC_REGISTRY: Record<SyncStoreKey, any> = {
  [STORE_NAME.WORKSPACES]: {
    store: useStoreWorkspace,
    updateState: (items: any) => useStoreWorkspace.getState().setWorkspaces(items),
    clearDeleted: () => useStoreWorkspace.getState().clearDeletedWorkspaces(),
  },

  // Pave
  [STORE_NAME.CALENDARS]: {
    store: useStoreCalendar,
    updateState: (items: any) => useStoreCalendar.getState().setCalendars(items),
    clearDeleted: () => useStoreCalendar.getState().clearDeletedCalendars(),
  },
  [STORE_NAME.EVENTS]: {
    store: useStoreEvent,
    updateState: (items: any) => useStoreEvent.getState().setEvents(items),
    clearDeleted: () => useStoreEvent.getState().clearDeletedEvents(),
  },

  // Jot
  [STORE_NAME.NOTES]: {
    store: useStoreNote,
    updateState: (items: any) => useStoreNote.getState().setNotes(items),
    clearDeleted: () => useStoreNote.getState().clearDeletedNotes(),
  },
  [STORE_NAME.LINKS]: {
    store: useStoreLink,
    updateState: (items: any) => useStoreLink.getState().setLinks(items),
    clearDeleted: () => useStoreLink.getState().clearDeletedLinks(),
  },

  // Stride
  [STORE_NAME.TASK_LISTS]: {
    store: useStoreTaskList,
    updateState: (items: any) => useStoreTaskList.getState().setTaskLists(items),
    clearDeleted: () => useStoreTaskList.getState().clearDeletedTaskLists(),
  },
  [STORE_NAME.RECURRING_RULES]: {
    store: useStoreRecurringRule,
    updateState: (items: any) => useStoreRecurringRule.getState().setRecurringRules(items),
    clearDeleted: () => useStoreRecurringRule.getState().clearDeletedRecurringRules(),
  },
  [STORE_NAME.TASKS]: {
    store: useStoreTask,
    updateState: (items: any) => useStoreTask.getState().setTasks(items),
    clearDeleted: () => useStoreTask.getState().clearDeletedTasks(),
  },
  [STORE_NAME.REMINDERS]: {
    store: useStoreReminder,
    updateState: (items: any) => useStoreReminder.getState().setReminders(items),
    clearDeleted: () => useStoreReminder.getState().clearDeletedReminders(),
  },
};

// Define a shape for the payload
export interface MergedSyncPayload {
  [STORE_NAME.WORKSPACES]?: { items: any[]; deleted: any[] };

  // Pave
  [STORE_NAME.CALENDARS]?: { items: any[]; deleted: any[] };
  [STORE_NAME.EVENTS]?: { items: any[]; deleted: any[] };

  // Jot
  [STORE_NAME.NOTES]?: { items: any[]; deleted: any[] };
  [STORE_NAME.LINKS]?: { items: any[]; deleted: any[] };

  // Stride
  [STORE_NAME.TASK_LISTS]?: { items: any[]; deleted: any[] };
  [STORE_NAME.RECURRING_RULES]?: { items: any[]; deleted: any[] };
  [STORE_NAME.TASKS]?: { items: any[]; deleted: any[] };
  [STORE_NAME.REMINDERS]?: { items: any[]; deleted: any[] };
}

// Update the MergedSyncParams to handle multiple datasets
export type MergedSyncParams = {
  apiUrl: string;
  payload: MergedSyncPayload;
  onSuccess?: (key: keyof MergedSyncPayload, updatedItems: any[]) => void;
  onClearDeleted?: (key: keyof MergedSyncPayload) => void;
};

export const useMergedSync = (params: {
  online: boolean;
  storesToSync: SyncStoreKey[]; // Use an array for stability
  handleSync: (payload: MergedSyncPayload) => Promise<void>;
  syncStatus: SyncStatusValue;
}) => {
  const { online, storesToSync, handleSync } = params;
  const idle = useIdle(4000, { events: ['keypress', 'click'] });
  const { noSession } = useSessionCheck();

  // Call all hooks at the top level (Required by Hook Rules)
  const workspaceStore = useStoreWorkspace();
  const calendarStore = useStoreCalendar();
  const eventStore = useStoreEvent();
  const noteStore = useStoreNote();
  const linkStore = useStoreLink();
  const taskListStore = useStoreTaskList();
  const recurringRuleStore = useStoreRecurringRule();
  const taskStore = useStoreTask();
  const reminderStore = useStoreReminder();

  const stores = {
    [STORE_NAME.WORKSPACES]: workspaceStore,

    // Pave
    [STORE_NAME.CALENDARS]: calendarStore,
    [STORE_NAME.EVENTS]: eventStore,

    // Jot
    [STORE_NAME.NOTES]: noteStore,
    [STORE_NAME.LINKS]: linkStore,

    // Stride
    [STORE_NAME.TASK_LISTS]: taskListStore,
    [STORE_NAME.RECURRING_RULES]: recurringRuleStore,
    [STORE_NAME.TASKS]: taskStore,
    [STORE_NAME.REMINDERS]: reminderStore,
  };

  const sync = useCallback(async () => {
    const payload: MergedSyncPayload = {};
    let hasDirtyData = false;

    // Build the payload dynamically based on what's active
    storesToSync.forEach((key) => {
      const config = SYNC_STORES[key];

      // Safety Check: skip if config doesn't exist for this key
      if (!config) {
        console.warn(`Sync config for hook key "${key}" is missing in SYNC_STORES.`);
        return;
      }

      const store = (stores as any)[key];
      const items = config.getItems(store) ?? [];
      const deleted = config.getDeleted(store) ?? [];

      // ONLY add to payload if there is something that needs action
      const needsSync = items.some(
        (i) =>
          i.syncStatus === SyncStatus.PENDING ||
          i.syncStatus === SyncStatus.SAVED ||
          i.syncStatus === SyncStatus.ERROR ||
          (i.syncStatus === SyncStatus.SYNCED_CLIENT && isRecent(i.updatedAt || i.createdAt)),
      );

      if (needsSync || deleted.length > 0) {
        (payload as any)[key] = { items, deleted };
        hasDirtyData = true;
      }
    });

    // Only proceed if we actually have work to do
    if (hasDirtyData && params.syncStatus !== SyncStatus.PENDING) {
      await handleSync(payload);
    }
  }, [
    storesToSync,
    // workspaceStore,
    // calendarStore,
    // eventStore,
    // noteStore,
    // linkStore,
    // taskListStore,
    // recurringRuleStore,
    // taskStore,
    // reminderStore,
    handleSync,
    params.syncStatus,
  ]);

  useEffect(() => {
    if (!noSession && idle && online) {
      sync();
    }
  }, [online, noSession, idle, sync]);
};

export const handleMergedSync = async (
  params: MergedSyncParams & {
    setSyncStatus: (data: SyncStatusValue) => void;
    session: SessionValue;
    networkStatus: UserNetworkReturnValue;
    syncStatus: SyncStatusValue;
    debounceMergedSyncToServer: (...args: any) => void;
    clientOnly?: boolean;
  },
) => {
  const { payload, networkStatus, session, setSyncStatus, debounceMergedSyncToServer, clientOnly } =
    params;

  try {
    const db = await openDatabase(config);

    // 1. Client-Side Batch Update
    // We loop through the payload keys (e.g., ['posts', 'categories'])
    for (const [storeKey, data] of Object.entries(payload)) {
      const config = SYNC_STORES[storeKey as SyncStoreKey];
      const registry = SYNC_REGISTRY[storeKey as SyncStoreKey];

      await syncToClientDB({
        ...data,
        items: data?.items || [],
        deletedItems: data?.deleted || [],
        dataStore: config!.dataStore,
        stateUpdateFunction: registry.updateState,
        stateUpdateFunctionDeleted: registry.clearDeleted,
        online: networkStatus.online,
        clientOnly,
        sameDate: true,
        db,
        // ... pass relevant store-specific update functions from a registry
      });
    }

    // 2. PHASE TWO: Batch Sync to Server
    if (networkStatus.online && session) {
      // Instead of multiple debounced calls, we pass the WHOLE payload
      // to one debounced function that hits a single /api/sync/batch endpoint
      debounceMergedSyncToServer({ ...payload, db, ...params });
    }
  } catch (error) {
    setSyncStatus(SyncStatus.ERROR);
  }
};

export const syncToServerDBMerged = async (
  payload: MergedSyncPayload,
  options: { apiUrl: string },
) => {
  const now = new Date();
  const finalPayload: Record<string, any> = {};
  const activeStores: string[] = [];

  // Iterate through the keys (posts, categories, etc.)
  (Object.keys(payload) as SyncStoreKey[]).forEach((key) => {
    const data = (payload as any)[key];
    if (data && (data.items.length > 0 || data.deleted.length > 0)) {
      // This now contains { upserts: [...], deletedIds: [...] }
      finalPayload[key] = prepareStorePayload(key, data, now);
      activeStores.push(key);
    }
  });

  try {
    if (activeStores.length === 0) return;

    const response = await fetch(`${options.apiUrl}/app-data?stores=${activeStores.join(',')}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(finalPayload),
    });

    if (!response.ok) throw new Error('Network response was not ok');

    const result = await response.json();

    return { success: true, data: result };
  } catch (error) {
    // Handle mass error state
    console.error('Merged Server Sync Error:', error);
    return { success: false, error };
  }
};

const prepareStorePayload = (
  key: SyncStoreKey,
  data: { items: any[]; deleted: any[] } | undefined,
  now: Date,
) => {
  if (!data) return null;

  // 1. Get items that need saving/updating
  const upserts = data.items
    .filter((i) => i.syncStatus !== SyncStatus.SYNCED && i.syncStatus !== SyncStatus.DELETED)
    // ... rest of map
    .map((item) => ({
      ...item,
      updatedAt: now.toISOString(),
      syncStatus: SyncStatus.SYNCED,
    }));

  // 2. Get the IDs of items marked for deletion
  // This is where your cart items live after orderUpdate runs
  const deletedIds = data.deleted.map((i) => i.id);

  return {
    upserts, // Changed from [key] to a fixed key for easier API parsing
    deletedIds,
  };
};

export const handleServerResponse = async (
  responsePayload: Record<string, any>,
  networkStatus: UserNetworkReturnValue,
  db: Database,
) => {
  // 1. Iterate through the keys returned by the server
  for (const [key, items] of Object.entries(responsePayload)) {
    const config = SYNC_STORES[key as SyncStoreKey];
    const registry = SYNC_REGISTRY[key as SyncStoreKey];

    if (!config || !registry) continue;

    // 2. Update Client DB & Zustand to 'SYNCED'
    // We use your existing syncToClientDB but with 'fromServer' flag
    await syncToClientDB({
      items: items,
      deletedItems: [], // Server already handled deletions
      dataStore: config.dataStore,
      stateUpdateFunction: registry.updateState,
      stateUpdateFunctionDeleted: registry.clearDeleted,
      online: networkStatus.online,
      cleanup: true, // This removes DELETED items from IndexedDB
      options: { fromServer: true },
      db,
    });
  }
};

export const syncToServerAfterDelay = async (
  params: MergedSyncParams & {
    setSyncStatus: (data: SyncStatusValue) => void;
    session: SessionValue;
    networkStatus: UserNetworkReturnValue;
    syncStatus: SyncStatusValue;
    db: Database;
  },
) => {
  const { setSyncStatus, networkStatus, payload } = params;

  try {
    setSyncStatus(SyncStatus.PENDING);

    // 1. Send the merged payload
    const result = await syncToServerDBMerged(payload, { apiUrl: params.apiUrl });

    if (result?.error) {
      // handle errors (marking items with SyncStatus.ERROR)
      setSyncStatus(SyncStatus.ERROR);
      return;
    }

    // 2. Process the successful return to update local state
    if (result?.data) {
      await handleServerResponse(result.data, networkStatus, params.db);
    }

    setSyncStatus(SyncStatus.SYNCED);
  } catch (error) {
    setSyncStatus(SyncStatus.ERROR);
    console.error('Sync to Server Error:', error);
  }
};

export const syncToClientDB = async (
  params: SyncParams & {
    sameDate?: boolean;
    online?: boolean;
    clientOnly?: boolean;
    cleanup?: boolean;
    options?: { fromServer?: boolean };
    db: Database;
  },
) => {
  if (params.options?.fromServer) {
    params.items = dedupeBy(params.items, (i) => i.id);
    params.deletedItems = dedupeBy(params.deletedItems || [], (i) => i.id);
  }

  const syncedItems = params.items.filter((p) => p.syncStatus == SyncStatus.SYNCED);

  const unsyncedItems = [
    ...params.items,
    ...(params.options?.fromServer ? [] : params.deletedItems || []),
  ].filter((p) => p.syncStatus != SyncStatus.SYNCED);

  try {
    // Update IndexedDB with unsynced items items

    let savedItems: any[] = params.options?.fromServer ? params.items : [];

    if (unsyncedItems.length) {
      savedItems = unsyncedItems.map((item) => {
        return {
          ...item,
          updatedAt: params.sameDate ? item.updatedAt : new Date().toISOString(),
          syncStatus:
            item.syncStatus == SyncStatus.DELETED
              ? SyncStatus.DELETED
              : item.syncStatus == SyncStatus.ERROR
                ? SyncStatus.ERROR
                : params.online && !params.clientOnly
                  ? SyncStatus.SYNCED_CLIENT
                  : SyncStatus.SAVED,
        };
      });
    }

    if (!savedItems.length) return;

    if (params.cleanup) {
      const deletedItems = savedItems.filter((i) => i.syncStatus == SyncStatus.DELETED);

      if (deletedItems.length) {
        // remove items with sync status DELETE from client
        await params.db.delete(params.dataStore, deletedItems);
      }
    }

    const savedItemsNotDeleted: any[] = savedItems.filter(
      (i) => i.syncStatus != SyncStatus.DELETED,
    );

    const clientDbItems = params.cleanup ? savedItemsNotDeleted : savedItems;

    const finalClientDbItems = params.options?.fromServer
      ? clientDbItems
      : [...clientDbItems, ...syncedItems];

    await params.db.put(params.dataStore, finalClientDbItems);

    const stateItems = params.options?.fromServer
      ? syncedItems
      : finalClientDbItems.filter((i) => i.syncStatus != SyncStatus.DELETED);

    if (params.deletedItems?.length) {
      params.stateUpdateFunctionDeleted();
    }

    params.stateUpdateFunction(stateItems);
  } catch (error) {
    console.error('Client DB Sync Error:', (error as DatabaseError).message);
    throw error;
  }
};

function dedupeBy<T, K>(arr: T[], key: (item: T) => K): T[] {
  return Array.from(new Map(arr.map((i) => [key(i), i])).values());
}

const RECENT_THRESHOLD_MS = 10_000; // 10 seconds (tune this)

const isRecent = (date: string | Date) => {
  const t = new Date(date).getTime();
  return Date.now() - t < RECENT_THRESHOLD_MS;
};
