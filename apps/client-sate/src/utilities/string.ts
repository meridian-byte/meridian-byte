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
  totalCarbs: string;
  totalProtein: string;
  totalFat: string;
  totalKcal: string;
};

export const getFoodServingTotals = (params: {
  food: FoodGet;
  serving?: ServingGet;
  options?: { round?: boolean };
}): ServingTotals => {
  const { food, serving } = params;
  const perUnit = food.per;
  const totalUnit = serving?.serving_size || food.per;

  const totalCarbs = getTotalunit(food.carbs, perUnit, totalUnit);
  const totalProtein = getTotalunit(food.protein, perUnit, totalUnit);
  const totalFat = getTotalunit(food.fat, perUnit, totalUnit);
  const totalKcal = Math.round(
    Number(getTotalunit(food.kcal, perUnit, totalUnit))
  ).toString();

  if (params.options?.round) {
    return {
      totalCarbs: Math.round(Number(totalCarbs)).toString(),
      totalProtein: Math.round(Number(totalProtein)).toString(),
      totalFat: Math.round(Number(totalFat)).toString(),
      totalKcal,
    };
  }

  return {
    totalCarbs,
    totalProtein,
    totalFat,
    totalKcal,
  };
};

export function formatNumber(n: number): string {
  return Number.isInteger(n) ? n.toString() : n.toFixed(1);
}

const getTotalunit = (value: number, unitSize: number, servingSize: number) => {
  return formatNumber((servingSize / unitSize) * value).toString();
};
