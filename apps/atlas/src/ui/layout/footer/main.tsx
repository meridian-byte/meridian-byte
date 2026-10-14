'use client';

import React from 'react';
import { ActionIcon, AppShellSection, Divider, Group, ScrollArea } from '@mantine/core';
import { SHELL_VALUES } from '@atlas/constants';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@repo/constants';
import { IconBell, IconSettings } from '@tabler/icons-react';
import ButtonAppshellNavbar from '@atlas/ui/button/appshell/navbar';
import ButtonAppshellAside from '@atlas/ui/button/appshell/aside';
import ButtonFullscreen from '@atlas/ui/button/fullscreen';
import IndicatorTheme from '@atlas/ui/indicator/theme';
import IndicatorNetworkStatus from '@atlas/ui/indicator/network-status';
import { useStoreSyncStatus } from '@repo/store';
import { Box } from '@mantine/core';

export default function Main() {
  const syncStatus = useStoreSyncStatus((s) => s.syncStatus);

  const sharedHeight = SHELL_VALUES.FOOTER.HEIGHT.DESKTOP - 10;

  return (
    <Group justify={'space-between'}>
      <Group
        grow
        preventGrowOverflow={false}
        gap={4}
        w={SHELL_VALUES.NAVBAR.WIDTH}
        style={{ borderRight: '1px solid var(--mantine-color-default-border)' }}
        p={5}
      >
        <ButtonAppshellNavbar />

        <ActionIcon size={sharedHeight} color="gray" variant="subtle" disabled>
          <IconSettings size={sharedHeight - 8} stroke={ICON_STROKE_WIDTH} />
        </ActionIcon>

        <ButtonFullscreen />

        <IndicatorTheme />

        <IndicatorNetworkStatus props={{ syncStatus }} />

        <ActionIcon size={sharedHeight} color="gray" variant="subtle" disabled>
          <IconBell size={sharedHeight - 8} stroke={ICON_STROKE_WIDTH} />
        </ActionIcon>
      </Group>

      <Group justify="end" gap={4} p={5}>
        <ButtonAppshellAside options={{ hideWhenClosed: true }} />
      </Group>
    </Group>
  );
}
