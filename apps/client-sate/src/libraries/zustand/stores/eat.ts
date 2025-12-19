import { create } from 'zustand';
import type { EatGet } from '@repo/types/models/eat';

export type EatsValue = EatGet[] | null | undefined;

interface EatState {
  eats: EatsValue;
  deleted: EatGet[];
  setEats: (data: EatsValue) => void;
  setDeletedEats: (data: EatsValue) => void;
  clearEats: () => void;
  clearDeletedEats: () => void;
  addEat: (data: EatGet) => void;
  updateEat: (data: EatGet) => void;
  deleteEat: (data: EatGet) => void;
}

export const useStoreEat = create<EatState>((set) => ({
  eats: undefined,
  deleted: [],

  setEats: (data) => {
    set({ eats: data });
  },

  setDeletedEats: (data) => {
    set({ deleted: data || [] });
  },

  clearEats: () => {
    set({ eats: [] });
  },

  clearDeletedEats: () => {
    set({ deleted: [] });
  },

  addEat: (data) => {
    set((state) => ({
      eats: [...(state.eats ?? []), data],
    }));
  },

  updateEat: (data) => {
    set((state) => ({
      eats:
        state.eats?.map((i) => (i.id === data.id ? { ...data } : i)) ??
        undefined,
    }));
  },

  deleteEat: (data) => {
    set((state) => ({
      deleted: [...state.deleted, data],
      eats: state.eats?.filter((i) => i.id !== data.id) ?? undefined,
    }));
  },
}));
