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
import { ServingGet } from '@repo/types/models/serving';
import { useStoreFood } from '@/libraries/zustand/stores/food';
import { capitalizeWords } from '@repo/utilities/string';
import { getFoodServingTotals, getUnitShorts } from '@/utilities/string';
import { COLOR_CODES } from '@repo/constants/other';

export default function Serving({ props }: { props: ServingGet }) {
  const { foods } = useStoreFood();
  const servingFood = foods?.find((f) => f.id == props.food_id);

  if (!servingFood) return null;

  const totalNutrients = getFoodServingTotals({
    food: servingFood,
    serving: props,
  });

  return (
    <Card radius={0} bg={'transparent'} padding={0} py={5}>
      <Stack gap={2}>
        <Title
          order={3}
          fz={{ base: 'sm', xs: 'md' }}
          fw={'normal'}
          lineClamp={1}
        >
          {servingFood.description},{' '}
          <Text component="span" inherit c={'dimmed'}>
            {servingFood.name}
          </Text>
        </Title>

        <Group
          fz={{ base: 'xs', xs: 'sm' }}
          c={'dimmed'}
          justify="space-between"
          wrap="nowrap"
        >
          <Text inherit lineClamp={1}>
            <Text component="span" inherit>
              <Text component="span" inherit c={`${COLOR_CODES.FOOD.CARBS}.6`}>
                <NumberFormatter value={totalNutrients.totalCarbs} />
              </Text>{' '}
              {getUnitShorts(props.serving_unit)}
            </Text>
            ,{' '}
            <Text component="span" inherit>
              <Text
                component="span"
                inherit
                c={`${COLOR_CODES.FOOD.PROTEINS}.6`}
              >
                <NumberFormatter value={totalNutrients.totalProtein} />
              </Text>{' '}
              {getUnitShorts(props.serving_unit)}
            </Text>
            ,{' '}
            <Text component="span" inherit>
              <Text component="span" inherit c={`${COLOR_CODES.FOOD.FATS}.6`}>
                <NumberFormatter value={totalNutrients.totalFat} />
              </Text>{' '}
              {getUnitShorts(props.serving_unit)}
            </Text>{' '}
            -{' '}
            <Text component="span" inherit>
              <Text component="span" inherit c={`${COLOR_CODES.FOOD.KCAL}.6`}>
                <NumberFormatter value={totalNutrients.totalKcal} />
              </Text>{' '}
              Kcal
            </Text>
          </Text>

          <Text inherit fz={{ base: 'xs', xs: 'sm' }} ta={'end'} c={'dimmed'}>
            {props.serving_size} {props.serving_unit.toLowerCase().slice(0, 2)}
          </Text>
        </Group>
      </Stack>
    </Card>
  );
}
