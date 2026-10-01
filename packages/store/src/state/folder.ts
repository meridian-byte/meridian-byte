import { create } from 'zustand';
import type { FolderGet } from '@repo/types';
import { hasChanges } from '@repo/utils';

export type FoldersValue = FolderGet[] | null | undefined;

interface FolderState {
  folders: FoldersValue;
  deleted: FolderGet[];
  setFolders: (data: FoldersValue) => void;
  setDeletedFolders: (data: FoldersValue) => void;
  clearFolders: () => void;
  clearDeletedFolders: () => void;
  addFolder: (data: FolderGet) => void;
  updateFolder: (data: FolderGet) => void;
  mergeFolders: (data: FolderGet[]) => void;
  deleteFolder: (data: FolderGet) => void;
}

export const useStoreFolder = create<FolderState>((set) => ({
  folders: undefined,
  deleted: [],

  setFolders: (data) => {
    set({ folders: data });
  },

  setDeletedFolders: (data) => {
    set({ deleted: data || [] });
  },

  clearFolders: () => {
    set({ folders: [] });
  },

  clearDeletedFolders: () => {
    set({ deleted: [] });
  },

  addFolder: (data) => {
    set((state) => ({
      folders: [...(state.folders ?? []), data],
    }));
  },

  updateFolder: (data) => {
    set((state) => ({
      folders: state.folders?.map((i) => (i.id === data.id ? { ...data } : i)) ?? undefined,
    }));
  },

  mergeFolders: (incomingFolders) => {
    set((state) => {
      if (!incomingFolders || incomingFolders.length === 0) return state;

      // If initial state is empty, set it directly
      if (!state.folders) {
        return { folders: incomingFolders };
      }

      let hasChanged = false;
      const incomingMap = new Map(incomingFolders.map((n) => [String(n.id), n]));

      // 1. Update existing folders in place if fields differ
      const nextFolders = state.folders.map((existing) => {
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

      // 2. Append new folders that aren't in the store yet
      const existingIds = new Set(state.folders.map((n) => String(n.id)));
      for (const incoming of incomingFolders) {
        if (!existingIds.has(String(incoming.id))) {
          nextFolders.push(incoming);
          hasChanged = true;
        }
      }

      // CRITICAL: Return original `state` if nothing changed.
      // Zustand skips re-rendering all subscribers when the returned state reference is identical.
      if (!hasChanged) return state;

      return { folders: nextFolders };
    });
  },

  deleteFolder: (data) => {
    set((state) => ({
      deleted: [...state.deleted, data],
      folders: state.folders?.filter((i) => i.id !== data.id) ?? undefined,
    }));
  },
}));
