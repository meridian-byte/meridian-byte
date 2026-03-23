import React from 'react';
import { Metadata } from 'next';
import PartialListingComplete from '@/components/partial/page/app/complete';

export const metadata: Metadata = {
  title: 'Completed',
};

export default function Completed() {
  return <PartialListingComplete />;
}
