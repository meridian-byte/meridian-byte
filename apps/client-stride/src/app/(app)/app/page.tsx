import React from 'react';
import { Metadata } from 'next';
import PartialListingHome from '@/components/partial/page/app/home';

export const metadata: Metadata = {
  title: 'Home',
};

export default function Home() {
  return <PartialListingHome />;
}
