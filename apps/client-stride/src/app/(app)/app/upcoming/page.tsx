import React from 'react';
import { Metadata } from 'next';
import PartialListingUpcoming from '@/components/partial/page/app/upcoming';

export const metadata: Metadata = {
  title: 'Upcoming',
};

export default function Upcoming() {
  return <PartialListingUpcoming />;
}
