import React from 'react';
import LayoutBody from '@repo/components/layout/body';
import AppShellAppMain from '@repo/components/layout/shells/app/main';
import ItemEditProvider from '@repo/components/provider/item-edit';
import { APPSHELL } from '@/data/constants';
import HeaderAppMain from '@/components/layout/headers/app/main';
import NavbarAppParentMain from '@/components/layout/navbars/app/parent/main';
import PartialTabNavbarLinks from '@/components/partial/tabs/navbar/links';
import ProviderView from '@repo/components/provider/view';

export default async function LayoutApp({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <LayoutBody>
      <ItemEditProvider>
        <AppShellAppMain
          props={{
            appShell: {
              headerHeight: APPSHELL.HEADER_HEIGHT,
              navbarWidth: APPSHELL.NAVBAR_WIDTH,
            },
            header: { component: <HeaderAppMain /> },
            navbar: { component: <NavbarAppParentMain /> },
            appShellChild: {
              appShell: { headerHeight: APPSHELL.HEADER_HEIGHT },
              leftSection: { component: <PartialTabNavbarLinks /> },
            },
          }}
        >
          <ProviderView>{children}</ProviderView>
        </AppShellAppMain>
      </ItemEditProvider>
    </LayoutBody>
  );
}
