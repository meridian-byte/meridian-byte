import { create } from 'zustand';
import type { AccountGet } from '@repo/types';
import { hasChanges } from '@repo/utils';

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
  mergeAccounts: (data: AccountGet[]) => void;
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
      accounts: state.accounts?.map((i) => (i.id === data.id ? { ...data } : i)) ?? undefined,
    }));
  },

  mergeAccounts: (incomingAccounts) => {
    set((state) => {
      if (!incomingAccounts || incomingAccounts.length === 0) return state;

      // If initial state is empty, set it directly
      if (!state.accounts) {
        return { accounts: incomingAccounts };
      }

      let hasChanged = false;
      const incomingMap = new Map(incomingAccounts.map((n) => [String(n.id), n]));

      // 1. Update existing accounts in place if fields differ
      const nextAccounts = state.accounts.map((existing) => {
        const incoming = incomingMap.get(String(existing.id));
        if (!incoming) return existing;

        // Check if any property changed
        const isDifferent = hasChanges(existing, incoming);

        if (isDifferent) {
          hasChanged = true;
          return { ...existing, ...incoming };
        }

        // Return exact same reference if nothing changed
        return existing;
      });

      // 2. Append new accounts that aren't in the store yet
      const existingIds = new Set(state.accounts.map((n) => String(n.id)));
      for (const incoming of incomingAccounts) {
        if (!existingIds.has(String(incoming.id))) {
          nextAccounts.push(incoming);
          hasChanged = true;
        }
      }

      // CRITICAL: Return original `state` if nothing changed.
      // Zustand skips re-rendering all subscribers when the returned state reference is identical.
      if (!hasChanged) return state;

      return { accounts: nextAccounts };
    });
  },

  deleteAccount: (data) => {
    set((state) => ({
      deleted: [...state.deleted, data],
      accounts: state.accounts?.filter((i) => i.id !== data.id) ?? undefined,
    }));
  },
}));
