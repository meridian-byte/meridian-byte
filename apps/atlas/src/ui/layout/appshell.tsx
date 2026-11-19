'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
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

export default function Shell({ children }: { children: React.ReactNode }) {
  const { ready, isMobile, isDesktop } = useBreakpointFlags();
  const navbarActive = useStoreAppShell((s) => s.appshell?.child?.navbar);

  const viewportRef = useRef<HTMLDivElement | null>(null);
  const contextValue = useMemo(() => viewportRef, []);

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
      header={
        isDesktop
          ? undefined
          : {
              height: SHELL_VALUES.HEADER.HEIGHT.MOBILE,
              collapsed: false,
            }
      }
      navbar={{
        width: SHELL_VALUES.NAVBAR.WIDTH,
        breakpoint: 'md',
        collapsed: { mobile: !navbarActive, desktop: !navbarActive },
      }}
      footer={{
        height: isDesktop ? SHELL_VALUES.FOOTER.HEIGHT.DESKTOP : SHELL_VALUES.FOOTER.HEIGHT.MOBILE,
      }}
    >
      {isMobile && (
        <AppShellHeader style={{ borderColor: 'var(--mantine-color-default-border)' }}>
          <LayoutHeaderMain />
        </AppShellHeader>
      )}

      <AppShellNavbar style={{ borderColor: 'var(--mantine-color-default-border)' }}>
        <LayoutNavbarMain />
      </AppShellNavbar>

      <AppShellMain>
        <ScrollContext.Provider value={contextValue}>
          <ScrollArea
            scrollbars="y"
            h={`calc(100vh - ${
              isDesktop
                ? SHELL_VALUES.FOOTER.HEIGHT.DESKTOP
                : SHELL_VALUES.HEADER.HEIGHT.MOBILE + SHELL_VALUES.FOOTER.HEIGHT.MOBILE
            }px)`}
            viewportRef={contextValue}
          >
            {children}
          </ScrollArea>
        </ScrollContext.Provider>
      </AppShellMain>

      {isDesktop && (
        <AppShellFooter
          style={{ borderColor: 'var(--mantine-color-default-border)' }}
          h={SHELL_VALUES.FOOTER.HEIGHT.DESKTOP}
        >
          <LayoutFooterMain />
        </AppShellFooter>
      )}

      {isMobile && (
        <AppShellFooter
          style={{ borderColor: 'var(--mantine-color-default-border)' }}
          h={SHELL_VALUES.FOOTER.HEIGHT.MOBILE}
        >
          <LayoutFooterMobile />
        </AppShellFooter>
      )}
    </AppShell>
  );
}
