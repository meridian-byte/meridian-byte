'use client';

import { useField } from '@mantine/form';
import React, { useEffect, useRef } from 'react';
import { TextInput } from '@mantine/core';
import { NoteGet } from '@repo/types/models/note';
import classes from './title.module.scss';
import { useNoteActions } from '@repo/hooks/actions/note';
import { useStoreNote } from '@repo/libraries/zustand/stores/note';

export default function Title({ item }: { item: NoteGet }) {
  const notes = useStoreNote((s) => s.notes);
  const { noteUpdate } = useNoteActions();

  const field = useField({
    initialValue: item.title,
    validate: (value) => (value.trim().length < 1 ? true : null),
  });

  const handleBlur = () => {
    const value = field.getValue().trim();

    if (value.length < 1) {
      field.reset();
    } else {
      if (value != item.title) {
        noteUpdate({ ...item, title: value });
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
    field.setValue(item.title);
  }, [notes, item]);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (item.title.trim()) return;

    // Focus the input once the component has mounted
    inputRef.current?.focus();
  }, []); // empty dependency array ensures it runs once after mount

  return (
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
    />
  );
}
