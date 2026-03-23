import React from 'react';
import LayoutBody from '@repo/components/layout/body';
import LayoutSection from '@repo/components/layout/section';
import { Metadata } from 'next';
import { APP_NAME } from '@repo/constants/app';
import LayoutHeaderAppPage from '@/components/layout/headers/app/page';

export interface typeParams {
  'categoryTitle-categoryId': string;
}

export const metadata: Metadata = {
  title: {
    default: 'Projects',
    template: `%s - Projects - ${APP_NAME.STRIDE}`,
  },
};

export default function LayoutAppCategories({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <LayoutBody>
      <LayoutHeaderAppPage />

      <LayoutSection id={'app-children-content'} padded containerized={'sm'}>
        {children}
      </LayoutSection>
    </LayoutBody>
  );
}
