'use client';

import React from 'react';
import {
  AppShell,
  AppShellFooter,
  AppShellHeader,
  AppShellMain,
  ScrollArea,
} from '@mantine/core';
import HeaderApp from '../headers/app';
import FooterApp from '../footers/app';

export default function App({ children }: { children: React.ReactNode }) {
  return (
    <AppShell header={{ height: 60 }} footer={{ height: 72 }}>
      <AppShellHeader>
        <HeaderApp />
      </AppShellHeader>

      <AppShellMain>
        <ScrollArea
          h={`calc(100vh - ${60 + 72}px)`}
          scrollbars={'y'}
          styles={{ thumb: { zIndex: 1 } }}
        >
          {children}
        </ScrollArea>
      </AppShellMain>

      <AppShellFooter>
        <FooterApp />
      </AppShellFooter>
    </AppShell>
  );
}
