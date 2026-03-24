import React from 'react';
import { Metadata } from 'next';
import PartialPageHome from '@/components/partial/page/home';

export const metadata: Metadata = {
  title: 'Home',
};

export default function Home() {
  return <PartialPageHome />;
}
