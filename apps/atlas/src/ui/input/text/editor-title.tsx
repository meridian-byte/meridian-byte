'use client';

import React from 'react';
import { TextInput, TextInputProps } from '@mantine/core';
import classes from './editor-title.module.css';

interface EditorTitleProps {
  inputProps: any;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onBlur: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export default function EditorTitle({
  inputProps,
  inputRef,
  onBlur,
  onKeyDown,
  ...restProps
}: EditorTitleProps & TextInputProps) {
  return (
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
      {...restProps}
    />
  );
}
