import React from 'react';
import { Metadata } from 'next';
import PartialListingToday from '@/components/partial/page/app/today';
import LayoutPage from '@repo/components/layout/page';
import LayoutSection from '@repo/components/layout/section';

export const metadata: Metadata = {
  title: 'Today',
};

export default function Today() {
  return (
    <LayoutPage>
      <LayoutSection id={'app-today-content'} padded containerized={'sm'}>
        <PartialListingToday />
      </LayoutSection>
    </LayoutPage>
  );
}
