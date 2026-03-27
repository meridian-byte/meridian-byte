'use client';

import { Box, Group, ScrollArea } from '@mantine/core';
import React, { useMemo, useRef } from 'react';
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
  // Memoize the context value to prevent sub-tree thrashing
  const contextValue = useMemo(() => viewportRef, []);

  const mobile = useMediaQuery('(max-width: 36em)');
  const desktop = useMediaQuery('(min-width: 62em)');
  const desktopLg = useMediaQuery('(min-width: 75em)');
  const navbarActive = useStoreAppShell((s) => s.appshell?.child?.navbar);
  const asideActive = useStoreAppShell((s) => s.appshell?.child?.aside);

  const widths = {
    navbarLeft: desktopLg ? 22.5 : desktop ? 30 : 22.5,
    navbarRight: desktopLg ? 22.5 : desktop ? 30 : 22.5,
  };

  const MemoizedChildren = useMemo(() => children, [children]);
  // ... inside return
  {
    MemoizedChildren;
  }

  return (
    <Group
      wrap="nowrap"
      align="stretch"
      gap={0}
      bg={'var(--mantine-color-body)'}
    >
      <Box
        style={{
          display: navbarActive ? 'block' : 'none',
          flex: `0 0 ${widths.navbarLeft}%`, // Fixed basis
          backgroundColor:
            'light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-8))',
          borderTopRightRadius: 'var(--mantine-radius-lg)',
          borderBottomRightRadius: 'var(--mantine-radius-lg)',
          overflow: 'hidden',
        }}
        visibleFrom="md"
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

      <Box
        style={{
          flex: 1, // Take up all remaining space
          minWidth: 0, // Crucial for flex children with overflow
          zIndex: 1,
        }}
      >
        <ScrollContext.Provider value={contextValue}>
          <ScrollArea
            viewportRef={contextValue}
            h={`calc(100vh - ${(props.appShell.footerHeight || 0) + (mobile ? props.appShell.headerHeight || 0 : 0)}px)`}
            type="auto"
            scrollbars={'y'}
            scrollbarSize={ICON_STROKE_WIDTH * 3}
            styles={{ thumb: { zIndex: 1 } }}
          >
            {MemoizedChildren}
          </ScrollArea>
        </ScrollContext.Provider>
      </Box>

      <Box
        style={{
          display: asideActive ? 'block' : 'none',
          flex: `0 0 ${widths.navbarRight}%`,
          backgroundColor:
            'light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-8))',
        }}
        visibleFrom="md"
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
