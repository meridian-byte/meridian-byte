'use client';

import React from 'react';
import { TextInput } from '@mantine/core';
import classes from './editor-title.module.css';
import { LayoutSection } from '@repo/ui';

interface EditorTitleProps {
  inputProps: any;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onBlur: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export default function EditorTitle({ inputProps, inputRef, onBlur, onKeyDown }: EditorTitleProps) {
  return (
    <LayoutSection id="note-details" containerized="md">
      <TextInput
        {...inputProps}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        classNames={classes}
        placeholder="Title"
        variant="unstyled"
        size="md"
        ref={inputRef}
        id="note-title-input"
        styles={{
          input: {
            backgroundColor: 'transparent',
          },
        }}
      />
    </LayoutSection>
  );
}
