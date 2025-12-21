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
import ModalAccountGroupCrud from '@/components/common/modals/account-group/crud';
import IndicatorNetworkStatus from '@repo/components/common/indicators/network-status';
import { useStoreSyncStatus } from '@/libraries/zustand/stores/sync-status';

export default function AccountGroups() {
  const { syncStatus } = useStoreSyncStatus();

  return (
    <LayoutSection
      id="layout-header-account-groups"
      containerized={'xs'}
      padded={'xs'}
    >
      <Group justify="space-between">
        <Title order={1} fz={'md'} fw={500}>
          Account Groups
        </Title>

        <Group justify="end" wrap="nowrap">
          <IndicatorNetworkStatus props={{ syncStatus }} />

          <ModalAccountGroupCrud>
            <Group>
              <Tooltip label={'Create Account'}>
                <ActionIcon size={ICON_WRAPPER_SIZE} variant="light">
                  <IconPlus size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
                </ActionIcon>
              </Tooltip>
            </Group>
          </ModalAccountGroupCrud>
        </Group>
      </Group>
    </LayoutSection>
  );
}
