import React from 'react';
import { Metadata } from 'next';
import PartialListingAll from '@/components/partial/page/app/all';

export const metadata: Metadata = {
  title: 'All',
};

export default function All() {
  return <PartialListingAll />;
}
