'use client';

import { Box, Group, ScrollArea } from '@mantine/core';
import React, { useRef } from 'react';
import { useStoreAppShell } from '@repo/libraries/zustand/stores/shell';
import { useMediaQuery } from '@mantine/hooks';
import { ScrollContext } from '@repo/hooks/contexts/scroll';
import { ICON_STROKE_WIDTH } from '@repo/constants/sizes';

export type PropsAppShellChild = {
  appShell: {
    headerHeight?: number;
    footerHeight?: number;
  };
  leftSection?: { component: React.ReactNode };
  rightSection?: { component: React.ReactNode };
};

export default function Child({
  props,
  children,
}: {
  props: PropsAppShellChild;
  children: React.ReactNode;
}) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
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
    <Group
      wrap="nowrap"
      align="stretch"
      gap={0}
      bg={'var(--mantine-color-body)'}
    >
      <Box
        style={{
          display: appshell?.child.navbar ? undefined : 'none',
          width: `${widths.navbarLeft}%`,
          backgroundColor:
            'light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-8))',
          borderTopRightRadius: 'var(--mantine-radius-lg)',
          borderBottomRightRadius: 'var(--mantine-radius-lg)',
          overflow: 'hidden',
        }}
        visibleFrom="xs"
      >
        <ScrollArea
          h={`calc(100vh - ${(props.appShell.footerHeight || 0) + (mobile ? props.appShell.headerHeight || 0 : 0)}px)`}
          type="auto"
          scrollbars={'y'}
          scrollbarSize={ICON_STROKE_WIDTH * 3}
        >
          {props.leftSection?.component}
        </ScrollArea>
      </Box>

      <Box style={{ width: `${widthPercentage}%`, zIndex: 1 }}>
        <ScrollContext.Provider value={viewportRef}>
          <ScrollArea
            viewportRef={viewportRef}
            h={`calc(100vh - ${(props.appShell.footerHeight || 0) + (mobile ? props.appShell.headerHeight || 0 : 0)}px)`}
            type="auto"
            scrollbars={'y'}
            scrollbarSize={ICON_STROKE_WIDTH * 3}
            styles={{ thumb: { zIndex: 1 } }}
          >
            {children}
          </ScrollArea>
        </ScrollContext.Provider>
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
          h={`calc(100vh - ${(props.appShell.footerHeight || 0) + (mobile ? props.appShell.headerHeight || 0 : 0)}px)`}
          type="auto"
          scrollbars={'y'}
          scrollbarSize={ICON_STROKE_WIDTH * 3}
        >
          {props.rightSection?.component}
        </ScrollArea>
      </Box>
    </Group>
  );
}
