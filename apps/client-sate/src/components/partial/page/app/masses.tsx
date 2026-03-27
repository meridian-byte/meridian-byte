'use client';

import React from 'react';
import LayoutSection from '@repo/components/layout/section';
import { Center, Divider, Loader, Stack, Text } from '@mantine/core';
import { SECTION_SPACING } from '@repo/constants/sizes';
import { sortArray } from '@repo/utilities/array';
import { Order } from '@repo/types/enums';
import { useStoreMass } from '@repo/libraries/zustand/stores/mass';
import CardMass from '@repo/components/common/cards/mass';
import ModalMassCrud from '@repo/components/common/modals/mass/crud';

export default function Mass() {
  const masses = useStoreMass((s) => s.masses);

  return (
    <LayoutSection id="app-home" containerized={'xs'} padded={'md'}>
      {masses === undefined ? (
        <Center py={SECTION_SPACING}>
          <Loader />
        </Center>
      ) : !masses?.length ? (
        <Center py={SECTION_SPACING}>
          <Text fz={'sm'} c={'dimmed'} ta={'center'}>
            No weight entries yet.
          </Text>
        </Center>
      ) : (
        <Stack gap={0}>
          {sortArray(
            masses,
            (i) => new Date(i.created_at),
            Order.DESCENDING
          ).map((m, i) => (
            <Stack gap={0} key={m.id}>
              {i > 0 && <Divider />}

              <ModalMassCrud props={m}>
                <CardMass props={m} />
              </ModalMassCrud>
            </Stack>
          ))}
        </Stack>
      )}
    </LayoutSection>
  );
}
