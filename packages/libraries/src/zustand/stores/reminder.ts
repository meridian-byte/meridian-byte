import { create } from 'zustand';
import type { ReminderGet } from '@repo/types/models/reminder';

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
      reminders:
        state.reminders?.map((i) => (i.id === data.id ? { ...data } : i)) ??
        undefined,
    }));
  },

  deleteReminder: (data) => {
    set((state) => ({
      deleted: [...state.deleted, data],
      reminders: state.reminders?.filter((i) => i.id !== data.id) ?? undefined,
    }));
  },
}));
