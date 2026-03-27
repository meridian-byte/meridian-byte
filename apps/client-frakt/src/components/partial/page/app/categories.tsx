'use client';

import React from 'react';
import LayoutSection from '@repo/components/layout/section';
import { Center, Divider, Loader, Stack, Text } from '@mantine/core';
import { SECTION_SPACING } from '@repo/constants/sizes';
import { useStoreCategory } from '@repo/libraries/zustand/stores/category';
import CardCategory from '@repo/components/common/cards/category';
import { sortArray } from '@repo/utilities/array';
import { Order } from '@repo/types/enums';

export default function Categories() {
  const { categories } = useStoreCategory();

  return (
    <LayoutSection id="app-home" containerized={'xs'} padded={'md'}>
      {categories === undefined ? (
        <Center py={SECTION_SPACING}>
          <Loader />
        </Center>
      ) : !categories?.length ? (
        <Center py={SECTION_SPACING}>
          <Text fz={'sm'} c={'dimmed'} ta={'center'}>
            No categories found.
          </Text>
        </Center>
      ) : (
        <Stack gap={0}>
          {sortArray(
            categories,
            (i) => new Date(i.created_at),
            Order.DESCENDING
          ).map((c, i) => (
            <Stack gap={0} key={c.id}>
              {i > 0 && <Divider />}

              <CardCategory props={c} />
            </Stack>
          ))}
        </Stack>
      )}
    </LayoutSection>
  );
}
