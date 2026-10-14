'use client';

import React, { useMemo, useRef } from 'react';
import {
  AppShell,
  AppShellAside,
  AppShellFooter,
  AppShellHeader,
  AppShellMain,
  AppShellNavbar,
  ScrollArea,
} from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import LayoutNavbarMain from './navbar/main';
import LayoutHeaderMain from './header/main';
import LayoutAsideMain from './aside/main';
import LayoutFooterMain from './footer/main';
import LayoutFooterMobile from './footer/mobile';
import { SHELL_VALUES } from '@atlas/constants';
import { useStoreAppShell } from '@repo/store';
import { ScrollContext } from '@repo/hooks';

export default function Shell({ children }: { children: React.ReactNode }) {
  // const mobile = useMediaQuery('(max-width: 36em)');
  const desktop = useMediaQuery('(min-width: 62em)');

  const navbarActive = useStoreAppShell((s) => s.appshell?.child?.navbar);
  const asideActive = useStoreAppShell((s) => s.appshell?.child?.aside);

  const viewportRef = useRef<HTMLDivElement | null>(null);
  const contextValue = useMemo(() => viewportRef, []);

  return (
    <AppShell
      padding={0}
      header={
        desktop
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
      aside={{
        width: SHELL_VALUES.ASIDE.WIDTH,
        breakpoint: 'md',
        collapsed: { mobile: true, desktop: !asideActive },
      }}
      footer={{
        height: desktop ? SHELL_VALUES.FOOTER.HEIGHT.DESKTOP : SHELL_VALUES.FOOTER.HEIGHT.MOBILE,
      }}
    >
      {!desktop && (
        <AppShellHeader>
          <LayoutHeaderMain />
        </AppShellHeader>
      )}

      <AppShellNavbar
        style={{ borderColor: 'var(--mantine-color-default-border)' }}
        maw={SHELL_VALUES.NAVBAR.WIDTH}
      >
        <LayoutNavbarMain />
      </AppShellNavbar>

      <AppShellMain>
        <ScrollContext.Provider value={contextValue}>
          <ScrollArea
            scrollbars={'y'}
            h={`calc(100vh - ${desktop ? SHELL_VALUES.FOOTER.HEIGHT.DESKTOP : SHELL_VALUES.HEADER.HEIGHT.MOBILE + SHELL_VALUES.FOOTER.HEIGHT.MOBILE}px)`}
            viewportRef={contextValue}
          >
            {children}
          </ScrollArea>
        </ScrollContext.Provider>
      </AppShellMain>

      <AppShellAside style={{ borderColor: 'var(--mantine-color-default-border)' }}>
        <LayoutAsideMain />
      </AppShellAside>

      {desktop ? (
        <AppShellFooter
          style={{ borderColor: 'var(--mantine-color-default-border)' }}
          h={SHELL_VALUES.FOOTER.HEIGHT.DESKTOP}
        >
          <LayoutFooterMain />
        </AppShellFooter>
      ) : (
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
