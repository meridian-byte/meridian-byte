'use client';

import { ICON_SIZE, ICON_STROKE_WIDTH } from '@repo/constants/sizes';
import { ActionIcon, TextInput, Tooltip } from '@mantine/core';
import { IconSearch, IconX } from '@tabler/icons-react';
import React from 'react';

export default function Search({
  props,
}: {
  props: { value: string; setValue: any };
}) {
  return (
    <TextInput
      value={props.value}
      onChange={(e) => props.setValue(e.currentTarget.value)}
      variant="filled"
      styles={{
        input: {
          backgroundColor:
            'light-dark(var(--mantine-color-gray-2), var(--mantine-color-dark-9))',
          fontWeight: 500,
        },
      }}
      aria-label="Search notes"
      placeholder="Search notes"
      rightSection={
        props.value.trim().length > 0 ? (
          <Tooltip label={'Clear Search'}>
            <ActionIcon
              size={ICON_SIZE}
              variant="transparent"
              onClick={() => props.setValue('')}
            >
              <IconX size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            </ActionIcon>
          </Tooltip>
        ) : (
          <IconSearch size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
        )
      }
    />
  );
}
