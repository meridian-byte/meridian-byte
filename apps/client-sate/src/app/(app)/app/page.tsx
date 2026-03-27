import React from 'react';
import { Metadata } from 'next';
import LayoutPage from '@repo/components/layout/page';
import PartialPageAppOverview from '@/components/partial/page/app/overview';

export const metadata: Metadata = { title: 'Overview' };

export default function Overview() {
  return (
    <LayoutPage>
      <PartialPageAppOverview />
    </LayoutPage>
  );
}
