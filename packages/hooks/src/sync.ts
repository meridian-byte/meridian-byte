/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { useCallback, useEffect } from 'react';
import { STORE_NAME } from '@repo/constants/names';
import { budgetsUpdate } from '@repo/handlers/requests/database/budgets';
import { accountsUpdate } from '@repo/handlers/requests/database/accounts';
import { accountGroupsUpdate } from '@repo/handlers/requests/database/account-groups';
import { transactionsUpdate } from '@repo/handlers/requests/database/transactions';
import { categoriesUpdate } from '@repo/handlers/requests/database/category';
import { useStoreCategory } from '@repo/libraries/zustand/stores/category';
import { useStoreBudget } from '@repo/libraries/zustand/stores/budget';
import { useStoreAccount } from '@repo/libraries/zustand/stores/account';
import { useStoreAccountGroup } from '@repo/libraries/zustand/stores/account-group';
import { useStoreTransaction } from '@repo/libraries/zustand/stores/transaction';
import { SyncParams } from '@repo/types/sync';
import {
  SessionValue,
  useStoreSession,
} from '@repo/libraries/zustand/stores/session';
import { useStoreNote } from '@repo/libraries/zustand/stores/note';
import { notesUpdate } from '@repo/handlers/requests/database/notes';
import { useStoreNotebook } from '@repo/libraries/zustand/stores/notebook';
import { notebooksUpdate } from '@repo/handlers/requests/database/notebooks';
import { useStoreLink } from '@repo/libraries/zustand/stores/link';
import { linksUpdate } from '@repo/handlers/requests/database/links';
import { useStorePost } from '@repo/libraries/zustand/stores/post';
import { postsUpdate } from '@repo/handlers/requests/database/posts';
import { useStoreFood } from '@repo/libraries/zustand/stores/food';
import { foodsUpdate } from '@repo/handlers/requests/database/foods';
import { useStoreMeal } from '@repo/libraries/zustand/stores/meal';
import { mealsUpdate } from '@repo/handlers/requests/database/meals';
import { useStoreServing } from '@repo/libraries/zustand/stores/serving';
import { servingsUpdate } from '@repo/handlers/requests/database/servings';
import { useStoreEat } from '@repo/libraries/zustand/stores/eat';
import { eatsUpdate } from '@repo/handlers/requests/database/eats';
import { useStoreMass } from '@repo/libraries/zustand/stores/mass';
import { massesUpdate } from '@repo/handlers/requests/database/masses';

const useSessionCheck = () => {
  const session = useStoreSession((s) => s.session);
  const noSession =
    session === undefined ||
    (!session && (!(session as SessionValue)?.email as any));

  return { noSession };
};

type SyncStoreConfig<TItems = any, THookReturn = any> = {
  dataStore: (typeof STORE_NAME)[keyof typeof STORE_NAME];
  useStoreHook: () => THookReturn;
  serverUpdate: (items: TItems[], deleted: TItems[]) => Promise<any>;
  getItems: (store: THookReturn) => TItems[];
  getDeleted: (store: THookReturn) => TItems[];
  setItems: (store: THookReturn, items: TItems[]) => void;
  clearDeleted: (store: THookReturn) => void;
};

export const SYNC_STORES: Record<string, SyncStoreConfig> = {
  posts: {
    dataStore: STORE_NAME.POSTS,
    useStoreHook: useStorePost,
    serverUpdate: postsUpdate,
    getItems: (store) => store.posts,
    getDeleted: (store) => store.deleted,
    setItems: (store, items) => store.setPosts(items),
    clearDeleted: (store) => store.clearDeletedPosts(),
  },
  categories: {
    dataStore: STORE_NAME.CATEGORIES,
    useStoreHook: useStoreCategory,
    serverUpdate: categoriesUpdate,
    getItems: (store) => store.categories,
    getDeleted: (store) => store.deleted,
    setItems: (store, items) => store.setCategories(items),
    clearDeleted: (store) => store.clearDeletedCategories(),
  },
  budgets: {
    dataStore: STORE_NAME.BUDGETS,
    useStoreHook: useStoreBudget,
    serverUpdate: budgetsUpdate,
    getItems: (store) => store.budgets,
    getDeleted: (store) => store.deleted,
    setItems: (store, items) => store.setBudgets(items),
    clearDeleted: (store) => store.clearDeletedBudgets(),
  },
  accounts: {
    dataStore: STORE_NAME.ACCOUNTS,
    useStoreHook: useStoreAccount,
    serverUpdate: accountsUpdate,
    getItems: (store) => store.accounts,
    getDeleted: (store) => store.deleted,
    setItems: (store, items) => store.setAccounts(items),
    clearDeleted: (store) => store.clearDeletedAccounts(),
  },
  accountGroups: {
    dataStore: STORE_NAME.ACCOUNT_GROUPS,
    useStoreHook: useStoreAccountGroup,
    serverUpdate: accountGroupsUpdate,
    getItems: (store) => store.accountGroups,
    getDeleted: (store) => store.deleted,
    setItems: (store, items) => store.setAccountGroups(items),
    clearDeleted: (store) => store.clearDeletedAccountGroups(),
  },
  transactions: {
    dataStore: STORE_NAME.TRANSACTIONS,
    useStoreHook: useStoreTransaction,
    serverUpdate: transactionsUpdate,
    getItems: (store) => store.transactions,
    getDeleted: (store) => store.deleted,
    setItems: (store, items) => store.setTransactions(items),
    clearDeleted: (store) => store.clearDeletedTransactions(),
  },
  notebooks: {
    dataStore: STORE_NAME.NOTEBOOKS,
    useStoreHook: useStoreNotebook,
    serverUpdate: notebooksUpdate,
    getItems: (store) => store.notebooks,
    getDeleted: (store) => store.deleted,
    setItems: (store, items) => store.setNotebooks(items),
    clearDeleted: (store) => store.clearDeletedNotebooks(),
  },
  notes: {
    dataStore: STORE_NAME.NOTES,
    useStoreHook: useStoreNote,
    serverUpdate: notesUpdate,
    getItems: (store) => store.notes,
    getDeleted: (store) => store.deleted,
    setItems: (store, items) => store.setNotes(items),
    clearDeleted: (store) => store.clearDeletedNotes(),
  },
  links: {
    dataStore: STORE_NAME.LINKS,
    useStoreHook: useStoreLink,
    serverUpdate: linksUpdate,
    getItems: (store) => store.links,
    getDeleted: (store) => store.deleted,
    setItems: (store, items) => store.setLinks(items),
    clearDeleted: (store) => store.clearDeletedLinks(),
  },
  foods: {
    dataStore: STORE_NAME.FOODS,
    useStoreHook: useStoreFood,
    serverUpdate: foodsUpdate,
    getItems: (store) => store.foods,
    getDeleted: (store) => store.deleted,
    setItems: (store, items) => store.setFoods(items),
    clearDeleted: (store) => store.clearDeletedFoods(),
  },
  meals: {
    dataStore: STORE_NAME.MEALS,
    useStoreHook: useStoreMeal,
    serverUpdate: mealsUpdate,
    getItems: (store) => store.meals,
    getDeleted: (store) => store.deleted,
    setItems: (store, items) => store.setMeals(items),
    clearDeleted: (store) => store.clearDeletedMeals(),
  },
  servings: {
    dataStore: STORE_NAME.SERVINGS,
    useStoreHook: useStoreServing,
    serverUpdate: servingsUpdate,
    getItems: (store) => store.servings,
    getDeleted: (store) => store.deleted,
    setItems: (store, items) => store.setServings(items),
    clearDeleted: (store) => store.clearDeletedServings(),
  },
  eats: {
    dataStore: STORE_NAME.EATS,
    useStoreHook: useStoreEat,
    serverUpdate: eatsUpdate,
    getItems: (store) => store.eats,
    getDeleted: (store) => store.deleted,
    setItems: (store, items) => store.setEats(items),
    clearDeleted: (store) => store.clearDeletedEats(),
  },
  masses: {
    dataStore: STORE_NAME.MASSES,
    useStoreHook: useStoreMass,
    serverUpdate: massesUpdate,
    getItems: (store) => store.masses,
    getDeleted: (store) => store.deleted,
    setItems: (store, items) => store.setMasses(items),
    clearDeleted: (store) => store.clearDeletedMasses(),
  },
} as const;

type SyncStoreKey = keyof typeof SYNC_STORES;

const useGenericSync = <K extends keyof typeof SYNC_STORES>(params: {
  storeKey: K;
  syncFunction: (input: SyncParams) => void;
  online: boolean;
}) => {
  const { storeKey, syncFunction, online } = params;
  const { noSession } = useSessionCheck();

  const config = SYNC_STORES[storeKey] as SyncStoreConfig;
  const store = config.useStoreHook();

  const sync = useCallback(() => {
    syncFunction({
      items: config.getItems(store) ?? [], // ← fallback to []
      deletedItems: config.getDeleted(store) ?? [], // ← fallback to []
      dataStore: config.dataStore,
      stateUpdateFunctionDeleted: () => config.clearDeleted(store),
      stateUpdateFunction: (i) => config.setItems(store, i),
      serverUpdateFunction: async (i, di) =>
        await config.serverUpdate(i ?? [], di ?? []), // ← fallback here too
    });
  }, [store, syncFunction, config]);

  useEffect(() => {
    if (noSession) return;
    sync();
  }, [store, online, noSession, sync]);
};

export const useSyncStores = (params: {
  syncFunction: (input: SyncParams) => void;
  online: boolean;
  storesToSync: Partial<Record<SyncStoreKey, boolean>>;
}) => {
  const { syncFunction, online, storesToSync } = params;

  const results = {} as Record<string, any>;

  (Object.keys(storesToSync) as SyncStoreKey[]).forEach((key) => {
    if (!storesToSync[key]) return;

    results[key] = useGenericSync({
      storeKey: key,
      syncFunction,
      online,
    });
  });

  return results;
};
