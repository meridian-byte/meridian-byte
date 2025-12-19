import React from 'react';
import { Metadata } from 'next';
import LayoutPage from '@repo/components/layout/page';
import LayoutHeadersDiary from '@/components/layout/headers/diary';
import PartialOverviewDiary from '@/components/partial/overview/diary';
import PartialPageAppDiary from '@/components/partial/page/app/diary';

export const metadata: Metadata = { title: 'Diary' };

export default function Diary() {
  return (
    <LayoutPage>
      <LayoutHeadersDiary />

      <PartialOverviewDiary />

      <PartialPageAppDiary />
    </LayoutPage>
  );
}
