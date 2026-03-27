'use client';

import { Box, Group, ScrollArea, Transition } from '@mantine/core';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useStoreAppShell } from '@repo/libraries/zustand/stores/shell';
import {
  useDebouncedValue,
  useElementSize,
  useMediaQuery,
} from '@mantine/hooks';
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
  const { ref: refNavbar, width: widthNavbar } = useElementSize();
  const [debouncedWidthNavbar] = useDebouncedValue(widthNavbar, 250);
  const { ref: refAside, width: widthAside } = useElementSize();
  const [debouncedWidthAside] = useDebouncedValue(widthAside, 250);
  const [absoluteWidths, setAbsoluteWidths] = useState({ navbar: 0, aside: 0 });

  const viewportRef = useRef<HTMLDivElement | null>(null);
  // Memoize the context value to prevent sub-tree thrashing
  const contextValue = useMemo(() => viewportRef, []);

  const mobile = useMediaQuery('(max-width: 36em)');
  const desktop = useMediaQuery('(min-width: 62em)');
  const desktopLg = useMediaQuery('(min-width: 75em)');
  const desktopXl = useMediaQuery('(min-width: 88em)');
  const navbarActive = useStoreAppShell((s) => s.appshell?.child?.navbar);
  const asideActive = useStoreAppShell((s) => s.appshell?.child?.aside);

  const widths = {
    navbarLeft: desktopXl ? 22.5 : desktopLg ? 25 : desktop ? 30 : 22.5,
    navbarRight: desktopXl ? 22.5 : desktopLg ? 25 : desktop ? 30 : 22.5,
  };

  const MemoizedChildren = useMemo(() => children, [children]);
  // ... inside return
  {
    MemoizedChildren;
  }

  useEffect(() => {
    setAbsoluteWidths((prev) => {
      const newNavbarWidth =
        widthNavbar < prev.navbar ? prev.navbar : debouncedWidthNavbar;
      const newAsideWidth =
        widthAside < prev.aside ? prev.aside : debouncedWidthAside;

      return { navbar: newNavbarWidth, aside: newAsideWidth };
    });
  }, [debouncedWidthNavbar]);

  return (
    <Group
      wrap="nowrap"
      align="stretch"
      gap={0}
      bg={'var(--mantine-color-body)'}
    >
      {/* LEFT SECTION */}
      <Box
        visibleFrom="md"
        style={{
          flex: `0 0 ${navbarActive ? widths.navbarLeft : 0}%`,
          transition: `all .1s ease`,
          overflow: 'hidden',
          backgroundColor:
            'light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-8))',
          borderTopRightRadius: 'var(--mantine-radius-lg)',
          borderBottomRightRadius: 'var(--mantine-radius-lg)',
        }}
      >
        <ScrollArea
          h={`calc(100vh - ${(props.appShell.footerHeight || 0) + (mobile ? props.appShell.headerHeight || 0 : 0)}px)`}
          scrollbars={'y'}
          ref={refNavbar}
        >
          <div style={{ minWidth: absoluteWidths.navbar, overflow: 'hidden' }}>
            {props.leftSection?.component}
          </div>
        </ScrollArea>
      </Box>

      {/* MAIN CONTENT */}
      <Box
        style={{
          flex: 1,
          minWidth: 0,
          zIndex: 1,
        }}
      >
        <ScrollContext.Provider value={contextValue}>
          <ScrollArea
            viewportRef={contextValue}
            h={`calc(100vh - ${(props.appShell.footerHeight || 0) + (mobile ? props.appShell.headerHeight || 0 : 0)}px)`}
            scrollbars={'y'}
          >
            {MemoizedChildren}
          </ScrollArea>
        </ScrollContext.Provider>
      </Box>

      {/* RIGHT SECTION */}
      <Box
        visibleFrom="md"
        style={{
          flex: `0 0 ${asideActive ? widths.navbarRight : 0}%`,
          transition: `all .1s ease`,
          overflow: 'hidden',
          backgroundColor:
            'light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-8))',
        }}
      >
        <ScrollArea
          h={`calc(100vh - ${(props.appShell.footerHeight || 0) + (mobile ? props.appShell.headerHeight || 0 : 0)}px)`}
          scrollbars={'y'}
          ref={refAside}
        >
          <div style={{ minWidth: absoluteWidths.aside, overflow: 'hidden' }}>
            {props.rightSection?.component}
          </div>
        </ScrollArea>
      </Box>
    </Group>
  );
}
