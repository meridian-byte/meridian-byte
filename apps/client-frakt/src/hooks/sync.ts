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
import { useStoreCategory } from '@/libraries/zustand/stores/category';
import { useStoreBudget } from '@/libraries/zustand/stores/budget';
import { useStoreAccount } from '@/libraries/zustand/stores/account';
import { useStoreAccountGroup } from '@/libraries/zustand/stores/account-group';
import { useStoreTransaction } from '@/libraries/zustand/stores/transaction';
import { SyncParams } from '@repo/types/sync';

export const useSyncCategories = (params: {
  syncFunction: (input: SyncParams) => void;
  online: boolean;
}) => {
  const { syncFunction, online } = params;

  const {
    categories,
    deleted: deletedCategories,
    setCategories,
    clearDeletedCategories,
  } = useStoreCategory();

  const syncCategories = useCallback(() => {
    syncFunction({
      items: categories || [],
      deletedItems: deletedCategories,
      dataStore: STORE_NAME.CATEGORIES,
      stateUpdateFunctionDeleted: () => clearDeletedCategories(),
      stateUpdateFunction: (i) => setCategories(i),
      serverUpdateFunction: async (i, di) => await categoriesUpdate(i, di),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories, deletedCategories, setCategories, clearDeletedCategories]);

  useEffect(() => syncCategories(), [categories, syncCategories, online]);

  return { syncCategories };
};

export const useSyncBudgets = (params: {
  syncFunction: (input: SyncParams) => void;
  online: boolean;
}) => {
  const { syncFunction, online } = params;

  const {
    budgets,
    deleted: deletedBudgets,
    setBudgets,
    clearDeletedBudgets,
  } = useStoreBudget();

  const syncBudgets = useCallback(() => {
    syncFunction({
      items: budgets || [],
      deletedItems: deletedBudgets,
      dataStore: STORE_NAME.BUDGETS,
      stateUpdateFunctionDeleted: () => clearDeletedBudgets(),
      stateUpdateFunction: (i) => setBudgets(i),
      serverUpdateFunction: async (i, di) => await budgetsUpdate(i, di),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [budgets, deletedBudgets, setBudgets, clearDeletedBudgets]);

  useEffect(() => syncBudgets(), [budgets, syncBudgets, online]);

  return { syncBudgets };
};

export const useSyncAccounts = (params: {
  syncFunction: (input: SyncParams) => void;
  online: boolean;
}) => {
  const { syncFunction, online } = params;

  const {
    accounts,
    deleted: deletedAccounts,
    setAccounts,
    clearDeletedAccounts,
  } = useStoreAccount();

  const syncAccounts = useCallback(() => {
    syncFunction({
      items: accounts || [],
      deletedItems: deletedAccounts,
      dataStore: STORE_NAME.ACCOUNTS,
      stateUpdateFunctionDeleted: () => clearDeletedAccounts(),
      stateUpdateFunction: (i) => setAccounts(i),
      serverUpdateFunction: async (i, di) => await accountsUpdate(i, di),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accounts, deletedAccounts, setAccounts, clearDeletedAccounts]);

  useEffect(() => syncAccounts(), [accounts, syncAccounts, online]);

  return { syncAccounts };
};

export const useSyncAccountGroups = (params: {
  syncFunction: (input: SyncParams) => void;
  online: boolean;
}) => {
  const { syncFunction, online } = params;

  const {
    accountGroups,
    deleted: deletedAccountGroups,
    setAccountGroups,
    clearDeletedAccountGroups,
  } = useStoreAccountGroup();

  const syncAccountGroups = useCallback(() => {
    syncFunction({
      items: accountGroups || [],
      deletedItems: deletedAccountGroups,
      dataStore: STORE_NAME.ACCOUNT_GROUPS,
      stateUpdateFunctionDeleted: () => clearDeletedAccountGroups(),
      stateUpdateFunction: (i) => setAccountGroups(i),
      serverUpdateFunction: async (i, di) => await accountGroupsUpdate(i, di),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    accountGroups,
    deletedAccountGroups,
    setAccountGroups,
    clearDeletedAccountGroups,
  ]);

  useEffect(
    () => syncAccountGroups(),
    [accountGroups, syncAccountGroups, online]
  );

  return { syncAccountGroups };
};

export const useSyncTransactions = (params: {
  syncFunction: (input: SyncParams) => void;
  online: boolean;
}) => {
  const { syncFunction, online } = params;

  const {
    transactions,
    deleted: deletedTransactions,
    setTransactions,
    clearDeletedTransactions,
  } = useStoreTransaction();

  const syncTransactions = useCallback(() => {
    syncFunction({
      items: transactions || [],
      deletedItems: deletedTransactions,
      dataStore: STORE_NAME.TRANSACTIONS,
      stateUpdateFunctionDeleted: () => clearDeletedTransactions(),
      stateUpdateFunction: (i) => setTransactions(i),
      serverUpdateFunction: async (i, di) => await transactionsUpdate(i, di),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    transactions,
    deletedTransactions,
    setTransactions,
    clearDeletedTransactions,
  ]);

  useEffect(() => syncTransactions(), [transactions, syncTransactions, online]);

  return { syncTransactions };
};
