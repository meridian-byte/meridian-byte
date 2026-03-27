'use client';

import React from 'react';
import LayoutSection from '@repo/components/layout/section';
import { Group, NumberFormatter, Stack, Text } from '@mantine/core';
import { useStoreAccount } from '@repo/libraries/zustand/stores/account';
import { AccountType } from '@repo/types/models/enums';

export default function Accounts() {
  const accounts = useStoreAccount((s) => s.accounts);

  const assetAccounts =
    (accounts || []).filter((acc) => acc.type === AccountType.ASSET) || [];
  const liabilityAccounts =
    (accounts || []).filter((acc) => acc.type === AccountType.LIABILITY) || [];

  const assetValue = assetAccounts.reduce(
    (sum, acc) => sum + Number(acc.balance),
    0
  );
  const liabilityValue = liabilityAccounts.reduce(
    (sum, acc) => sum + Number(acc.balance),
    0
  );

  const overview = [
    {
      value: assetValue.toFixed(2),
      label: 'Assets',
      color: 'blue',
    },
    {
      value: liabilityValue.toFixed(2),
      label: 'Liabilities',
      color: 'red',
    },
    {
      value: (assetValue - liabilityValue).toFixed(2),
      label: 'Total',
    },
  ];

  return (
    <LayoutSection
      id="partial-overview-accounts"
      containerized={'xs'}
      padded={'xs'}
      bg={
        'light-dark(var(--mantine-color-dark-4), var(--mantine-color-dark-8))'
      }
    >
      <Group justify="center" grow>
        {overview.map((oi, i) => (
          <Stack key={i} gap={0} align="center">
            <Text inherit ta={'center'} fz={'sm'} c={'dimmed'}>
              {oi.label}
            </Text>

            <Text
              component="span"
              inherit
              c={`${oi.color}.6`}
              ta={'center'}
              fw={500}
            >
              <NumberFormatter value={oi.value} decimalScale={2} />
            </Text>
          </Stack>
        ))}
      </Group>
    </LayoutSection>
  );
}
