'use client';

import React from 'react';
import {
  AppShell,
  AppShellFooter,
  AppShellHeader,
  AppShellMain,
} from '@mantine/core';
import HeaderApp from '../headers/app';
import FooterApp from '../footers/app';

export default function App({ children }: { children: React.ReactNode }) {
  return (
    <AppShell header={{ height: 60 }} footer={{ height: 72 }}>
      <AppShellHeader>
        <HeaderApp />
      </AppShellHeader>

      <AppShellMain>{children}</AppShellMain>

      <AppShellFooter>
        <FooterApp />
      </AppShellFooter>
    </AppShell>
  );
}
