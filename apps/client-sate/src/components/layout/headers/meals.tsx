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
import ModalMealCrud from '@/components/common/modals/meal/crud';
import IndicatorNetworkStatus from '@/components/common/indicators/network-status';

export default function Meals() {
  return (
    <LayoutSection
      id="layout-header-meals"
      containerized={'xs'}
      padded={'xs'}
      bordered
    >
      <Group justify="space-between">
        <Title order={1} fz={'md'} fw={500}>
          Meals
        </Title>

        <Group justify="end" wrap="nowrap">
          <IndicatorNetworkStatus />

          <ModalMealCrud>
            <Group>
              <Tooltip label={'Create Meal'}>
                <ActionIcon size={ICON_WRAPPER_SIZE} variant="light">
                  <IconPlus size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
                </ActionIcon>
              </Tooltip>
            </Group>
          </ModalMealCrud>
        </Group>
      </Group>
    </LayoutSection>
  );
}
