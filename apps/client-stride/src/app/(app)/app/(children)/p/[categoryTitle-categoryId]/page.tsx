import React from 'react';
import PartialPageCategory from '@/components/partial/page/app/category';
import {
  extractSlugFromParam,
  extractUuidFromParam,
} from '@repo/utilities/url';
import { typeParams } from '../layout';

export default async function Home({
  params,
}: {
  params: Promise<typeParams>;
}) {
  const paramValues = (await params)['categoryTitle-categoryId'];
  const categoryId = extractUuidFromParam(paramValues);
  const categoryTitle = extractSlugFromParam(paramValues);

  return <PartialPageCategory props={{ categoryTitle, categoryId }} />;
}
