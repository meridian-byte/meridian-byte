import React from 'react';
import PartialPageCategory from '@/components/partial/page/app/category';
import {
  extractSlugFromParam,
  extractUuidFromParam,
} from '@repo/utilities/url';
import { typeParams } from '../layout';
import LayoutPage from '@repo/components/layout/page';

export default async function Home({
  params,
}: {
  params: Promise<typeParams>;
}) {
  const paramValues = (await params)['categoryTitle-categoryId'];
  const categoryId = extractUuidFromParam(paramValues);
  const categoryTitle = extractSlugFromParam(paramValues);

  return (
    <LayoutPage>
      <PartialPageCategory props={{ categoryTitle, categoryId }} />
    </LayoutPage>
  );
}
