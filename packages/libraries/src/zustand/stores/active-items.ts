import { create } from 'zustand';
import { TaskGet } from '@repo/types/models/task';
import { NoteGet } from '@repo/types/models/note';

export type ActiveTaskValue = TaskGet | null;
type NoteActions = { move?: boolean; merge?: boolean };
export type ActiveNoteValue = ({ item: NoteGet } & NoteActions) | null;
export type ActiveItemsValue =
  | {
      task: ActiveTaskValue;
      note: ActiveNoteValue;
      confirm: any;
    }
  | null
  | undefined;

interface ActiveItemsState {
  activeItems: ActiveItemsValue;
  addActiveConfirm: (data: any) => void;
  removeActiveConfirm: () => void;
  addActiveNote: (data: NoteGet, actions?: NoteActions) => void;
  removeActiveNote: () => void;
  addActiveTask: (data: TaskGet) => void;
  removeActiveTask: () => void;
  setActiveItems: (data: ActiveItemsValue) => void;
  clearActiveItems: () => void;
}

export const useStoreActiveItems = create<ActiveItemsState>((set) => ({
  activeItems: undefined,

  addActiveConfirm: (data) => {
    set((state) => ({
      activeItems: {
        task: state.activeItems?.task ?? null,
        note: state.activeItems?.note ?? null,
        confirm: data,
      },
    }));
  },

  removeActiveConfirm: () => {
    set((state) => ({
      activeItems: {
        task: state.activeItems?.task ?? null,
        note: state.activeItems?.note ?? null,
        confirm: null,
      },
    }));
  },

  addActiveNote: (data, actions?: NoteActions) => {
    set((state) => ({
      activeItems: {
        task: state.activeItems?.task ?? null,
        confirm: state.activeItems?.task ?? null,
        note: { item: data, ...actions },
      },
    }));
  },

  removeActiveNote: () => {
    set((state) => ({
      activeItems: {
        task: state.activeItems?.task ?? null,
        confirm: state.activeItems?.confirm ?? null,
        note: null,
      },
    }));
  },

  addActiveTask: (data) => {
    set((state) => ({
      activeItems: {
        task: data,
        confirm: state.activeItems?.confirm ?? null,
        note: state.activeItems?.note ?? null,
      },
    }));
  },

  removeActiveTask: () => {
    set((state) => ({
      activeItems: {
        task: null,
        confirm: state.activeItems?.confirm ?? null,
        note: state.activeItems?.note ?? null,
      },
    }));
  },

  setActiveItems: (data) => {
    set({ activeItems: data });
  },

  clearActiveItems: () => {
    set({ activeItems: undefined });
  },
}));
