'use client';

import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import {
  AppShell,
  AppShellAside,
  AppShellFooter,
  AppShellHeader,
  AppShellMain,
  AppShellNavbar,
  Center,
  ScrollArea,
  Stack,
  Text,
} from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import LayoutNavbarMain from './navbar/main';
import LayoutHeaderMain from './header/main';
import LayoutAsideMain from './aside/main';
import LayoutFooterMain from './footer/main';
import LayoutFooterMobile from './footer/mobile';
import { SHELL_VALUES } from '@atlas/constants';
import { useStoreAppShell } from '@repo/store';
import { ScrollContext, useBreakpointFlags } from '@repo/hooks';
import { SpinnerApp } from '@repo/ui';

const BORDER_STYLE = { borderColor: 'var(--mantine-color-default-border)' } as const;

const MemoLayoutHeaderMain = memo(LayoutHeaderMain);
const MemoLayoutNavbarMain = memo(LayoutNavbarMain);
const MemoLayoutFooterMain = memo(LayoutFooterMain);
const MemoLayoutFooterMobile = memo(LayoutFooterMobile);

export default function Shell({ children }: { children: React.ReactNode }) {
  const { ready, isMobile, isDesktop } = useBreakpointFlags();
  const navbarActive = useStoreAppShell((s) => s.appshell?.child?.navbar);

  const viewportRef = useRef<HTMLDivElement | null>(null);
  const contextValue = useMemo(() => viewportRef, []);

  const headerConfig = useMemo(
    () =>
      isDesktop
        ? undefined
        : {
            height: SHELL_VALUES.HEADER.HEIGHT.MOBILE,
            collapsed: false,
          },
    [isDesktop],
  );

  const navbarConfig = useMemo(
    () => ({
      width: SHELL_VALUES.NAVBAR.WIDTH,
      breakpoint: 'md',
      collapsed: { mobile: !navbarActive, desktop: !navbarActive },
    }),
    [navbarActive],
  );

  const footerConfig = useMemo(
    () => ({
      height: isDesktop ? SHELL_VALUES.FOOTER.HEIGHT.DESKTOP : SHELL_VALUES.FOOTER.HEIGHT.MOBILE,
    }),
    [isDesktop],
  );

  const scrollAreaHeight = isDesktop
    ? `calc(100vh - ${SHELL_VALUES.FOOTER.HEIGHT.DESKTOP}px)`
    : `calc(100vh - ${SHELL_VALUES.HEADER.HEIGHT.MOBILE + SHELL_VALUES.FOOTER.HEIGHT.MOBILE}px)`;

  if (!ready) {
    return (
      <Center mih="100vh">
        <SpinnerApp />
      </Center>
    );
  }

  return (
    <AppShell
      padding={0}
      header={headerConfig}
      navbar={navbarConfig}
      footer={footerConfig}
      // Optional: uncomment to eliminate desktop main-content resize reflow during toggle
      // transitionDuration={0}
    >
      {isMobile && (
        <AppShellHeader style={BORDER_STYLE}>
          <MemoLayoutHeaderMain />
        </AppShellHeader>
      )}

      <AppShellNavbar style={BORDER_STYLE}>
        <MemoLayoutNavbarMain />
      </AppShellNavbar>

      <AppShellMain>
        <ScrollContext.Provider value={contextValue}>
          <ScrollArea scrollbars="y" h={scrollAreaHeight} viewportRef={contextValue}>
            {children}
          </ScrollArea>
        </ScrollContext.Provider>
      </AppShellMain>

      {isDesktop && (
        <AppShellFooter style={BORDER_STYLE} h={SHELL_VALUES.FOOTER.HEIGHT.DESKTOP}>
          <MemoLayoutFooterMain />
        </AppShellFooter>
      )}

      {isMobile && (
        <AppShellFooter style={BORDER_STYLE} h={SHELL_VALUES.FOOTER.HEIGHT.MOBILE}>
          <MemoLayoutFooterMobile />
        </AppShellFooter>
      )}
    </AppShell>
  );
}
