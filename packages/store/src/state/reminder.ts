import { create } from 'zustand';
import type { ReminderGet } from '@repo/types';
import { hasChanges } from '@repo/utils';

export type RemindersValue = ReminderGet[] | null | undefined;

interface ReminderState {
  reminders: RemindersValue;
  deleted: ReminderGet[];
  setReminders: (data: RemindersValue) => void;
  setDeletedReminders: (data: RemindersValue) => void;
  clearReminders: () => void;
  clearDeletedReminders: () => void;
  addReminder: (data: ReminderGet) => void;
  updateReminder: (data: ReminderGet) => void;
  mergeReminders: (data: ReminderGet[]) => void;
  deleteReminder: (data: ReminderGet) => void;
}

export const useStoreReminder = create<ReminderState>((set) => ({
  reminders: undefined,
  deleted: [],

  setReminders: (data) => {
    set({ reminders: data });
  },

  setDeletedReminders: (data) => {
    set({ deleted: data || [] });
  },

  clearReminders: () => {
    set({ reminders: [] });
  },

  clearDeletedReminders: () => {
    set({ deleted: [] });
  },

  addReminder: (data) => {
    set((state) => ({
      reminders: [...(state.reminders ?? []), data],
    }));
  },

  updateReminder: (data) => {
    set((state) => ({
      reminders: state.reminders?.map((i) => (i.id === data.id ? { ...data } : i)) ?? undefined,
    }));
  },

  mergeReminders: (incomingReminders) => {
    set((state) => {
      if (!incomingReminders || incomingReminders.length === 0) return state;

      // If initial state is empty, set it directly
      if (!state.reminders) {
        return { reminders: incomingReminders };
      }

      let hasChanged = false;
      const incomingMap = new Map(incomingReminders.map((n) => [String(n.id), n]));

      // 1. Update existing reminders in place if fields differ
      const nextReminders = state.reminders.map((existing) => {
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

      // 2. Append new reminders that aren't in the store yet
      const existingIds = new Set(state.reminders.map((n) => String(n.id)));
      for (const incoming of incomingReminders) {
        if (!existingIds.has(String(incoming.id))) {
          nextReminders.push(incoming);
          hasChanged = true;
        }
      }

      // CRITICAL: Return original `state` if nothing changed.
      // Zustand skips re-rendering all subscribers when the returned state reference is identical.
      if (!hasChanged) return state;

      return { reminders: nextReminders };
    });
  },

  deleteReminder: (data) => {
    set((state) => ({
      deleted: [...state.deleted, data],
      reminders: state.reminders?.filter((i) => i.id !== data.id) ?? undefined,
    }));
  },
}));
