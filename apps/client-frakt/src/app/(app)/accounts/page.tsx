import React from 'react';
import { Metadata } from 'next';
import LayoutPage from '@repo/components/layout/page';
import LayoutHeadersAccounts from '@/components/layout/headers/accounts';
import PartialOverviewAccounts from '@/components/partial/overview/accounts';
import PartialPageAppAccounts from '@/components/partial/page/app/accounts';

export const metadata: Metadata = { title: 'Accounts' };

export default function Accounts() {
  return (
    <LayoutPage>
      <LayoutHeadersAccounts />

      <PartialOverviewAccounts />

      <PartialPageAppAccounts />
    </LayoutPage>
  );
}
