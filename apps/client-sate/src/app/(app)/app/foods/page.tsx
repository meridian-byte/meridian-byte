import React from 'react';
import { Metadata } from 'next';
import LayoutPage from '@repo/components/layout/page';
import LayoutHeadersFoods from '@/components/layout/headers/foods';
// import PartialOverviewTransactions from '@/components/partial/overview/transactions';
import PartialPageAppFoods from '@/components/partial/page/app/foods';

export const metadata: Metadata = { title: 'Foods' };

export default function Foods() {
  return (
    <LayoutPage>
      <LayoutHeadersFoods />

      {/* <PartialOverviewTransactions /> */}

      <PartialPageAppFoods />
    </LayoutPage>
  );
}
