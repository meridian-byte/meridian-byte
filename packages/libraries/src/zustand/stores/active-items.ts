import { create } from 'zustand';
import { TaskGet } from '@repo/types/models/task';
import { NoteGet } from '@repo/types/models/note';

export type ActiveTaskValue = TaskGet | null;
export type ActiveNoteValue = NoteGet | null;
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
  addActiveNote: (data: NoteGet) => void;
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

  addActiveNote: (data) => {
    set((state) => ({
      activeItems: {
        task: state.activeItems?.task ?? null,
        confirm: state.activeItems?.task ?? null,
        note: data,
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
