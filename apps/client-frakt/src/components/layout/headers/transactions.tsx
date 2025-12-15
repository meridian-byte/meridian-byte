'use client';

import React from 'react';
import LayoutSection from '@repo/components/layout/section';
import { ActionIcon, Group, Title, Tooltip } from '@mantine/core';
import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
} from '@repo/constants/sizes';
import { IconPlus } from '@tabler/icons-react';
import ModalTransactionCrud from '@/components/common/modals/transaction/crud';
import IndicatorNetworkStatus from '@/components/common/indicators/network-status';

export default function Transactions() {
  return (
    <LayoutSection
      id="layout-header-transactions"
      containerized={'xs'}
      padded={'xs'}
    >
      <Group justify="space-between">
        <Title order={1} fz={'md'} fw={500}>
          Transactions
        </Title>

        <Group justify="end" wrap="nowrap">
          <IndicatorNetworkStatus />

          <ModalTransactionCrud>
            <Group>
              <Tooltip label={'Create Transaction'}>
                <ActionIcon size={ICON_WRAPPER_SIZE} variant="light">
                  <IconPlus size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
                </ActionIcon>
              </Tooltip>
            </Group>
          </ModalTransactionCrud>
        </Group>
      </Group>
    </LayoutSection>
  );
}
