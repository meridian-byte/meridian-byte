import React from 'react';
import { Metadata } from 'next';
import PartialListingHome from '@/components/partial/page/app/home';
import LayoutSection from '@repo/components/layout/section';

export const metadata: Metadata = {
  title: 'Home',
};

export default function Home() {
  return (
    <LayoutSection id={'app-home-content'} padded containerized={'sm'}>
      <PartialListingHome />
    </LayoutSection>
  );
}
