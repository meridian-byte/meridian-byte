import { create } from 'zustand';
import type { MealGet } from '@repo/types/models/meal';

export type MealsValue = MealGet[] | null | undefined;

interface MealState {
  meals: MealsValue;
  deleted: MealGet[];
  setMeals: (data: MealsValue) => void;
  setDeletedMeals: (data: MealsValue) => void;
  clearMeals: () => void;
  clearDeletedMeals: () => void;
  addMeal: (data: MealGet) => void;
  updateMeal: (data: MealGet) => void;
  deleteMeal: (data: MealGet) => void;
}

export const useStoreMeal = create<MealState>((set) => ({
  meals: undefined,
  deleted: [],

  setMeals: (data) => {
    set({ meals: data });
  },

  setDeletedMeals: (data) => {
    set({ deleted: data || [] });
  },

  clearMeals: () => {
    set({ meals: [] });
  },

  clearDeletedMeals: () => {
    set({ deleted: [] });
  },

  addMeal: (data) => {
    set((state) => ({
      meals: [...(state.meals ?? []), data],
    }));
  },

  updateMeal: (data) => {
    set((state) => ({
      meals:
        state.meals?.map((i) => (i.id === data.id ? { ...data } : i)) ??
        undefined,
    }));
  },

  deleteMeal: (data) => {
    set((state) => ({
      deleted: [...state.deleted, data],
      meals: state.meals?.filter((i) => i.id !== data.id) ?? undefined,
    }));
  },
}));
