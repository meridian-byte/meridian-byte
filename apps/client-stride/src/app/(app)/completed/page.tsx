import React from 'react';
import { Metadata } from 'next';
import PartialListingComplete from '@/components/partial/page/app/complete';
import LayoutPage from '@repo/components/layout/page';

export const metadata: Metadata = {
  title: 'Completed',
};

export default function Completed() {
  return (
    <LayoutPage>
      <PartialListingComplete />
    </LayoutPage>
  );
}
