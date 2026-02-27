import React from 'react';
import LayoutBody from '@repo/components/layout/body';
import { typeParams } from '../layout';
import { Metadata } from 'next';
import { NoteGet } from '@repo/types/models/note';
import { extractUuidFromParam } from '@repo/utilities/url';
import { notesGet } from '@repo/handlers/requests/database/notes';
import { createClient } from '@repo/libraries/supabase/server';

export const generateMetadata = async ({
  params,
}: {
  params: Promise<typeParams>;
}): Promise<Metadata> => {
  const supabase = await createClient();
  const { data: userSession } = await supabase.auth.getUser();

  const { items: notes }: { items: NoteGet[] } = await notesGet({
    userId: userSession.user?.id,
  });

  const noteId = extractUuidFromParam((await params)['noteTitle-noteId']);
  const note = notes.find((ni) => ni.id === noteId);

  return {
    title: note?.title || '',
  };
};

export default function LayoutNote({
  children, // will be a page or nested layout
  // params,
}: {
  children: React.ReactNode;
  params: typeParams;
}) {
  return <LayoutBody>{children}</LayoutBody>;
}
