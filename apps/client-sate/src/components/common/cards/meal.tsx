'use client';

import React from 'react';
import {
  Card,
  Group,
  NumberFormatter,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { MealGet } from '@repo/types/models/meal';
import { useStoreServing } from '@/libraries/zustand/stores/serving';
import {
  getFoodServingTotals,
  getUnitShorts,
  ServingTotals,
} from '@/utilities/string';
import { useStoreFood } from '@/libraries/zustand/stores/food';
import { WeightUnitType } from '@repo/types/models/enums';

export default function Meal({ props }: { props: MealGet }) {
  const { servings } = useStoreServing();
  const { foods } = useStoreFood();
  const mealServings = servings?.filter((s) => s.meal_id == props.id);

  const totalMealNutrients: ServingTotals = {
    totalCarbs: 0,
    totalProtein: 0,
    totalFat: 0,
    totalKcal: 0,
  };

  mealServings?.forEach((s) => {
    const servingFood = foods?.find((f) => f.id == s.food_id);

    if (servingFood) {
      const totalNutrients = getFoodServingTotals({
        food: servingFood,
        serving: s,
      });

      totalMealNutrients.totalCarbs += totalNutrients.totalCarbs;
      totalMealNutrients.totalProtein += totalNutrients.totalProtein;
      totalMealNutrients.totalFat += totalNutrients.totalFat;
      totalMealNutrients.totalKcal += totalNutrients.totalKcal;
    }
  });

  return (
    <Card radius={0} bg={'transparent'} padding={0} py={5}>
      <Group justify="space-between">
        <Stack gap={2}>
          <div>
            <Title order={3} fz={'md'} fw={'normal'}>
              {props.name}
            </Title>
            <Text component="span" inherit c={'dimmed'}>
              {props.description}
            </Text>
          </div>

          <Group fz={'sm'} c={'dimmed'}>
            <Text inherit lineClamp={1}>
              <Text component="span" inherit>
                C: <NumberFormatter value={totalMealNutrients.totalCarbs} />{' '}
                {getUnitShorts(WeightUnitType.GRAMS)}
              </Text>
              ,{' '}
              <Text component="span" inherit>
                P: <NumberFormatter value={totalMealNutrients.totalProtein} />{' '}
                {getUnitShorts(WeightUnitType.GRAMS)}
              </Text>
              ,{' '}
              <Text component="span" inherit>
                F: <NumberFormatter value={totalMealNutrients.totalFat} />{' '}
                {getUnitShorts(WeightUnitType.GRAMS)}
              </Text>
            </Text>
          </Group>
        </Stack>

        <Stack gap={0} align="end" ta={'end'}>
          <Text inherit>
            <NumberFormatter value={totalMealNutrients.totalKcal} /> Kcal
          </Text>
        </Stack>
      </Group>
    </Card>
  );
}
