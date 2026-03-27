import { create } from 'zustand';
import type { TransactionGet } from '@repo/types/models/transaction';

export type TransactionsValue = TransactionGet[] | null | undefined;

interface TransactionState {
  transactions: TransactionsValue;
  deleted: TransactionGet[];
  setTransactions: (data: TransactionsValue) => void;
  setDeletedTransactions: (data: TransactionsValue) => void;
  clearTransactions: () => void;
  clearDeletedTransactions: () => void;
  addTransaction: (data: TransactionGet) => void;
  updateTransaction: (data: TransactionGet) => void;
  deleteTransaction: (data: TransactionGet) => void;
}

export const useStoreTransaction = create<TransactionState>((set) => ({
  transactions: undefined,
  deleted: [],

  setTransactions: (data) => {
    set({ transactions: data });
  },

  setDeletedTransactions: (data) => {
    set({ deleted: data || [] });
  },

  clearTransactions: () => {
    set({ transactions: [] });
  },

  clearDeletedTransactions: () => {
    set({ deleted: [] });
  },

  addTransaction: (data) => {
    set((state) => ({
      transactions: [...(state.transactions ?? []), data],
    }));
  },

  updateTransaction: (data) => {
    set((state) => ({
      transactions:
        state.transactions?.map((i) => (i.id === data.id ? { ...data } : i)) ??
        undefined,
    }));
  },

  deleteTransaction: (data) => {
    set((state) => ({
      deleted: [...state.deleted, data],
      transactions:
        state.transactions?.filter((i) => i.id !== data.id) ?? undefined,
    }));
  },
}));
