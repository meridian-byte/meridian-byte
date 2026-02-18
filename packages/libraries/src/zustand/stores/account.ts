import { create } from 'zustand';
import type { AccountGet } from '@repo/types/models/account';

export type AccountsValue = AccountGet[] | null | undefined;

interface AccountState {
  accounts: AccountsValue;
  deleted: AccountGet[];
  setAccounts: (data: AccountsValue) => void;
  setDeletedAccounts: (data: AccountsValue) => void;
  clearAccounts: () => void;
  clearDeletedAccounts: () => void;
  addAccount: (data: AccountGet) => void;
  updateAccount: (data: AccountGet) => void;
  deleteAccount: (data: AccountGet) => void;
}

export const useStoreAccount = create<AccountState>((set) => ({
  accounts: undefined,
  deleted: [],

  setAccounts: (data) => {
    set({ accounts: data });
  },

  setDeletedAccounts: (data) => {
    set({ deleted: data || [] });
  },

  clearAccounts: () => {
    set({ accounts: [] });
  },

  clearDeletedAccounts: () => {
    set({ deleted: [] });
  },

  addAccount: (data) => {
    set((state) => ({
      accounts: [...(state.accounts ?? []), data],
    }));
  },

  updateAccount: (data) => {
    set((state) => ({
      accounts:
        state.accounts?.map((i) => (i.id === data.id ? { ...data } : i)) ??
        undefined,
    }));
  },

  deleteAccount: (data) => {
    set((state) => ({
      deleted: [...state.deleted, data],
      accounts: state.accounts?.filter((i) => i.id !== data.id) ?? undefined,
    }));
  },
}));
