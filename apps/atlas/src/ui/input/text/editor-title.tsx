'use client';

import { useField } from '@mantine/form';
import React, { useEffect, useRef } from 'react';
import { TextInput } from '@mantine/core';
import { NoteGet } from '@repo/types';
import classes from './editor-title.module.css';
import { useNoteActions } from '@repo/store';
import { useStoreNote } from '@repo/store';
import { LayoutSection } from '@repo/ui';

export default function EditorTitle({ noteId }: { noteId: string }) {
  const notes = useStoreNote((s) => s.notes);
  const note = notes?.find((ni) => ni.id == noteId);
  const { noteUpdate } = useNoteActions();

  const field = useField({
    initialValue: note?.title || '',
    validate: (value) => (value.trim().length < 1 ? true : null),
  });

  const handleBlur = () => {
    const value = field.getValue().trim();

    if (value.length < 1) {
      field.reset();
    } else {
      if (value != note?.title) {
        if (note) noteUpdate({ ...note, title: value });
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      field.reset();
      e.currentTarget.blur(); // also closes focus if you want
    }

    if (e.key === 'Enter') {
      // e.currentTarget.blur(); // triggers onBlur as well

      e.preventDefault();
      const el = document.querySelector<HTMLInputElement>('.ProseMirror');
      el?.focus();
    }
  };

  useEffect(() => {
    if (!notes) return;
    if (!note) return;

    field.setValue(note.title);
  }, [notes, note]);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (note?.title.trim()) return;

    // Focus the input once the component has mounted
    inputRef.current?.focus();
  }, []); // empty dependency array ensures it runs once after mount

  return (
    <LayoutSection id={`note-details`} containerized={'md'}>
      <TextInput
        {...field.getInputProps()}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        classNames={classes}
        placeholder="Title"
        variant={'unstyled'}
        size="md"
        ref={inputRef}
        id={'note-title-input'}
        styles={{
          input: {
            backgroundColor: 'transparent',
          },
        }}
      />
    </LayoutSection>
  );
}
