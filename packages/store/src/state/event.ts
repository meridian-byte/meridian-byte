import { create } from 'zustand';
import type { EventGet } from '@repo/types';
import { hasChanges } from '@repo/utils';

export type EventsValue = EventGet[] | null | undefined;

interface EventState {
  events: EventsValue;
  deleted: EventGet[];
  setEvents: (data: EventsValue) => void;
  setDeletedEvents: (data: EventsValue) => void;
  clearEvents: () => void;
  clearDeletedEvents: () => void;
  addEvent: (data: EventGet) => void;
  updateEvent: (data: EventGet) => void;
  mergeEvents: (data: EventGet[]) => void;
  deleteEvent: (data: EventGet) => void;
}

export const useStoreEvent = create<EventState>((set) => ({
  events: undefined,
  deleted: [],

  setEvents: (data) => {
    set({ events: data });
  },

  setDeletedEvents: (data) => {
    set({ deleted: data || [] });
  },

  clearEvents: () => {
    set({ events: [] });
  },

  clearDeletedEvents: () => {
    set({ deleted: [] });
  },

  addEvent: (data) => {
    set((state) => ({
      events: [...(state.events ?? []), data],
    }));
  },

  updateEvent: (data) => {
    set((state) => ({
      events: state.events?.map((i) => (i.id === data.id ? { ...data } : i)) ?? undefined,
    }));
  },

  mergeEvents: (incomingEvents) => {
    set((state) => {
      if (!incomingEvents || incomingEvents.length === 0) return state;

      // If initial state is empty, set it directly
      if (!state.events) {
        return { events: incomingEvents };
      }

      let hasChanged = false;
      const incomingMap = new Map(incomingEvents.map((n) => [String(n.id), n]));

      // 1. Update existing events in place if fields differ
      const nextEvents = state.events.map((existing) => {
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

      // 2. Append new events that aren't in the store yet
      const existingIds = new Set(state.events.map((n) => String(n.id)));
      for (const incoming of incomingEvents) {
        if (!existingIds.has(String(incoming.id))) {
          nextEvents.push(incoming);
          hasChanged = true;
        }
      }

      // CRITICAL: Return original `state` if nothing changed.
      // Zustand skips re-rendering all subscribers when the returned state reference is identical.
      if (!hasChanged) return state;

      return { events: nextEvents };
    });
  },

  deleteEvent: (data) => {
    set((state) => ({
      deleted: [...state.deleted, data],
      events: state.events?.filter((i) => i.id !== data.id) ?? undefined,
    }));
  },
}));
