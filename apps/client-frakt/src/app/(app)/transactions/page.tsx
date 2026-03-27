import React from 'react';
import { Metadata } from 'next';
import LayoutPage from '@repo/components/layout/page';
import PartialPageAppTransactions from '@/components/partial/page/app/transactions';

export const metadata: Metadata = { title: 'Transactions' };

export default function Transactions() {
  return (
    <LayoutPage>
      <PartialPageAppTransactions />
    </LayoutPage>
  );
}
