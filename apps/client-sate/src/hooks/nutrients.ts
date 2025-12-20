import { useStoreFood } from '@/libraries/zustand/stores/food';
import { useStoreServing } from '@/libraries/zustand/stores/serving';
import {
  formatNumber,
  getFoodServingTotals,
  ServingTotals,
} from '@/utilities/string';
import { EatGet } from '@repo/types/models/eat';
import { MealGet } from '@repo/types/models/meal';
import { ServingGet } from '@repo/types/models/serving';

export const useServingTotals = (params?: {
  servings?: ServingGet[];
  options?: { round?: boolean };
}): ServingTotals => {
  const { servings } = useStoreServing();
  const { foods } = useStoreFood();

  const totalServingsNutrients: ServingTotals = {
    totalCarbs: '0',
    totalProtein: '0',
    totalFat: '0',
    totalKcal: '0',
  };

  (params?.servings || servings || []).forEach((s) => {
    const servingFood = foods?.find((f) => f.id == s.food_id);

    if (servingFood) {
      const totalNutrients = getFoodServingTotals({
        food: servingFood,
        serving: s,
      });

      totalServingsNutrients.totalCarbs = formatNumber(
        Number(totalServingsNutrients.totalCarbs) +
          Number(totalNutrients.totalCarbs)
      );

      totalServingsNutrients.totalProtein = formatNumber(
        Number(totalServingsNutrients.totalProtein) +
          Number(totalNutrients.totalProtein)
      );

      totalServingsNutrients.totalFat = formatNumber(
        Number(totalServingsNutrients.totalFat) +
          Number(totalNutrients.totalFat)
      );

      totalServingsNutrients.totalKcal = Math.round(
        Number(totalServingsNutrients.totalKcal) +
          Number(totalNutrients.totalKcal)
      ).toString();
    }
  });

  if (params?.options?.round) {
    return {
      ...totalServingsNutrients,
      totalCarbs: Math.round(
        Number(totalServingsNutrients.totalCarbs)
      ).toString(),
      totalProtein: Math.round(
        Number(totalServingsNutrients.totalProtein)
      ).toString(),
      totalFat: Math.round(Number(totalServingsNutrients.totalFat)).toString(),
    };
  }

  return { ...totalServingsNutrients };
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
  const { servings } = useStoreServing();

  const { eats } = params;
  let eatServings: ServingGet[] = [];

  eats.forEach((e) => {
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
