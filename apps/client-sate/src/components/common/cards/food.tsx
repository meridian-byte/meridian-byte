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
                <Text component="span" inherit c={'blue.6'}>
                  <NumberFormatter value={totalNutrients.totalCarbs} />
                </Text>{' '}
                {getUnitShorts(props.per_unit)}
              </Text>
              ,{' '}
              <Text component="span" inherit>
                <Text component="span" inherit c={'green.6'}>
                  <NumberFormatter value={totalNutrients.totalProtein} />
                </Text>{' '}
                {getUnitShorts(props.per_unit)}
              </Text>
              ,{' '}
              <Text component="span" inherit>
                <Text component="span" inherit c={'yellow.6'}>
                  <NumberFormatter value={totalNutrients.totalFat} />
                </Text>{' '}
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
