import React from 'react';
import { Metadata } from 'next';
import PartialListingInbox from '@/components/partial/page/app/inbox';
import LayoutPage from '@repo/components/layout/page';
import LayoutSection from '@repo/components/layout/section';

export const metadata: Metadata = {
  title: 'Inbox',
};

export default function Inbox() {
  return (
    <LayoutPage>
      <LayoutSection id={'app-inbox-content'} padded containerized={'sm'}>
        <PartialListingInbox />
      </LayoutSection>
    </LayoutPage>
  );
}
