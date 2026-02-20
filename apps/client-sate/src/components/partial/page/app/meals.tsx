'use client';

import React from 'react';
import LayoutSection from '@repo/components/layout/section';
import { useStoreMeal } from '@repo/libraries/zustand/stores/meal';
import { Center, Divider, Loader, Stack, Text } from '@mantine/core';
import { SECTION_SPACING } from '@repo/constants/sizes';
import { sortArray } from '@repo/utilities/array';
import { Order } from '@repo/types/enums';
import CardMeal from '@repo/components/common/cards/meal';
import ModalMealCrud from '@repo/components/common/modals/meal/crud';

export default function Meals() {
  const meals = useStoreMeal((s) => s.meals);

  return (
    <LayoutSection id="app-home" containerized={'xs'}>
      {meals === undefined ? (
        <Center py={SECTION_SPACING}>
          <Loader />
        </Center>
      ) : !meals?.length ? (
        <Center py={SECTION_SPACING}>
          <Text fz={'sm'} c={'dimmed'} ta={'center'}>
            No meals found.
          </Text>
        </Center>
      ) : (
        <Stack gap={0}>
          {sortArray(
            meals,
            (i) => new Date(i.created_at),
            Order.DESCENDING
          ).map((m, i) => (
            <Stack gap={0} key={m.id}>
              {i > 0 && <Divider />}

              <ModalMealCrud props={m}>
                <CardMeal props={m} />
              </ModalMealCrud>
            </Stack>
          ))}
        </Stack>
      )}
    </LayoutSection>
  );
}
