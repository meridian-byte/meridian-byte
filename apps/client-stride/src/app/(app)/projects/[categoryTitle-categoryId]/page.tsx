import React from 'react';
import { typeParams } from '../layout';
import {
  extractSlugFromParam,
  extractUuidFromParam,
} from '@repo/utilities/url';
import PartialListingCategory from '@/components/partial/page/app/category';
import LayoutPage from '@repo/components/layout/page';

export default async function Category({
  params,
}: {
  params: Promise<typeParams>;
}) {
  const paramValues = (await params)['categoryTitle-categoryId'];
  const categoryId = extractUuidFromParam(paramValues);
  const categoryTitle = extractSlugFromParam(paramValues);

  return (
    <LayoutPage>
      <PartialListingCategory props={{ categoryId, categoryTitle }} />
    </LayoutPage>
  );
}
