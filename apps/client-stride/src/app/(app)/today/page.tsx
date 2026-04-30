import React from 'react';
import { Metadata } from 'next';
import PartialListingToday from '@/components/partial/page/app/today';
import LayoutPage from '@repo/components/layout/page';

export const metadata: Metadata = {
  title: 'Today',
};

export default function Today() {
  return (
    <LayoutPage>
      <PartialListingToday />
    </LayoutPage>
  );
}
