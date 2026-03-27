'use client';

import React from 'react';
import LayoutSection from '@repo/components/layout/section';
import { useStoreTransaction } from '@/libraries/zustand/stores/transaction';
import { Center, Divider, Loader, Stack, Text } from '@mantine/core';
import CardTransaction from '@/components/common/cards/transaction';
import { SECTION_SPACING } from '@repo/constants/sizes';
import { sortArray } from '@repo/utilities/array';
import { Order } from '@repo/types/enums';

export default function Transactions() {
  const { transactions } = useStoreTransaction();

  return (
    <LayoutSection id="app-home" containerized={'xs'} padded={'md'}>
      {transactions === undefined ? (
        <Center py={SECTION_SPACING}>
          <Loader />
        </Center>
      ) : !transactions?.length ? (
        <Center py={SECTION_SPACING}>
          <Text fz={'sm'} c={'dimmed'} ta={'center'}>
            No transactions found.
          </Text>
        </Center>
      ) : (
        <Stack gap={0}>
          {sortArray(
            transactions,
            (i) => new Date(i.updated_at),
            Order.DESCENDING
          ).map((acc, i) => (
            <Stack gap={5} key={acc.id}>
              {i > 0 && <Divider mt={5} />}

              <CardTransaction props={acc} />
            </Stack>
          ))}
        </Stack>
      )}
    </LayoutSection>
  );
}
