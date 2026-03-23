import React from 'react';
import { Metadata } from 'next';
import PartialListingToday from '@/components/partial/page/app/today';

export const metadata: Metadata = {
  title: 'Today',
};

export default function Today() {
  return <PartialListingToday />;
}
