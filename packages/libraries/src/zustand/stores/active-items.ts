import { create } from 'zustand';
import { TaskGet } from '@repo/types/models/task';
import { NoteGet } from '@repo/types/models/note';
import { WorkspaceGet } from '@repo/types/models/workspace';

export type ActiveTaskValue = TaskGet | null;
export type ActiveWorkspaceValue = WorkspaceGet | null;
type NoteActions = { move?: boolean; merge?: boolean };
export type ActiveNoteValue = ({ item: NoteGet } & NoteActions) | null;
export type ActiveItemsValue =
  | {
      confirm?: any;
      workspace?: ActiveWorkspaceValue;
      note?: ActiveNoteValue;
      task?: ActiveTaskValue;
    }
  | null
  | undefined;

interface ActiveItemsState {
  activeItems: ActiveItemsValue;
  addActiveConfirm: (data: any) => void;
  removeActiveConfirm: () => void;
  addActiveWorkspace: (data: WorkspaceGet) => void;
  removeActiveWorkspace: () => void;
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
        workspace: state.activeItems?.workspace ?? null,
        note: state.activeItems?.note ?? null,
        confirm: data,
      },
    }));
  },

  removeActiveConfirm: () => {
    set((state) => ({
      activeItems: {
        task: state.activeItems?.task ?? null,
        workspace: state.activeItems?.workspace ?? null,
        note: state.activeItems?.note ?? null,
        confirm: null,
      },
    }));
  },

  addActiveWorkspace: (data) => {
    set((state) => ({
      activeItems: {
        confirm: state.activeItems?.task ?? null,
        task: state.activeItems?.task ?? null,
        note: state.activeItems?.note ?? null,
        workspace: data,
      },
    }));
  },

  removeActiveWorkspace: () => {
    set((state) => ({
      activeItems: {
        confirm: state.activeItems?.task ?? null,
        task: state.activeItems?.task ?? null,
        note: state.activeItems?.note ?? null,
        workspace: null,
      },
    }));
  },

  addActiveNote: (data, actions?: NoteActions) => {
    set((state) => ({
      activeItems: {
        confirm: state.activeItems?.task ?? null,
        task: state.activeItems?.task ?? null,
        workspace: state.activeItems?.workspace ?? null,
        note: { item: data, ...actions },
      },
    }));
  },

  removeActiveNote: () => {
    set((state) => ({
      activeItems: {
        confirm: state.activeItems?.confirm ?? null,
        task: state.activeItems?.task ?? null,
        workspace: state.activeItems?.workspace ?? null,
        note: null,
      },
    }));
  },

  addActiveTask: (data) => {
    set((state) => ({
      activeItems: {
        confirm: state.activeItems?.confirm ?? null,
        workspace: state.activeItems?.workspace ?? null,
        note: state.activeItems?.note ?? null,
        task: data,
      },
    }));
  },

  removeActiveTask: () => {
    set((state) => ({
      activeItems: {
        confirm: state.activeItems?.confirm ?? null,
        workspace: state.activeItems?.workspace ?? null,
        note: state.activeItems?.note ?? null,
        task: null,
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
