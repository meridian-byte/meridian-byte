'use client';

import React from 'react';
import { ActionIcon, Group } from '@mantine/core';
import ButtonAppshellNavbar from '@atlas/ui/button/appshell/navbar';
import ButtonFullscreen from '@atlas/ui/button/fullscreen';
import IndicatorTheme from '@atlas/ui/indicator/theme';
import IndicatorNetworkStatus from '@atlas/ui/indicator/network-status';
import { useStoreSyncStatus } from '@repo/store';
import { ICON_SIZE, ICON_STROKE_WIDTH, ICON_WRAPPER_SIZE } from '@repo/constants';
import { IconBell, IconSettings } from '@tabler/icons-react';

export default function Main() {
  const syncStatus = useStoreSyncStatus((s) => s.syncStatus);

  return (
    <Group h={'100%'} px={'xs'} justify="space-between">
      <Group>
        <ButtonAppshellNavbar />
      </Group>

      <Group justify="end" gap={0}>
        <IndicatorNetworkStatus props={{ syncStatus }} />

        <ActionIcon size={ICON_WRAPPER_SIZE} color="gray" variant="subtle" disabled>
          <IconBell size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
        </ActionIcon>

        <IndicatorTheme />

        <ActionIcon size={ICON_WRAPPER_SIZE} color="gray" variant="subtle" disabled>
          <IconSettings size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
        </ActionIcon>

        <ButtonFullscreen />
      </Group>
    </Group>
  );
}
