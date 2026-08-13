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

export default function App() {
  const syncStatus = useStoreSyncStatus((s) => s.syncStatus);

  return (
    <Group justify={'space-between'}>
      <Group
        grow
        preventGrowOverflow={false}
        gap={0}
        w={SHELL_VALUES.NAVBAR.WIDTH}
        style={{ borderRight: '1px solid var(--mantine-color-default-border)' }}
      >
        <ButtonAppshellNavbar />

        <ActionIcon size={SHELL_VALUES.FOOTER.HEIGHT} radius={0} color="gray" variant="subtle">
          <IconSettings size={SHELL_VALUES.FOOTER.HEIGHT - 8} stroke={ICON_STROKE_WIDTH} />
        </ActionIcon>

        <ButtonFullscreen />

        <IndicatorTheme />

        <IndicatorNetworkStatus props={{ syncStatus }} />

        <ActionIcon size={SHELL_VALUES.FOOTER.HEIGHT} radius={0} color="gray" variant="subtle">
          <IconBell size={SHELL_VALUES.FOOTER.HEIGHT - 8} stroke={ICON_STROKE_WIDTH} />
        </ActionIcon>
      </Group>

      <Group justify="end">
        <ButtonAppshellAside options={{ hideWhenClosed: true }} />
      </Group>
    </Group>
  );
}
