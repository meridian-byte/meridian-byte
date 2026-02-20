'use client';

import { Box, Group, ScrollArea } from '@mantine/core';
import React from 'react';
import { APPSHELL } from '@/data/constants';
import TabNavbarLeft from '@/components/common/tabs/navbar/left';
import TabNavbarRight from '@/components/common/tabs/navbar/right';
import { useStoreAppShell } from '@repo/libraries/zustand/stores/shell';
import { useMediaQuery } from '@mantine/hooks';

export default function Child({ children }: { children: React.ReactNode }) {
  const mobile = useMediaQuery('(max-width: 36em)');
  const appshell = useStoreAppShell((s) => s.appshell);

  const widths = {
    navbarLeft: 22.5,
    navbarRight: 22.5,
  };

  const widthPercentage = mobile
    ? 100
    : appshell?.child.navbar && appshell?.child.aside
      ? 100 - (widths.navbarLeft + widths.navbarRight)
      : appshell?.child.navbar
        ? 100 - widths.navbarLeft
        : appshell?.child.aside
          ? 100 - widths.navbarRight
          : 100;

  return (
    <Group wrap="nowrap" align="stretch" gap={0}>
      <Box
        style={{
          display: appshell?.child.navbar ? undefined : 'none',
          width: `${widths.navbarLeft}%`,
          backgroundColor:
            'light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-8))',
        }}
        visibleFrom="xs"
      >
        <ScrollArea
          h={`calc(100vh - ${mobile ? APPSHELL.HEADER_HEIGHT : 0}px)`}
          type="auto"
          scrollbars={'y'}
          scrollbarSize={APPSHELL.SCROLLBAR_WIDTH}
        >
          <TabNavbarLeft />
        </ScrollArea>
      </Box>

      <Box style={{ width: `${widthPercentage}%`, zIndex: 1 }}>
        <ScrollArea
          h={`calc(100vh - ${mobile ? APPSHELL.HEADER_HEIGHT : 0}px)`}
          type="auto"
          scrollbars={'y'}
          scrollbarSize={APPSHELL.SCROLLBAR_WIDTH}
          styles={{ thumb: { zIndex: 1 } }}
        >
          {children}
        </ScrollArea>
      </Box>

      <Box
        style={{
          display: appshell?.child.aside ? undefined : 'none',
          width: `${widths.navbarRight}%`,
          backgroundColor:
            'light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-8))',
        }}
        visibleFrom="xs"
      >
        <ScrollArea
          h={`calc(100vh - ${mobile ? APPSHELL.HEADER_HEIGHT : 0}px)`}
          type="auto"
          scrollbars={'y'}
          scrollbarSize={APPSHELL.SCROLLBAR_WIDTH}
        >
          <TabNavbarRight />
        </ScrollArea>
      </Box>
    </Group>
  );
}
