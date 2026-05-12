import React from 'react';
import { Metadata } from 'next';
import PartialListingUpcoming from '@/components/partial/page/app/upcoming';
import LayoutPage from '@repo/components/layout/page';
import LayoutSection from '@repo/components/layout/section';

export const metadata: Metadata = {
  title: 'Upcoming',
};

export default function Upcoming() {
  return (
    <LayoutPage>
      <LayoutSection id={'app-upcoming-content'} padded containerized={'sm'}>
        <PartialListingUpcoming />
      </LayoutSection>
    </LayoutPage>
  );
}
