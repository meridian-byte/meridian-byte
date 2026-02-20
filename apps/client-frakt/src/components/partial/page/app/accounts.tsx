'use client';

import React from 'react';
import LayoutSection from '@repo/components/layout/section';
import { useStoreAccount } from '@repo/libraries/zustand/stores/account';
import { Center, Divider, Loader, Stack, Text } from '@mantine/core';
import CardAccount from '@repo/components/common/cards/account';
import { SECTION_SPACING } from '@repo/constants/sizes';
import { sortArray } from '@repo/utilities/array';
import { Order } from '@repo/types/enums';

export default function Accounts() {
  const accounts = useStoreAccount((s) => s.accounts);

  return (
    <LayoutSection id="app-home" containerized={'xs'} padded={'md'}>
      {accounts === undefined ? (
        <Center py={SECTION_SPACING}>
          <Loader />
        </Center>
      ) : !accounts?.length ? (
        <Center py={SECTION_SPACING}>
          <Text fz={'sm'} c={'dimmed'} ta={'center'}>
            No accounts found.
          </Text>
        </Center>
      ) : (
        <Stack gap={0}>
          {sortArray(
            accounts,
            (i) => new Date(i.created_at),
            Order.DESCENDING
          ).map((acc, i) => (
            <Stack gap={0} key={acc.id}>
              {i > 0 && <Divider />}

              <CardAccount props={acc} />
            </Stack>
          ))}
        </Stack>
      )}
    </LayoutSection>
  );
}
