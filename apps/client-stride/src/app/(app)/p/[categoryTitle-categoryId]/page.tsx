import React from 'react';
import PartialPageCategory from '@/components/partial/page/app/category';
import {
  extractSlugFromParam,
  extractUuidFromParam,
} from '@repo/utilities/url';
import { typeParams } from '../layout';
import LayoutPage from '@repo/components/layout/page';
import LayoutSection from '@repo/components/layout/section';

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
      <LayoutSection id={'app-project-content'} padded containerized={'sm'}>
        <PartialPageCategory props={{ categoryTitle, categoryId }} />
      </LayoutSection>
    </LayoutPage>
  );
}
