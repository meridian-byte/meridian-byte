import React from 'react';
import PartialPageNote from '@/components/partial/page/note';
import LayoutPage from '@repo/components/layout/page';
import { extractUuidFromParam } from '@repo/utilities/url';
import { typeParams } from '../layout';

export default async function Home({
  params,
}: {
  params: Promise<typeParams>;
}) {
  const noteId = extractUuidFromParam((await params)['noteTitle-noteId']);

  return (
    <LayoutPage>
      <PartialPageNote props={{ noteId }} />
    </LayoutPage>
  );
}
