import React from 'react';
import LayoutBody from '@repo/components/layout/body';
import { typeParams } from '../layout';
import { Metadata } from 'next';
import { NoteGet } from '@repo/types/models/note';
import { extractUuidFromParam } from '@repo/utilities/url';
import { notesGet } from '@repo/handlers/requests/database/notes';
import { createClient } from '@repo/libraries/supabase/server';
import HeaderAppNoteDetails from '@/components/layout/headers/app/note-details';

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

export default async function LayoutNote({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<typeParams>;
}) {
  const noteId = extractUuidFromParam((await params)['noteTitle-noteId']);

  return (
    <LayoutBody>
      <HeaderAppNoteDetails props={{ noteId: noteId }} />
      {children}
    </LayoutBody>
  );
}
