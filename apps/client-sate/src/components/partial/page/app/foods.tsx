'use client';

import React from 'react';
import LayoutSection from '@repo/components/layout/section';
import { useStoreFood } from '@/libraries/zustand/stores/food';
import { Center, Divider, Loader, Stack, Text } from '@mantine/core';
import CardFood from '@/components/common/cards/food';
import { SECTION_SPACING } from '@repo/constants/sizes';
import { sortArray } from '@repo/utilities/array';
import { Order } from '@repo/types/enums';
import ModalFoodCrud from '@/components/common/modals/food/crud';

export default function Foods() {
  const { foods } = useStoreFood();

  return (
    <LayoutSection id="app-home" containerized={'xs'}>
      {foods === undefined ? (
        <Center py={SECTION_SPACING}>
          <Loader />
        </Center>
      ) : !foods?.length ? (
        <Center py={SECTION_SPACING}>
          <Text fz={'sm'} c={'dimmed'} ta={'center'}>
            No foods found.
          </Text>
        </Center>
      ) : (
        <Stack gap={0}>
          {sortArray(
            foods,
            (i) => new Date(i.created_at),
            Order.DESCENDING
          ).map((f, i) => (
            <Stack gap={0} key={f.id}>
              {i > 0 && <Divider />}

              <ModalFoodCrud props={f}>
                <CardFood props={f} />
              </ModalFoodCrud>
            </Stack>
          ))}
        </Stack>
      )}
    </LayoutSection>
  );
}
