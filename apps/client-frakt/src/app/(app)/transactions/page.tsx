import React from 'react';
import { Metadata } from 'next';
import LayoutPage from '@repo/components/layout/page';
import LayoutHeadersTransactions from '@/components/layout/headers/transactions';
import PartialOverviewTransactions from '@/components/partial/overview/transactions';
import PartialPageAppTransactions from '@/components/partial/page/app/transactions';

export const metadata: Metadata = { title: 'Transactions' };

export default function Transactions() {
  return (
    <LayoutPage>
      <LayoutHeadersTransactions />

      <PartialOverviewTransactions />

      <PartialPageAppTransactions />
    </LayoutPage>
  );
}
