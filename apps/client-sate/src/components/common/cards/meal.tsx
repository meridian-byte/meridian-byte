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
import { getUnitShorts } from '@/utilities/string';
import { WeightUnitType } from '@repo/types/models/enums';
import { useMealTotals } from '@/hooks/nutrients';

export default function Meal({ props }: { props: MealGet }) {
  const { totalMealNutrients } = useMealTotals({ meal: props });

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
                <Text component="span" inherit c={'blue.6'}>
                  <NumberFormatter value={totalMealNutrients.totalCarbs} />
                </Text>{' '}
                {getUnitShorts(WeightUnitType.GRAMS)}
              </Text>
              ,{' '}
              <Text component="span" inherit>
                <Text component="span" inherit c={'green.6'}>
                  <NumberFormatter value={totalMealNutrients.totalProtein} />
                </Text>{' '}
                {getUnitShorts(WeightUnitType.GRAMS)}
              </Text>
              ,{' '}
              <Text component="span" inherit>
                <Text component="span" inherit c={'yellow.6'}>
                  <NumberFormatter value={totalMealNutrients.totalFat} />
                </Text>{' '}
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
