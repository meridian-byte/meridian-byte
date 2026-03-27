'use client';

import React from 'react';
import LayoutSection from '@repo/components/layout/section';
import { useStoreServing } from '@/libraries/zustand/stores/serving';
import { Center, Divider, Loader, Stack, Text } from '@mantine/core';
import CardServing from '@/components/common/cards/serving';
import { SECTION_SPACING } from '@repo/constants/sizes';
import { sortArray } from '@repo/utilities/array';
import { Order } from '@repo/types/enums';
import ModalServingCrud from '@/components/common/modals/serving/crud';

export default function Diary() {
  const { servings } = useStoreServing();
  const eatenServings = servings?.filter((s) => s.eat_id);

  return (
    <LayoutSection id="app-home" containerized={'xs'} padded={'md'}>
      {servings === undefined ? (
        <Center py={SECTION_SPACING}>
          <Loader />
        </Center>
      ) : !eatenServings?.length ? (
        <Center py={SECTION_SPACING}>
          <Text fz={'sm'} c={'dimmed'} ta={'center'}>
            Nothing eaten yet.
          </Text>
        </Center>
      ) : (
        <Stack gap={0}>
          {sortArray(
            eatenServings,
            (i) => new Date(i.updated_at),
            Order.DESCENDING
          ).map((s, i) => (
            <Stack gap={0} key={s.id}>
              {i > 0 && <Divider />}

              <ModalServingCrud props={s}>
                <CardServing props={s} />
              </ModalServingCrud>
            </Stack>
          ))}
        </Stack>
      )}
    </LayoutSection>
  );
}
