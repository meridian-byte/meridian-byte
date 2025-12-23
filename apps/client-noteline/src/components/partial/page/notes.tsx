'use client';

import React, { useEffect, useState } from 'react';
import { useStoreNote } from '@/libraries/zustand/stores/note';
import { useSearchParams } from 'next/navigation';
import PartialPageHome from './home';
import PartialPageNote from './note';
import { NoteGet } from '@repo/types/models/note';

export default function Home() {
  const searchParams = useSearchParams();
  const noteId = searchParams.get('noteId');

  const { notes } = useStoreNote();

  const [activeNote, setActiveNote] = useState<NoteGet | null>(null);

  useEffect(() => {
    if (!notes) return;
    if (!noteId) return;

    const note = notes.find((n) => n.id == noteId);
    if (note) setActiveNote(note);
  }, [notes, noteId]);

  return !noteId ? (
    <PartialPageHome />
  ) : notes === undefined ? (
    <>loading</>
  ) : !activeNote ? (
    <>note not found</>
  ) : (
    <PartialPageNote props={{ note: activeNote }} />
  );
}
