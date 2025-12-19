import { create } from 'zustand';
import type { FoodGet } from '@repo/types/models/food';

export type FoodsValue = FoodGet[] | null | undefined;

interface FoodState {
  foods: FoodsValue;
  deleted: FoodGet[];
  setFoods: (data: FoodsValue) => void;
  setDeletedFoods: (data: FoodsValue) => void;
  clearFoods: () => void;
  clearDeletedFoods: () => void;
  addFood: (data: FoodGet) => void;
  updateFood: (data: FoodGet) => void;
  deleteFood: (data: FoodGet) => void;
}

export const useStoreFood = create<FoodState>((set) => ({
  foods: undefined,
  deleted: [],

  setFoods: (data) => {
    set({ foods: data });
  },

  setDeletedFoods: (data) => {
    set({ deleted: data || [] });
  },

  clearFoods: () => {
    set({ foods: [] });
  },

  clearDeletedFoods: () => {
    set({ deleted: [] });
  },

  addFood: (data) => {
    set((state) => ({
      foods: [...(state.foods ?? []), data],
    }));
  },

  updateFood: (data) => {
    set((state) => ({
      foods:
        state.foods?.map((i) => (i.id === data.id ? { ...data } : i)) ??
        undefined,
    }));
  },

  deleteFood: (data) => {
    set((state) => ({
      deleted: [...state.deleted, data],
      foods: state.foods?.filter((i) => i.id !== data.id) ?? undefined,
    }));
  },
}));
