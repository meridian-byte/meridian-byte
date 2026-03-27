'use client';

import React from 'react';
import LayoutSection from '@repo/components/layout/section';
import { useStoreMeal } from '@/libraries/zustand/stores/meal';
import { Center, Divider, Loader, Stack, Text } from '@mantine/core';
import CardMeal from '@/components/common/cards/meal';
import { SECTION_SPACING } from '@repo/constants/sizes';
import { sortArray } from '@repo/utilities/array';
import { Order } from '@repo/types/enums';
import ModalMealCrud from '@/components/common/modals/meal/crud';

export default function Meals() {
  const { meals } = useStoreMeal();

  return (
    <LayoutSection id="app-home" containerized={'xs'} padded={'md'}>
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
            (i) => new Date(i.updated_at),
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
