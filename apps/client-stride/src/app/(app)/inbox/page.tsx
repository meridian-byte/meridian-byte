import React from 'react';
import { Metadata } from 'next';
import PartialListingInbox from '@/components/partial/page/app/inbox';

export const metadata: Metadata = {
  title: 'Inbox',
};

export default function Inbox() {
  return <PartialListingInbox />;
}
