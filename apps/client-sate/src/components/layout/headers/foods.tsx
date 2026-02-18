'use client';

import React from 'react';
import LayoutSection from '@repo/components/layout/section';
import { ActionIcon, Box, Divider, Group, Title, Tooltip } from '@mantine/core';
import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
} from '@repo/constants/sizes';
import { IconPlus } from '@tabler/icons-react';
import ModalFoodCrud from '@/components/common/modals/food/crud';
import IndicatorNetworkStatus from '@repo/components/common/indicators/network-status';
import { useStoreSyncStatus } from '@repo/libraries/zustand/stores/sync-status';

export default function Foods() {
  const { syncStatus } = useStoreSyncStatus();

  return (
    <Box
      bg={'var(--mantine-color-body)'}
      pos={'sticky'}
      top={0}
      style={{ zIndex: 1 }}
    >
      <LayoutSection
        id="layout-header-foods"
        containerized={'xs'}
        padded={'xs'}
      >
        <Group justify="space-between">
          <Title order={1} fz={'md'} fw={500}>
            Foods
          </Title>

          <Group justify="end" wrap="nowrap" gap={5}>
            <IndicatorNetworkStatus props={{ syncStatus }} />

            <ModalFoodCrud>
              <Group>
                <Tooltip label={'Add Food'}>
                  <ActionIcon size={ICON_WRAPPER_SIZE} variant="light">
                    <IconPlus size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
                  </ActionIcon>
                </Tooltip>
              </Group>
            </ModalFoodCrud>
          </Group>
        </Group>
      </LayoutSection>

      <Divider />
    </Box>
  );
}
