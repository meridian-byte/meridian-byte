import React from 'react';
import LayoutBody from '@repo/components/layout/body';
import { typeParams } from '../layout';
import { Metadata } from 'next';
import { CategoryGet } from '@repo/types/models/category';
import { extractUuidFromParam } from '@repo/utilities/url';
import { categoriesGet } from '@repo/handlers/requests/database/categories';
import { createClient } from '@repo/libraries/supabase/server';
// import HeaderAppCategoryDetails from '@/components/layout/headers/app/category-details';

export const generateMetadata = async ({
  params,
}: {
  params: Promise<typeParams>;
}): Promise<Metadata> => {
  const supabase = await createClient();
  const { data: userSession } = await supabase.auth.getUser();

  const { items: categories }: { items: CategoryGet[] } = await categoriesGet({
    userId: userSession.user?.id,
  });

  const categoryId = extractUuidFromParam(
    (await params)['categoryTitle-categoryId']
  );
  const category = categories.find((ni) => ni.id === categoryId);

  return {
    title: category?.title || 'New Project',
  };
};

export default async function LayoutCategory({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<typeParams>;
}) {
  // const categoryId = extractUuidFromParam(
  //   (await params)['categoryTitle-categoryId']
  // );

  return (
    <LayoutBody>
      {/* <HeaderAppCategoryDetails props={{ categoryId: categoryId }} /> */}
      {children}
    </LayoutBody>
  );
}
