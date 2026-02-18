import { create } from 'zustand';
import type { MassGet } from '@repo/types/models/mass';

export type massesValue = MassGet[] | null | undefined;

interface massestate {
  masses: massesValue;
  deleted: MassGet[];
  setMasses: (data: massesValue) => void;
  setDeletedmasses: (data: massesValue) => void;
  clearMasses: () => void;
  clearDeletedMasses: () => void;
  addMass: (data: MassGet) => void;
  updateMass: (data: MassGet) => void;
  deleteMass: (data: MassGet) => void;
}

export const useStoreMass = create<massestate>((set) => ({
  masses: undefined,
  deleted: [],

  setMasses: (data) => {
    set({ masses: data });
  },

  setDeletedmasses: (data) => {
    set({ deleted: data || [] });
  },

  clearMasses: () => {
    set({ masses: [] });
  },

  clearDeletedMasses: () => {
    set({ deleted: [] });
  },

  addMass: (data) => {
    set((state) => ({
      masses: [...(state.masses ?? []), data],
    }));
  },

  updateMass: (data) => {
    set((state) => ({
      masses:
        state.masses?.map((i) => (i.id === data.id ? { ...data } : i)) ??
        undefined,
    }));
  },

  deleteMass: (data) => {
    set((state) => ({
      deleted: [...state.deleted, data],
      masses: state.masses?.filter((i) => i.id !== data.id) ?? undefined,
    }));
  },
}));
