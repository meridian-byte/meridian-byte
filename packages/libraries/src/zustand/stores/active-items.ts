import { create } from 'zustand';
import { TaskGet } from '@repo/types/models/task';
import { NoteGet } from '@repo/types/models/note';
import { WorkspaceGet } from '@repo/types/models/workspace';

export type ActiveTaskValue = TaskGet | null;
export type ActiveWorkspaceValue = WorkspaceGet | null;
type NoteActions = {
  move?: { toNote?: boolean; toWorkspace?: boolean };
  merge?: boolean;
};
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

  addActiveConfirm: (data) =>
    set((state) => ({
      activeItems: { ...state.activeItems, confirm: data },
    })),

  removeActiveConfirm: () =>
    set((state) => ({
      activeItems: { ...state.activeItems, confirm: null },
    })),

  addActiveWorkspace: (data) =>
    set((state) => ({
      activeItems: { ...state.activeItems, workspace: data },
    })),

  removeActiveWorkspace: () =>
    set((state) => ({
      activeItems: { ...state.activeItems, workspace: null },
    })),

  addActiveNote: (data, actions) =>
    set((state) => ({
      activeItems: { ...state.activeItems, note: { item: data, ...actions } },
    })),

  removeActiveNote: () =>
    set((state) => ({
      activeItems: { ...state.activeItems, note: null },
    })),

  addActiveTask: (data) =>
    set((state) => ({
      activeItems: { ...state.activeItems, task: data },
    })),

  removeActiveTask: () =>
    set((state) => ({
      activeItems: { ...state.activeItems, task: null },
    })),

  setActiveItems: (data) => set({ activeItems: data }),

  clearActiveItems: () => set({ activeItems: undefined }),
}));
