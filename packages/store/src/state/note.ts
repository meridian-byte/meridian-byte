import { create } from 'zustand';
import type { NoteGet } from '@repo/types';
import { hasChanges } from '@repo/utils';

export type NotesValue = NoteGet[] | null | undefined;

interface NoteState {
  notes: NotesValue;
  deleted: NoteGet[];
  setNotes: (data: NotesValue) => void;
  setDeletedNotes: (data: NotesValue) => void;
  clearNotes: () => void;
  clearDeletedNotes: () => void;
  addNote: (data: NoteGet) => void;
  updateNote: (data: NoteGet) => void;
  mergeNotes: (data: NoteGet[]) => void;
  deleteNote: (data: NoteGet) => void;
}

export const useStoreNote = create<NoteState>((set) => ({
  notes: undefined,
  deleted: [],

  setNotes: (data) => {
    set({ notes: data });
  },

  setDeletedNotes: (data) => {
    set({ deleted: data || [] });
  },

  clearNotes: () => {
    set({ notes: [] });
  },

  clearDeletedNotes: () => {
    set({ deleted: [] });
  },

  addNote: (data) => {
    set((state) => ({
      notes: [...(state.notes ?? []), data],
    }));
  },

  updateNote: (data) => {
    set((state) => ({
      notes: state.notes?.map((i) => (i.id === data.id ? { ...data } : i)) ?? undefined,
    }));
  },

  mergeNotes: (incomingNotes) => {
    set((state) => {
      if (!incomingNotes || incomingNotes.length === 0) return state;

      // If initial state is empty, set it directly
      if (!state.notes) {
        return { notes: incomingNotes };
      }

      let hasChanged = false;
      const incomingMap = new Map(incomingNotes.map((n) => [String(n.id), n]));

      // 1. Update existing notes in place if fields differ
      const nextNotes = state.notes.map((existing) => {
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

      // 2. Append new notes that aren't in the store yet
      const existingIds = new Set(state.notes.map((n) => String(n.id)));
      for (const incoming of incomingNotes) {
        if (!existingIds.has(String(incoming.id))) {
          nextNotes.push(incoming);
          hasChanged = true;
        }
      }

      // CRITICAL: Return original `state` if nothing changed.
      // Zustand skips re-rendering all subscribers when the returned state reference is identical.
      if (!hasChanged) return state;

      return { notes: nextNotes };
    });
  },

  deleteNote: (data) => {
    set((state) => ({
      deleted: [...state.deleted, data],
      notes: state.notes?.filter((i) => i.id !== data.id) ?? undefined,
    }));
  },
}));
