import { create } from 'zustand';
import type { CustomizationGet } from '@repo/types/models/customization';

export type CustomizationsValue = CustomizationGet[] | null | undefined;

interface CustomizationState {
  customizations: CustomizationsValue;
  deleted: CustomizationGet[];
  setCustomizations: (data: CustomizationsValue) => void;
  setDeletedCustomizations: (data: CustomizationsValue) => void;
  clearCustomizations: () => void;
  clearDeletedCustomizations: () => void;
  addCustomization: (data: CustomizationGet) => void;
  updateCustomization: (data: CustomizationGet) => void;
  deleteCustomization: (data: CustomizationGet) => void;
}

export const useStoreCustomization = create<CustomizationState>((set) => ({
  customizations: undefined,
  deleted: [],

  setCustomizations: (data) => {
    set({ customizations: data });
  },

  setDeletedCustomizations: (data) => {
    set({ deleted: data || [] });
  },

  clearCustomizations: () => {
    set({ customizations: [] });
  },

  clearDeletedCustomizations: () => {
    set({ deleted: [] });
  },

  addCustomization: (data) => {
    set((state) => ({
      customizations: [...(state.customizations ?? []), data],
    }));
  },

  updateCustomization: (data) => {
    set((state) => ({
      customizations:
        state.customizations?.map((i) =>
          i.id === data.id ? { ...data } : i
        ) ?? undefined,
    }));
  },

  deleteCustomization: (data) => {
    set((state) => ({
      deleted: [...state.deleted, data],
      customizations:
        state.customizations?.filter((i) => i.id !== data.id) ?? undefined,
    }));
  },
}));
