import React from 'react';
import { Metadata } from 'next';
import PartialListingComplete from '@/components/partial/page/app/complete';
import LayoutPage from '@repo/components/layout/page';
import LayoutSection from '@repo/components/layout/section';

export const metadata: Metadata = {
  title: 'Completed',
};

export default function Completed() {
  return (
    <LayoutPage>
      <LayoutSection id={'app-completed-content'} padded containerized={'sm'}>
        <PartialListingComplete />
      </LayoutSection>
    </LayoutPage>
  );
}
