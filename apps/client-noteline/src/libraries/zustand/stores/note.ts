import { create } from 'zustand';
import type { NoteGet } from '@repo/types/models/note';

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
      notes:
        state.notes?.map((i) => (i.id === data.id ? { ...data } : i)) ??
        undefined,
    }));
  },

  deleteNote: (data) => {
    set((state) => ({
      deleted: [...state.deleted, data],
      notes: state.notes?.filter((i) => i.id !== data.id) ?? undefined,
    }));
  },
}));
