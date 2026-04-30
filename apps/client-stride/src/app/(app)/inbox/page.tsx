import React from 'react';
import { Metadata } from 'next';
import PartialListingInbox from '@/components/partial/page/app/inbox';
import LayoutPage from '@repo/components/layout/page';

export const metadata: Metadata = {
  title: 'Inbox',
};

export default function Inbox() {
  return (
    <LayoutPage>
      <PartialListingInbox />
    </LayoutPage>
  );
}
