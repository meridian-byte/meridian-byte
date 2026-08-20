import { create } from 'zustand';
import type { RecurringRuleGet } from '@repo/types';
import { hasChanges } from '@repo/utils';

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
  mergeRecurringRules: (data: RecurringRuleGet[]) => void;
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
        state.recurringRules?.map((i) => (i.id === data.id ? { ...data } : i)) ?? undefined,
    }));
  },

  mergeRecurringRules: (incomingRecurringRules) => {
    set((state) => {
      if (!incomingRecurringRules || incomingRecurringRules.length === 0) return state;

      // If initial state is empty, set it directly
      if (!state.recurringRules) {
        return { recurringRules: incomingRecurringRules };
      }

      let hasChanged = false;
      const incomingMap = new Map(incomingRecurringRules.map((n) => [String(n.id), n]));

      // 1. Update existing recurringRules in place if fields differ
      const nextRecurringRules = state.recurringRules.map((existing) => {
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

      // 2. Append new recurringRules that aren't in the store yet
      const existingIds = new Set(state.recurringRules.map((n) => String(n.id)));
      for (const incoming of incomingRecurringRules) {
        if (!existingIds.has(String(incoming.id))) {
          nextRecurringRules.push(incoming);
          hasChanged = true;
        }
      }

      // CRITICAL: Return original `state` if nothing changed.
      // Zustand skips re-rendering all subscribers when the returned state reference is identical.
      if (!hasChanged) return state;

      return { recurringRules: nextRecurringRules };
    });
  },

  deleteRecurringRule: (data) => {
    set((state) => ({
      deleted: [...state.deleted, data],
      recurringRules: state.recurringRules?.filter((i) => i.id !== data.id) ?? undefined,
    }));
  },
}));
