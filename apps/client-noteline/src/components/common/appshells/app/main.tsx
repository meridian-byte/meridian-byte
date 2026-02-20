'use client';

import React from 'react';
import {
  AppShell,
  AppShellHeader,
  AppShellMain,
  AppShellNavbar,
  AppShellSection,
} from '@mantine/core';
import { APPSHELL } from '@/data/constants';
import NavbarAppFooterParent from '@/components/layout/navbars/app/footer/parent';
import NavbarAppMainParent from '@/components/layout/navbars/app/main/parent';
import AppshellAppChild from './child';
import HeaderAppMain from '@/components/layout/headers/app/main';
import { useMediaQuery } from '@mantine/hooks';

export default function Main({ children }: { children: React.ReactNode }) {
  const mobile = useMediaQuery('(max-width: 36em)');

  return (
    <AppShell
      layout="alt"
      header={{ height: mobile ? APPSHELL.HEADER_HEIGHT : 0 }}
      navbar={{
        width: APPSHELL.NAVBAR_WIDTH,
        breakpoint: 'xs',
        collapsed: { mobile: true, desktop: false },
      }}
    >
      <AppShellHeader
        display={mobile ? undefined : 'none'}
        bg={
          'light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-8))'
        }
      >
        <HeaderAppMain />
      </AppShellHeader>

      <AppShellNavbar
        bg={
          'light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-8))'
        }
      >
        <AppShellSection id="navbar-main" grow>
          <NavbarAppMainParent />
        </AppShellSection>

        <AppShellSection id="navbar-footer">
          <NavbarAppFooterParent />
        </AppShellSection>
      </AppShellNavbar>

      <AppShellMain>
        <AppshellAppChild>{children}</AppshellAppChild>
      </AppShellMain>
    </AppShell>
  );
}
