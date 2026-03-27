import { create } from 'zustand';
import type { AccountGroupGet } from '@repo/types/models/account-group';

export type AccountGroupsValue = AccountGroupGet[] | null | undefined;

interface AccountGroupState {
  accountGroups: AccountGroupsValue;
  deleted: AccountGroupGet[];
  setAccountGroups: (data: AccountGroupsValue) => void;
  setDeletedAccountGroups: (data: AccountGroupsValue) => void;
  clearAccountGroups: () => void;
  clearDeletedAccountGroups: () => void;
  addAccountGroup: (data: AccountGroupGet) => void;
  updateAccountGroup: (data: AccountGroupGet) => void;
  deleteAccountGroup: (data: AccountGroupGet) => void;
}

export const useStoreAccountGroup = create<AccountGroupState>((set) => ({
  accountGroups: undefined,
  deleted: [],

  setAccountGroups: (data) => {
    set({ accountGroups: data });
  },

  setDeletedAccountGroups: (data) => {
    set({ deleted: data || [] });
  },

  clearAccountGroups: () => {
    set({ accountGroups: [] });
  },

  clearDeletedAccountGroups: () => {
    set({ deleted: [] });
  },

  addAccountGroup: (data) => {
    set((state) => ({
      accountGroups: [...(state.accountGroups ?? []), data],
    }));
  },

  updateAccountGroup: (data) => {
    set((state) => ({
      accountGroups:
        state.accountGroups?.map((i) => (i.id === data.id ? { ...data } : i)) ??
        undefined,
    }));
  },

  deleteAccountGroup: (data) => {
    set((state) => ({
      deleted: [...state.deleted, data],
      accountGroups:
        state.accountGroups?.filter((i) => i.id !== data.id) ?? undefined,
    }));
  },
}));
