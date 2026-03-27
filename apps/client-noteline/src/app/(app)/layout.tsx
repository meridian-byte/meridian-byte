import React from 'react';
import LayoutBody from '@repo/components/layout/body';
import AppshellAppMain from '@/components/common/appshells/app/main';
import ItemEditProvider from '@repo/components/provider/item-edit';

export default async function LayoutApp({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <LayoutBody>
      <ItemEditProvider>
        <AppshellAppMain>{children}</AppshellAppMain>
      </ItemEditProvider>
    </LayoutBody>
  );
}
