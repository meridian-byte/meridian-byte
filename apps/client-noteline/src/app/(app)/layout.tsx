import React from 'react';
import LayoutBody from '@repo/components/layout/body';
import ProviderStore from '@/components/provider/store';
import ProviderSync from '@/components/provider/sync';
import AppshellAppMain from '@/components/common/appshells/app/main';
import ItemEditProvider from '@/components/provider/item-edit';

export default async function LayoutApp({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <LayoutBody>
      <main>
        <ProviderStore>
          <ProviderSync>
            <ItemEditProvider>
              <AppshellAppMain>{children}</AppshellAppMain>
            </ItemEditProvider>
          </ProviderSync>
        </ProviderStore>
      </main>
    </LayoutBody>
  );
}
