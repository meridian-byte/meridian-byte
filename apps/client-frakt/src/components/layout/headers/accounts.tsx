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
import ModalAccountCrud from '@repo/components/common/modals/account/crud';
import IndicatorNetworkStatus from '@repo/components/common/indicators/network-status';
import { useStoreSyncStatus } from '@repo/libraries/zustand/stores/sync-status';

export default function Accounts() {
  const { syncStatus } = useStoreSyncStatus();

  return (
    <LayoutSection
      id="layout-header-accounts"
      containerized={'xs'}
      padded={'xs'}
    >
      <Group justify="space-between">
        <Title order={1} fz={'md'} fw={500}>
          Accounts
        </Title>

        <Group justify="end" wrap="nowrap">
          <IndicatorNetworkStatus props={{ syncStatus }} />

          <ModalAccountCrud>
            <Group>
              <Tooltip label={'Create Account'}>
                <ActionIcon size={ICON_WRAPPER_SIZE} variant="light">
                  <IconPlus size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
                </ActionIcon>
              </Tooltip>
            </Group>
          </ModalAccountCrud>
        </Group>
      </Group>
    </LayoutSection>
  );
}
