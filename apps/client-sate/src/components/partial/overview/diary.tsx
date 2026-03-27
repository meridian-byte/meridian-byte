'use client';

import React from 'react';
import LayoutSection from '@repo/components/layout/section';
import { Group, NumberFormatter, Progress, Stack, Text } from '@mantine/core';
import { useEatTotals } from '@/hooks/nutrients';
import { ICON_STROKE_WIDTH } from '@repo/constants/sizes';
import { useStoreEat } from '@/libraries/zustand/stores/eat';

export default function Diary() {
  const { eats } = useStoreEat();
  const { totalEatenNutrients } = useEatTotals({ eats: eats || [] });

  const overview = [
    {
      value: totalEatenNutrients.totalCarbs,
      label: 'Carbs',
      color: 'blue',
    },
    {
      value: totalEatenNutrients.totalProtein,
      label: 'Protein',
      color: 'green',
    },
    {
      value: totalEatenNutrients.totalFat,
      label: 'Fat',
      color: 'yellow',
    },
    {
      value: totalEatenNutrients.totalKcal,
      label: 'Calories',
      color: 'red',
    },
  ];

  return (
    <LayoutSection
      id="partial-overview-servings"
      containerized={'xs'}
      padded={'xs'}
      bg={
        'light-dark(var(--mantine-color-dark-4), var(--mantine-color-dark-8))'
      }
    >
      <Group justify="center" grow>
        {overview.map((oi, i) => (
          <Stack key={i} gap={0} align="center">
            <Text
              component="span"
              inherit
              c={`${oi.color}.6`}
              ta={'center'}
              fw={500}
            >
              <NumberFormatter value={oi.value} decimalScale={2} />
            </Text>

            <Text inherit ta={'center'} fz={'sm'} c={'dimmed'}>
              {oi.label}
            </Text>

            <Group justify="center" w={64} mt={5}>
              <Progress
                value={100}
                color={oi.color}
                size={ICON_STROKE_WIDTH}
                w={'100%'}
              />
            </Group>
          </Stack>
        ))}
      </Group>
    </LayoutSection>
  );
}
