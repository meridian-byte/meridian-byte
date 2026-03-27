import { create } from 'zustand';
import type { BudgetGet } from '@repo/types/models/budget';

export type BudgetsValue = BudgetGet[] | null | undefined;

interface BudgetState {
  budgets: BudgetsValue;
  deleted: BudgetGet[];
  setBudgets: (data: BudgetsValue) => void;
  setDeletedBudgets: (data: BudgetsValue) => void;
  clearBudgets: () => void;
  clearDeletedBudgets: () => void;
  addBudget: (data: BudgetGet) => void;
  updateBudget: (data: BudgetGet) => void;
  deleteBudget: (data: BudgetGet) => void;
}

export const useStoreBudget = create<BudgetState>((set) => ({
  budgets: undefined,
  deleted: [],

  setBudgets: (data) => {
    set({ budgets: data });
  },

  setDeletedBudgets: (data) => {
    set({ deleted: data || [] });
  },

  clearBudgets: () => {
    set({ budgets: [] });
  },

  clearDeletedBudgets: () => {
    set({ deleted: [] });
  },

  addBudget: (data) => {
    set((state) => ({
      budgets: [...(state.budgets ?? []), data],
    }));
  },

  updateBudget: (data) => {
    set((state) => ({
      budgets:
        state.budgets?.map((i) => (i.id === data.id ? { ...data } : i)) ??
        undefined,
    }));
  },

  deleteBudget: (data) => {
    set((state) => ({
      deleted: [...state.deleted, data],
      budgets: state.budgets?.filter((i) => i.id !== data.id) ?? undefined,
    }));
  },
}));
