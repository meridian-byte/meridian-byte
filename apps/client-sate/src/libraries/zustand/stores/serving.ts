import { create } from 'zustand';
import type { ServingGet } from '@repo/types/models/serving';

export type ServingsValue = ServingGet[] | null | undefined;

interface ServingState {
  servings: ServingsValue;
  deleted: ServingGet[];
  setServings: (data: ServingsValue) => void;
  setDeletedServings: (data: ServingsValue) => void;
  clearServings: () => void;
  clearDeletedServings: () => void;
  addServing: (data: ServingGet) => void;
  updateServing: (data: ServingGet) => void;
  deleteServing: (data: ServingGet) => void;
}

export const useStoreServing = create<ServingState>((set) => ({
  servings: undefined,
  deleted: [],

  setServings: (data) => {
    set({ servings: data });
  },

  setDeletedServings: (data) => {
    set({ deleted: data || [] });
  },

  clearServings: () => {
    set({ servings: [] });
  },

  clearDeletedServings: () => {
    set({ deleted: [] });
  },

  addServing: (data) => {
    set((state) => ({
      servings: [...(state.servings ?? []), data],
    }));
  },

  updateServing: (data) => {
    set((state) => ({
      servings:
        state.servings?.map((i) => (i.id === data.id ? { ...data } : i)) ??
        undefined,
    }));
  },

  deleteServing: (data) => {
    set((state) => ({
      deleted: [...state.deleted, data],
      servings: state.servings?.filter((i) => i.id !== data.id) ?? undefined,
    }));
  },
}));
