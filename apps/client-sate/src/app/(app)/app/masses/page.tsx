import React from 'react';
import { Metadata } from 'next';
import LayoutPage from '@repo/components/layout/page';
import LayoutHeadersMasses from '@/components/layout/headers/masses';
import PartialPageAppMasses from '@/components/partial/page/app/masses';

export const metadata: Metadata = { title: 'Weight Entries' };

export default function Masses() {
  return (
    <LayoutPage>
      <LayoutHeadersMasses />

      <PartialPageAppMasses />
    </LayoutPage>
  );
}
