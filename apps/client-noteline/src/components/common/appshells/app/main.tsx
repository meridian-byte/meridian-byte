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

export default function Main({ children }: { children: React.ReactNode }) {
  return (
    <AppShell
      header={{ height: APPSHELL.HEADER_HEIGHT }}
      navbar={{
        width: APPSHELL.NAVBAR_WIDTH,
        breakpoint: 'xs',
        collapsed: { mobile: true, desktop: false },
      }}
    >
      <AppShellHeader
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
