import React from 'react';
import { Metadata } from 'next';
import PartialListingUpcoming from '@/components/partial/page/app/upcoming';
import LayoutPage from '@repo/components/layout/page';

export const metadata: Metadata = {
  title: 'Upcoming',
};

export default function Upcoming() {
  return (
    <LayoutPage>
      <PartialListingUpcoming />
    </LayoutPage>
  );
}
