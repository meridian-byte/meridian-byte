import React from 'react';
import { Metadata } from 'next';
import LayoutPage from '@repo/components/layout/page';

export const metadata: Metadata = { title: 'Overview' };

export default function Overview() {
  return (
    <LayoutPage>
      <div>Overview</div>
    </LayoutPage>
  );
}
