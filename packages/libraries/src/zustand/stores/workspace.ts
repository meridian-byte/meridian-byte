import { create } from 'zustand';
import type { WorkspaceGet } from '@repo/types/models/workspace';

export type WorkspacesValue = WorkspaceGet[] | null | undefined;

interface WorkspaceState {
  posts: WorkspacesValue;
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
  posts: undefined,
  deleted: [],

  setWorkspaces: (data) => {
    set({ posts: data });
  },

  setDeletedWorkspaces: (data) => {
    set({ deleted: data || [] });
  },

  clearWorkspaces: () => {
    set({ posts: [] });
  },

  clearDeletedWorkspaces: () => {
    set({ deleted: [] });
  },

  addWorkspace: (data) => {
    set((state) => ({
      posts: [...(state.posts ?? []), data],
    }));
  },

  updateWorkspace: (data) => {
    set((state) => ({
      posts:
        state.posts?.map((i) => (i.id === data.id ? { ...data } : i)) ??
        undefined,
    }));
  },

  deleteWorkspace: (data) => {
    set((state) => ({
      deleted: [...state.deleted, data],
      posts: state.posts?.filter((i) => i.id !== data.id) ?? undefined,
    }));
  },
}));
