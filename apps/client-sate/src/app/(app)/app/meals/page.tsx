import React from 'react';
import { Metadata } from 'next';
import LayoutPage from '@repo/components/layout/page';
import LayoutHeadersMeals from '@/components/layout/headers/meals';
// import PartialOverviewTransactions from '@/components/partial/overview/transactions';
import PartialPageAppMeals from '@/components/partial/page/app/meals';

export const metadata: Metadata = { title: 'Meals' };

export default function Meals() {
  return (
    <LayoutPage>
      <LayoutHeadersMeals />

      {/* <PartialOverviewTransactions /> */}

      <PartialPageAppMeals />
    </LayoutPage>
  );
}
