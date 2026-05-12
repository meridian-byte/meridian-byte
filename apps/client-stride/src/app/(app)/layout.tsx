import React from 'react';
import LayoutMain from '@repo/components/layout/main';
import AppShellAppMain from '@repo/components/layout/shells/app/main';
import ItemEditProvider from '@repo/components/provider/item-edit';
import { APPSHELL } from '@/data/constants';
import HeaderAppMain from '@/components/layout/headers/app/main';
import NavbarAppParentMain from '@/components/layout/navbars/app/parent/main';
import PartialTabNavbarLeft from '@/components/partial/tabs/navbar/left';
import ProviderView from '@repo/components/provider/view';

export default async function LayoutApp({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <LayoutMain>
      <main>
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
                leftSection: { component: <PartialTabNavbarLeft /> },
              },
            }}
          >
            <ProviderView>{children}</ProviderView>
          </AppShellAppMain>
        </ItemEditProvider>
      </main>
    </LayoutMain>
  );
}
