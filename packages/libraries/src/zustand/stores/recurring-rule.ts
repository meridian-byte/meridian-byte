import { create } from 'zustand';
import type { RecurringRuleGet } from '@repo/types/models/recurring-rule';

export type RecurringRulesValue = RecurringRuleGet[] | null | undefined;

interface RecurringRuleState {
  recurringRules: RecurringRulesValue;
  deleted: RecurringRuleGet[];
  setRecurringRules: (data: RecurringRulesValue) => void;
  setDeletedRecurringRules: (data: RecurringRulesValue) => void;
  clearRecurringRules: () => void;
  clearDeletedRecurringRules: () => void;
  addRecurringRule: (data: RecurringRuleGet) => void;
  updateRecurringRule: (data: RecurringRuleGet) => void;
  deleteRecurringRule: (data: RecurringRuleGet) => void;
}

export const useStoreRecurringRule = create<RecurringRuleState>((set) => ({
  recurringRules: undefined,
  deleted: [],

  setRecurringRules: (data) => {
    set({ recurringRules: data });
  },

  setDeletedRecurringRules: (data) => {
    set({ deleted: data || [] });
  },

  clearRecurringRules: () => {
    set({ recurringRules: [] });
  },

  clearDeletedRecurringRules: () => {
    set({ deleted: [] });
  },

  addRecurringRule: (data) => {
    set((state) => ({
      recurringRules: [...(state.recurringRules ?? []), data],
    }));
  },

  updateRecurringRule: (data) => {
    set((state) => ({
      recurringRules:
        state.recurringRules?.map((i) =>
          i.id === data.id ? { ...data } : i
        ) ?? undefined,
    }));
  },

  deleteRecurringRule: (data) => {
    set((state) => ({
      deleted: [...state.deleted, data],
      recurringRules:
        state.recurringRules?.filter((i) => i.id !== data.id) ?? undefined,
    }));
  },
}));
