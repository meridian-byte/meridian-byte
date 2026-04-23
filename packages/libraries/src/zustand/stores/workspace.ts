import { create } from 'zustand';
import type { WorkspaceGet } from '@repo/types/models/workspace';

export type WorkspacesValue = WorkspaceGet[] | null | undefined;

interface WorkspaceState {
  workspaces: WorkspacesValue;
  deleted: WorkspaceGet[];
  setWorkspaces: (data: WorkspacesValue) => void;
  setDeletedWorkspaces: (data: WorkspacesValue) => void;
  clearWorkspaces: () => void;
  clearDeletedWorkspaces: () => void;
  addWorkspace: (data: WorkspaceGet) => void;
  updateWorkspace: (data: WorkspaceGet) => void;
  deleteWorkspace: (data: WorkspaceGet) => void;
}

export const useStoreWorkspace = create<WorkspaceState>((set) => ({
  workspaces: undefined,
  deleted: [],

  setWorkspaces: (data) => {
    set({ workspaces: data });
  },

  setDeletedWorkspaces: (data) => {
    set({ deleted: data || [] });
  },

  clearWorkspaces: () => {
    set({ workspaces: [] });
  },

  clearDeletedWorkspaces: () => {
    set({ deleted: [] });
  },

  addWorkspace: (data) => {
    set((state) => ({
      workspaces: [...(state.workspaces ?? []), data],
    }));
  },

  updateWorkspace: (data) => {
    set((state) => ({
      workspaces:
        state.workspaces?.map((i) => (i.id === data.id ? { ...data } : i)) ??
        undefined,
    }));
  },

  deleteWorkspace: (data) => {
    set((state) => ({
      deleted: [...state.deleted, data],
      workspaces:
        state.workspaces?.filter((i) => i.id !== data.id) ?? undefined,
    }));
  },
}));
