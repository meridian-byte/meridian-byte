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
import ModalMassCrud from '@/components/common/modals/mass/crud';
import IndicatorNetworkStatus from '@repo/components/common/indicators/network-status';
import { useStoreSyncStatus } from '@/libraries/zustand/stores/sync-status';

export default function Masses() {
  const { syncStatus } = useStoreSyncStatus();

  return (
    <LayoutSection
      id="layout-header-masses"
      containerized={'xs'}
      padded={'xs'}
      bordered
    >
      <Group justify="space-between">
        <Title order={1} fz={'md'} fw={500}>
          Weight Entries
        </Title>

        <Group justify="end" wrap="nowrap" gap={5}>
          <IndicatorNetworkStatus props={{ syncStatus }} />

          <ModalMassCrud>
            <Group>
              <Tooltip label={'Add Weight Entry'}>
                <ActionIcon size={ICON_WRAPPER_SIZE} variant="light">
                  <IconPlus size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
                </ActionIcon>
              </Tooltip>
            </Group>
          </ModalMassCrud>
        </Group>
      </Group>
    </LayoutSection>
  );
}
