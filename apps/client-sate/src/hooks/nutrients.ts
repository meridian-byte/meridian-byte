import { useStoreFood } from '@/libraries/zustand/stores/food';
import { useStoreServing } from '@/libraries/zustand/stores/serving';
import { formatNumber } from '@/utilities/number';
import { EatGet } from '@repo/types/models/eat';
import { WeightUnitType } from '@repo/types/models/enums';
import { FoodGet } from '@repo/types/models/food';
import { MealGet } from '@repo/types/models/meal';
import { ServingGet } from '@repo/types/models/serving';

export const useServingTotals = (params?: {
  servings?: ServingGet[];
  options?: { round?: boolean };
}): ServingTotals => {
  const { servings } = useStoreServing();
  const { foods } = useStoreFood();

  const totals: { carbs: number; protein: number; fat: number; kcal: number } =
    {
      carbs: 0,
      protein: 0,
      fat: 0,
      kcal: 0,
    };

  (params?.servings || servings || []).forEach((s) => {
    const servingFood = foods?.find((f) => f.id == s.food_id);

    if (!servingFood) return;

    const nutrientTotals = getFoodServingTotals({
      food: servingFood,
      serving: s,
    });

    totals.carbs += nutrientTotals.totalCarbs;
    totals.protein += nutrientTotals.totalProtein;
    totals.fat += nutrientTotals.totalFat;
    totals.kcal += nutrientTotals.totalKcal;
  });

  return {
    totalCarbs: params?.options?.round
      ? Math.round(totals.carbs)
      : formatNumber(totals.carbs),
    totalProtein: params?.options?.round
      ? Math.round(totals.protein)
      : formatNumber(totals.protein),
    totalFat: params?.options?.round
      ? Math.round(totals.fat)
      : formatNumber(totals.fat),
    totalKcal: Math.round(totals.kcal),
  };
};

export const useMealTotals = (params: { meal: MealGet }) => {
  const { meal } = params;
  const { servings } = useStoreServing();
  const mealServings = servings?.filter((s) => s.meal_id == meal.id);

  const servingTotals = useServingTotals({
    servings: mealServings,
  });

  return {
    totalMealNutrients: servingTotals,
  };
};

export const useEatTotals = (params: { eats: EatGet[] }) => {
  const { eats } = params;

  // remove duplicates
  const dedupedEats = Array.from(new Map(eats.map((e) => [e.id, e])).values());

  const { servings } = useStoreServing();

  let eatServings: ServingGet[] = [];

  dedupedEats.forEach((e) => {
    eatServings = [
      ...eatServings,
      ...(servings?.filter((s) => s.eat_id == e.id) || []),
    ];
  });

  const servingTotals = useServingTotals({
    servings: eatServings,
    options: { round: true },
  });

  return {
    totalEatenNutrients: servingTotals,
  };
};

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
  options?: { round?: boolean };
}): ServingTotals => {
  const { food, serving } = params;
  const perUnit = food.per;
  const totalUnit = serving?.serving_size || food.per;

  const totalCarbs = (totalUnit / perUnit) * food.carbs;
  const totalProtein = (totalUnit / perUnit) * food.protein;
  const totalFat = (totalUnit / perUnit) * food.fat;
  const totalKcal = (totalUnit / perUnit) * food.kcal;

  if (params.options?.round) {
    return {
      totalCarbs: Math.round(totalCarbs),
      totalProtein: Math.round(totalProtein),
      totalFat: Math.round(totalFat),
      totalKcal: Math.round(totalKcal),
    };
  }

  return {
    totalCarbs: formatNumber(totalCarbs),
    totalProtein: formatNumber(totalProtein),
    totalFat: formatNumber(totalFat),
    totalKcal: formatNumber(totalKcal),
  };
};
