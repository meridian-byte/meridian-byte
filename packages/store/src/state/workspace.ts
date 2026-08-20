import { create } from 'zustand';
import type { WorkspaceGet } from '@repo/types';
import { hasChanges } from '@repo/utils';

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
  mergeWorkspaces: (data: WorkspaceGet[]) => void;
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
      workspaces: state.workspaces?.map((i) => (i.id === data.id ? { ...data } : i)) ?? undefined,
    }));
  },

  mergeWorkspaces: (incomingWorkspaces) => {
    set((state) => {
      if (!incomingWorkspaces || incomingWorkspaces.length === 0) return state;

      // If initial state is empty, set it directly
      if (!state.workspaces) {
        return { workspaces: incomingWorkspaces };
      }

      let hasChanged = false;
      const incomingMap = new Map(incomingWorkspaces.map((n) => [String(n.id), n]));

      // 1. Update existing workspaces in place if fields differ
      const nextWorkspaces = state.workspaces.map((existing) => {
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

      // 2. Append new workspaces that aren't in the store yet
      const existingIds = new Set(state.workspaces.map((n) => String(n.id)));
      for (const incoming of incomingWorkspaces) {
        if (!existingIds.has(String(incoming.id))) {
          nextWorkspaces.push(incoming);
          hasChanged = true;
        }
      }

      // CRITICAL: Return original `state` if nothing changed.
      // Zustand skips re-rendering all subscribers when the returned state reference is identical.
      if (!hasChanged) return state;

      return { workspaces: nextWorkspaces };
    });
  },

  deleteWorkspace: (data) => {
    set((state) => ({
      deleted: [...state.deleted, data],
      workspaces: state.workspaces?.filter((i) => i.id !== data.id) ?? undefined,
    }));
  },
}));
