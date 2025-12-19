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
import { FoodGet } from '@repo/types/models/food';
import { capitalizeWords } from '@repo/utilities/string';
import { getFoodServingTotals, getUnitShorts } from '@/utilities/string';

export default function Food({ props }: { props: FoodGet }) {
  const totalNutrients = getFoodServingTotals({
    food: props,
  });

  return (
    <Card radius={0} bg={'transparent'} padding={0} py={5}>
      <Group justify="space-between">
        <Stack gap={2}>
          <Title order={3} fz={'md'} fw={'normal'} lineClamp={1}>
            {props.description},{' '}
            <Text component="span" inherit c={'dimmed'}>
              {props.name}
            </Text>
          </Title>

          <Group fz={'sm'} c={'dimmed'}>
            <Text inherit lineClamp={1}>
              <Text component="span" inherit>
                C: <NumberFormatter value={totalNutrients.totalCarbs} />{' '}
                {getUnitShorts(props.per_unit)}
              </Text>
              ,{' '}
              <Text component="span" inherit>
                P: <NumberFormatter value={totalNutrients.totalProtein} />{' '}
                {getUnitShorts(props.per_unit)}
              </Text>
              ,{' '}
              <Text component="span" inherit>
                F: <NumberFormatter value={totalNutrients.totalFat} />{' '}
                {getUnitShorts(props.per_unit)}
              </Text>
            </Text>
          </Group>
        </Stack>

        <Stack gap={0} align="end" ta={'end'}>
          <Text inherit>
            <NumberFormatter value={props.kcal} /> Kcal
          </Text>

          <Text inherit fz={'sm'} c={'dimmed'}>
            per/{props.per} {capitalizeWords(props.per_unit)}
          </Text>
        </Stack>
      </Group>
    </Card>
  );
}
