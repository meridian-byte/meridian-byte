import { create } from 'zustand';
import type { ViewGet } from '@repo/types/models/view';

export type ViewsValue = ViewGet[] | null | undefined;

interface ViewState {
  views: ViewsValue;
  deleted: ViewGet[];
  setViews: (data: ViewsValue) => void;
  setDeletedViews: (data: ViewsValue) => void;
  clearViews: () => void;
  clearDeletedViews: () => void;
  addView: (data: ViewGet) => void;
  updateView: (data: ViewGet) => void;
  deleteView: (data: ViewGet) => void;
}

export const useStoreView = create<ViewState>((set) => ({
  views: undefined,
  deleted: [],

  setViews: (data) => {
    set({ views: data });
  },

  setDeletedViews: (data) => {
    set({ deleted: data || [] });
  },

  clearViews: () => {
    set({ views: [] });
  },

  clearDeletedViews: () => {
    set({ deleted: [] });
  },

  addView: (data) => {
    set((state) => ({
      views: [...(state.views ?? []), data],
    }));
  },

  updateView: (data) => {
    set((state) => ({
      views:
        state.views?.map((i) => (i.id === data.id ? { ...data } : i)) ??
        undefined,
    }));
  },

  deleteView: (data) => {
    set((state) => ({
      deleted: [...state.deleted, data],
      views: state.views?.filter((i) => i.id !== data.id) ?? undefined,
    }));
  },
}));
