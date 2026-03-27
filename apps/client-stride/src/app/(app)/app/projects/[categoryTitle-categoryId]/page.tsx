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
  const categoryId = extractUuidFromParam(
    (await params)['categoryTitle-categoryId']
  );
  const categoryTitle = extractSlugFromParam(
    (await params)['categoryTitle-categoryId']
  );

  return (
    <div>
      <PartialListingCategory props={{ categoryId, categoryTitle }} />
    </div>
  );
}
