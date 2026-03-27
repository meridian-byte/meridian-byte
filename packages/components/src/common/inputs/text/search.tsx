'use client';

import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
} from '@repo/constants/sizes';
import {
  ActionIcon,
  TextInput,
  TextInputProps,
  ThemeIcon,
  Tooltip,
} from '@mantine/core';
import { IconSearch, IconX } from '@tabler/icons-react';
import React, { useState } from 'react';
import { useDebouncedCallback } from '@mantine/hooks';
import SpinnerApp from '../../spinners/app';

export default function Search({
  props,
  ...restProps
}: {
  props: { value: string; setValue: any; close?: () => void };
} & TextInputProps) {
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState(props.value);

  const debounceHandleChange = useDebouncedCallback(async (v: string) => {
    props.setValue(v);
    setLoading(false);
  }, 500);

  const handleChange = (v: string) => {
    setValue(v);
    setLoading(true);
    debounceHandleChange(v);
  };

  return (
    <TextInput
      value={value}
      onChange={(e) => handleChange(e.currentTarget.value)}
      variant="filled"
      aria-label="Search notes"
      placeholder="Search notes..."
      leftSection={<IconSearch size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />}
      rightSection={
        loading ? (
          <SpinnerApp props={{ size: ICON_SIZE - 4 }} />
        ) : (
          (props.close || !!props.value.trim().length) && (
            <Tooltip
              label={
                !props.value.trim().length ? 'Close modal' : 'Clear Search'
              }
            >
              <ActionIcon
                size={ICON_WRAPPER_SIZE - 4}
                variant="subtle"
                color="dark"
                onClick={() => {
                  if (!props.value.trim().length) {
                    if (props.close) props.close();
                  } else {
                    setValue('');
                    props.setValue('');
                  }
                }}
              >
                <IconX size={ICON_SIZE - 4} stroke={ICON_STROKE_WIDTH} />
              </ActionIcon>
            </Tooltip>
          )
        )
      }
      styles={{
        input: {
          backgroundColor:
            'light-dark(var(--mantine-color-gray-1), var(--mantine-color-dark-8))',
          fontWeight: 500,
        },
      }}
      {...restProps}
    />
  );
}
