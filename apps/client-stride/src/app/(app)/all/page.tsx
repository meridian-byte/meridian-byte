import React from 'react';
import { Metadata } from 'next';
import PartialListingAll from '@/components/partial/page/app/all';
import LayoutPage from '@repo/components/layout/page';
import LayoutSection from '@repo/components/layout/section';

export const metadata: Metadata = {
  title: 'All',
};

export default function All() {
  return (
    <LayoutPage>
      <LayoutSection id={'app-all-content'} padded containerized={'sm'}>
        <PartialListingAll />
      </LayoutSection>
    </LayoutPage>
  );
}
