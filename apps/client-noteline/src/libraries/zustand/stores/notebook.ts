import { create } from 'zustand';
import type { NotebookGet } from '@repo/types/models/notebook';

export type NotebooksValue = NotebookGet[] | null | undefined;

interface NotebookState {
  notebooks: NotebooksValue;
  deleted: NotebookGet[];
  setNotebooks: (data: NotebooksValue) => void;
  setDeletedNotebooks: (data: NotebooksValue) => void;
  clearNotebooks: () => void;
  clearDeletedNotebooks: () => void;
  addNotebook: (data: NotebookGet) => void;
  updateNotebook: (data: NotebookGet) => void;
  deleteNotebook: (data: NotebookGet) => void;
}

export const useStoreNotebook = create<NotebookState>((set) => ({
  notebooks: undefined,
  deleted: [],

  setNotebooks: (data) => {
    set({ notebooks: data });
  },

  setDeletedNotebooks: (data) => {
    set({ deleted: data || [] });
  },

  clearNotebooks: () => {
    set({ notebooks: [] });
  },

  clearDeletedNotebooks: () => {
    set({ deleted: [] });
  },

  addNotebook: (data) => {
    set((state) => ({
      notebooks: [...(state.notebooks ?? []), data],
    }));
  },

  updateNotebook: (data) => {
    set((state) => ({
      notebooks:
        state.notebooks?.map((i) => (i.id === data.id ? { ...data } : i)) ??
        undefined,
    }));
  },

  deleteNotebook: (data) => {
    set((state) => ({
      deleted: [...state.deleted, data],
      notebooks: state.notebooks?.filter((i) => i.id !== data.id) ?? undefined,
    }));
  },
}));
