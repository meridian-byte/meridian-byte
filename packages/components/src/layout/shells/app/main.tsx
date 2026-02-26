'use client';

import React from 'react';
import {
  AppShell,
  AppShellFooter,
  AppShellHeader,
  AppShellMain,
  AppShellNavbar,
} from '@mantine/core';
import AppshellAppChild, { PropsAppShellChild } from './child';
import { useMediaQuery } from '@mantine/hooks';
import { useStoreAppShell } from '@repo/libraries/zustand/stores/shell';

export default function Main({
  props,
  children,
}: {
  props: {
    appShell: {
      headerHeight?: number;
      navbarWidth?: number;
      footerHeight?: number;
    };
    header?: { component: React.ReactNode };
    navbar?: { component: React.ReactNode };
    footer?: { component: React.ReactNode };
    appShellChild: PropsAppShellChild;
  };
  children: React.ReactNode;
}) {
  const appShell = useStoreAppShell((s) => s.appshell);
  const mobile = useMediaQuery('(max-width: 36em)');

  return (
    <AppShell
      layout="alt"
      header={
        !props.appShell.headerHeight
          ? undefined
          : { height: mobile ? props.appShell.headerHeight : 0 }
      }
      navbar={
        !props.appShell.navbarWidth
          ? undefined
          : {
              width: props.appShell.navbarWidth,
              breakpoint: 'xs',
              collapsed: { mobile: true, desktop: false },
            }
      }
      footer={
        !props.appShell.footerHeight
          ? undefined
          : { height: props.appShell.footerHeight }
      }
      withBorder={false}
      bg={
        !appShell?.child.navbar
          ? 'var(--mantine-color-body)'
          : 'light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-8))'
      }
    >
      {props.header?.component && (
        <AppShellHeader
          display={mobile ? undefined : 'none'}
          bg={
            'light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-8))'
          }
        >
          {props.header.component}
        </AppShellHeader>
      )}

      {props.navbar?.component && (
        <AppShellNavbar
          style={{
            backgroundColor: !appShell?.child.navbar
              ? 'var(--mantine-color-body)'
              : 'light-dark(var(--mantine-color-gray-1), var(--mantine-color-dark-7))',
            borderTopRightRadius: 'var(--mantine-radius-lg)',
            borderBottomRightRadius: 'var(--mantine-radius-lg)',
            overflow: 'hidden',
          }}
        >
          {props.navbar.component}
        </AppShellNavbar>
      )}

      <AppShellMain>
        <AppshellAppChild props={props.appShellChild}>
          {children}
        </AppshellAppChild>
      </AppShellMain>

      {props.footer?.component && (
        <AppShellFooter
          bg={
            'light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-8))'
          }
        >
          {props.footer.component}
        </AppShellFooter>
      )}
    </AppShell>
  );
}
