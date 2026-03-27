import React from 'react';
import { Metadata } from 'next';
import PartialPageNotes from '@/components/partial/page/notes';

export const metadata: Metadata = {
  title: 'Home',
};

export default function Home() {
  return <PartialPageNotes />;
}
