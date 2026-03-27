'use client';

import React, { useEffect, useState } from 'react';
import { useStoreNote } from '@repo/libraries/zustand/stores/note';
import { useSearchParams } from 'next/navigation';
import PartialPageHome from './home';
import PartialPageNote from './note';
import { NoteGet } from '@repo/types/models/note';
import HeaderAppNoteDetails from '@/components/layout/headers/app/note-details';

export default function Home() {
  const searchParams = useSearchParams();
  const noteId = searchParams.get('noteId');

  const notes = useStoreNote((s) => s.notes);

  const [activeNote, setActiveNote] = useState<NoteGet | undefined>(undefined);

  useEffect(() => {
    if (!notes) return;
    if (!noteId) return;

    const note = notes.find((n) => n.id == noteId);
    if (note) setActiveNote(note);
  }, [notes, noteId, searchParams]);

  return (
    <>
      <HeaderAppNoteDetails props={noteId ? activeNote : undefined} />

      {!noteId ? (
        <PartialPageHome />
      ) : notes === undefined ? (
        <>loading</>
      ) : !activeNote ? (
        <>note not found</>
      ) : (
        <PartialPageNote props={{ note: activeNote }} />
      )}
    </>
  );
}
