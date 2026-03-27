import { WeightUnitType } from '@repo/types/models/enums';
import { FoodGet } from '@repo/types/models/food';
import { ServingGet } from '@repo/types/models/serving';

export const getUnitShorts = (unit: string) => {
  switch (unit) {
    case WeightUnitType.GRAMS:
      return 'g';

    case WeightUnitType.MILLIGRAMS:
      return 'mg';

    default:
      return 'unit';
  }
};

export type ServingTotals = {
  totalCarbs: number;
  totalProtein: number;
  totalFat: number;
  totalKcal: number;
};

export const getFoodServingTotals = (params: {
  food: FoodGet;
  serving?: ServingGet;
}): ServingTotals => {
  const { food, serving } = params;
  const perUnit = food.per;
  const totalUnit = serving?.serving_size || food.per;

  return {
    totalCarbs: getTotalunit(food.carbs, perUnit, totalUnit),
    totalProtein: getTotalunit(food.protein, perUnit, totalUnit),
    totalFat: getTotalunit(food.fat, perUnit, totalUnit),
    totalKcal: getTotalunit(food.kcal, perUnit, totalUnit),
  };
};

const getTotalunit = (value: number, unitSize: number, servingSize: number) => {
  return Math.floor((servingSize / unitSize) * value);
};
