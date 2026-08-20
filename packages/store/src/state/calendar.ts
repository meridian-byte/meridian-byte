import { create } from 'zustand';
import type { CalendarGet } from '@repo/types';
import { hasChanges } from '@repo/utils';

export type CalendarsValue = CalendarGet[] | null | undefined;

interface CalendarState {
  calendars: CalendarsValue;
  deleted: CalendarGet[];
  setCalendars: (data: CalendarsValue) => void;
  setDeletedCalendars: (data: CalendarsValue) => void;
  clearCalendars: () => void;
  clearDeletedCalendars: () => void;
  addCalendar: (data: CalendarGet) => void;
  updateCalendar: (data: CalendarGet) => void;
  mergeCalendars: (data: CalendarGet[]) => void;
  deleteCalendar: (data: CalendarGet) => void;
}

export const useStoreCalendar = create<CalendarState>((set) => ({
  calendars: undefined,
  deleted: [],

  setCalendars: (data) => {
    set({ calendars: data });
  },

  setDeletedCalendars: (data) => {
    set({ deleted: data || [] });
  },

  clearCalendars: () => {
    set({ calendars: [] });
  },

  clearDeletedCalendars: () => {
    set({ deleted: [] });
  },

  addCalendar: (data) => {
    set((state) => ({
      calendars: [...(state.calendars ?? []), data],
    }));
  },

  updateCalendar: (data) => {
    set((state) => ({
      calendars: state.calendars?.map((i) => (i.id === data.id ? { ...data } : i)) ?? undefined,
    }));
  },

  mergeCalendars: (incomingCalendars) => {
    set((state) => {
      if (!incomingCalendars || incomingCalendars.length === 0) return state;

      // If initial state is empty, set it directly
      if (!state.calendars) {
        return { calendars: incomingCalendars };
      }

      let hasChanged = false;
      const incomingMap = new Map(incomingCalendars.map((n) => [String(n.id), n]));

      // 1. Update existing calendars in place if fields differ
      const nextCalendars = state.calendars.map((existing) => {
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

      // 2. Append new calendars that aren't in the store yet
      const existingIds = new Set(state.calendars.map((n) => String(n.id)));
      for (const incoming of incomingCalendars) {
        if (!existingIds.has(String(incoming.id))) {
          nextCalendars.push(incoming);
          hasChanged = true;
        }
      }

      // CRITICAL: Return original `state` if nothing changed.
      // Zustand skips re-rendering all subscribers when the returned state reference is identical.
      if (!hasChanged) return state;

      return { calendars: nextCalendars };
    });
  },

  deleteCalendar: (data) => {
    set((state) => ({
      deleted: [...state.deleted, data],
      calendars: state.calendars?.filter((i) => i.id !== data.id) ?? undefined,
    }));
  },
}));
