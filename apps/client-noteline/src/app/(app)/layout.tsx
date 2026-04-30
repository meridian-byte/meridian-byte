import React from 'react';
import LayoutBody from '@repo/components/layout/body';
import AppShellAppMain from '@repo/components/layout/shells/app/main';
import ItemEditProvider from '@repo/components/provider/item-edit';
import { APPSHELL } from '@/data/constants';
import HeaderAppMain from '@/components/layout/headers/app/main';
import NavbarAppParentMain from '@/components/layout/navbars/app/parent/main';
import TabNavbarLeft from '@/components/common/tabs/navbar/left';
import TabNavbarRight from '@/components/common/tabs/navbar/right';
import ProviderView from '@repo/components/provider/view';

export default async function LayoutApp({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <LayoutBody>
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
                leftSection: { component: <TabNavbarLeft /> },
                // rightSection: { component: <TabNavbarRight /> },
              },
            }}
          >
            <ProviderView>{children}</ProviderView>
          </AppShellAppMain>
        </ItemEditProvider>
      </main>
    </LayoutBody>
  );
}
