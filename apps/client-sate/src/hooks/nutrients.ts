import { useStoreFood } from '@/libraries/zustand/stores/food';
import { useStoreServing } from '@/libraries/zustand/stores/serving';
import { getFoodServingTotals, ServingTotals } from '@/utilities/string';
import { EatGet } from '@repo/types/models/eat';
import { MealGet } from '@repo/types/models/meal';
import { ServingGet } from '@repo/types/models/serving';

export const useServingTotals = (params?: { servings?: ServingGet[] }) => {
  const { servings } = useStoreServing();
  const { foods } = useStoreFood();

  const totalServingsNutrients: ServingTotals = {
    totalCarbs: 0,
    totalProtein: 0,
    totalFat: 0,
    totalKcal: 0,
  };

  (params?.servings || servings || []).forEach((s) => {
    const servingFood = foods?.find((f) => f.id == s.food_id);

    if (servingFood) {
      const totalNutrients = getFoodServingTotals({
        food: servingFood,
        serving: s,
      });

      totalServingsNutrients.totalCarbs += totalNutrients.totalCarbs;
      totalServingsNutrients.totalProtein += totalNutrients.totalProtein;
      totalServingsNutrients.totalFat += totalNutrients.totalFat;
      totalServingsNutrients.totalKcal += totalNutrients.totalKcal;
    }
  });

  return {
    totalServingsNutrients,
  };
};

export const useMealTotals = (params: { meal: MealGet }) => {
  const { meal } = params;
  const { servings } = useStoreServing();
  const mealServings = servings?.filter((s) => s.meal_id == meal.id);

  const { totalServingsNutrients } = useServingTotals({
    servings: mealServings,
  });

  return {
    totalMealNutrients: totalServingsNutrients,
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

  const { totalServingsNutrients } = useServingTotals({
    servings: eatServings,
  });

  return {
    totalEatenNutrients: totalServingsNutrients,
  };
};
