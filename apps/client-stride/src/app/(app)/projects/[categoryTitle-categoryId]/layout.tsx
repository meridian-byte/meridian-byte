import React from 'react';
import LayoutMain from '@repo/components/layout/main';
import { Metadata } from 'next';
import { extractSlugFromParam } from '@repo/utilities/url';
import { typeParams } from '../layout';
import { capitalizeWords } from '@repo/utilities/string';

export const generateMetadata = async ({
  params,
}: {
  params: Promise<typeParams>;
}): Promise<Metadata> => {
  const categoryTitle = extractSlugFromParam(
    (await params)['categoryTitle-categoryId']
  );

  return {
    title: categoryTitle ? capitalizeWords(categoryTitle) : 'Project',
  };
};

export default function LayoutCategories({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return <LayoutMain>{children}</LayoutMain>;
}
