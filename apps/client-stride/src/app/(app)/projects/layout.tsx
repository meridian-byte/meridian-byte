import React from 'react';
import LayoutMain from '@repo/components/layout/main';
import { Metadata } from 'next';
import { APP_NAME } from '@repo/constants/app';

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
  return <LayoutMain>{children}</LayoutMain>;
}
