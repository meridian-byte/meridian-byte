import React from 'react';
import { Metadata } from 'next';
import PartialListingAll from '@/components/partial/page/app/all';
import LayoutPage from '@repo/components/layout/page';

export const metadata: Metadata = {
  title: 'All',
};

export default function All() {
  return (
    <LayoutPage>
      <PartialListingAll />
    </LayoutPage>
  );
}
