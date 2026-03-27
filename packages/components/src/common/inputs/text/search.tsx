'use client';

import { ICON_SIZE, ICON_STROKE_WIDTH } from '@repo/constants/sizes';
import { ActionIcon, TextInput, TextInputProps, Tooltip } from '@mantine/core';
import { IconSearch, IconX } from '@tabler/icons-react';
import React, { useState } from 'react';
import { useDebouncedCallback } from '@mantine/hooks';
import SpinnerApp from '../../spinners/app';

export default function Search({
  props,
  ...restProps
}: {
  props: { value: string; setValue: any };
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
      placeholder="Search notes"
      rightSection={
        loading ? (
          <SpinnerApp props={{ size: ICON_SIZE - 4 }} />
        ) : !props.value.trim().length ? (
          <IconSearch size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
        ) : (
          <Tooltip label={'Clear Search'}>
            <ActionIcon
              size={ICON_SIZE}
              variant="transparent"
              onClick={() => {
                setValue('');
                props.setValue('');
              }}
            >
              <IconX size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            </ActionIcon>
          </Tooltip>
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
