import React from 'react';
import { typeParams } from '../layout';
import {
  extractSlugFromParam,
  extractUuidFromParam,
} from '@repo/utilities/url';
import PartialListingCategory from '@/components/partial/page/app/category';

export default async function Category({
  params,
}: {
  params: Promise<typeParams>;
}) {
  const paramValues = (await params)['categoryTitle-categoryId'];
  const categoryId = extractUuidFromParam(paramValues);
  const categoryTitle = extractSlugFromParam(paramValues);

  return (
    <div>
      <PartialListingCategory props={{ categoryId, categoryTitle }} />
    </div>
  );
}
