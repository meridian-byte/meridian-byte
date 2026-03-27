'use client';

import React from 'react';
import LayoutSection from '@repo/components/layout/section';
import { Center, Divider, Loader, Stack, Text } from '@mantine/core';
import { SECTION_SPACING } from '@repo/constants/sizes';
import { useStoreAccountGroup } from '@repo/libraries/zustand/stores/account-group';
import CardAccountGroup from '@repo/components/common/cards/account-group';
import { sortArray } from '@repo/utilities/array';
import { Order } from '@repo/types/enums';

export default function AccountGroups() {
  const accountGroups = useStoreAccountGroup((s) => s.accountGroups);

  return (
    <LayoutSection id="app-home" containerized={'xs'} padded={'md'}>
      {accountGroups === undefined ? (
        <Center py={SECTION_SPACING}>
          <Loader />
        </Center>
      ) : !accountGroups?.length ? (
        <Center py={SECTION_SPACING}>
          <Text fz={'sm'} c={'dimmed'} ta={'center'}>
            No account groups found.
          </Text>
        </Center>
      ) : (
        <Stack gap={0}>
          {sortArray(
            accountGroups,
            (i) => new Date(i.created_at),
            Order.DESCENDING
          ).map((ag, i) => (
            <Stack gap={0} key={ag.id}>
              {i > 0 && <Divider />}

              <CardAccountGroup props={ag} />
            </Stack>
          ))}
        </Stack>
      )}
    </LayoutSection>
  );
}
