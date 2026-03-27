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
import ModalCategoryCrud from '@/components/common/modals/category/crud';
import IndicatorNetworkStatus from '@/components/common/indicators/network-status';

export default function Categories() {
  return (
    <LayoutSection
      id="layout-header-categories"
      containerized={'xs'}
      padded={'xs'}
    >
      <Group justify="space-between">
        <Title order={1} fz={'md'} fw={500}>
          Categories
        </Title>

        <Group justify="end" wrap="nowrap">
          <IndicatorNetworkStatus />

          <ModalCategoryCrud>
            <Group>
              <Tooltip label={'Create Account'}>
                <ActionIcon size={ICON_WRAPPER_SIZE} variant="light">
                  <IconPlus size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
                </ActionIcon>
              </Tooltip>
            </Group>
          </ModalCategoryCrud>
        </Group>
      </Group>
    </LayoutSection>
  );
}
