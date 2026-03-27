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
import ModalEatCrud from '@/components/common/modals/eat/crud';
import IndicatorNetworkStatus from '@/components/common/indicators/network-status';

export default function Diary() {
  return (
    <LayoutSection id="layout-header-diarys" containerized={'xs'} padded={'xs'}>
      <Group justify="space-between">
        <Title order={1} fz={'md'} fw={500}>
          Diary
        </Title>

        <Group justify="end" wrap="nowrap">
          <IndicatorNetworkStatus />

          <ModalEatCrud>
            <Group>
              <Tooltip label={'Add Entry'}>
                <ActionIcon size={ICON_WRAPPER_SIZE} variant="light">
                  <IconPlus size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
                </ActionIcon>
              </Tooltip>
            </Group>
          </ModalEatCrud>
        </Group>
      </Group>
    </LayoutSection>
  );
}
