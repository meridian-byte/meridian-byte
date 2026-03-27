import { ActionIcon, Box, Divider, Group, Title } from '@mantine/core';
import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
} from '@repo/constants/sizes';
import { IconX } from '@tabler/icons-react';
import React from 'react';

export default function Modal({
  children,
  title,
  close,
  options,
}: {
  children: React.ReactNode;
  title: string;
  close: () => void;
  options?: { padding: string | number | null };
}) {
  return (
    <div>
      <Group
        justify="space-between"
        px={options?.padding || 'md'}
        pt={options?.padding || 'md'}
      >
        <Title order={1} fz={'md'} fw={500}>
          {title}
        </Title>

        <ActionIcon size={ICON_WRAPPER_SIZE} variant="subtle" onClick={close}>
          <IconX size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
        </ActionIcon>
      </Group>

      <Divider mt={'md'} mb={options?.padding === null ? undefined : 'md'} />

      <Box
        px={options?.padding === null ? undefined : options?.padding || 'md'}
        pb={options?.padding === null ? undefined : options?.padding || 'md'}
      >
        {children}
      </Box>
    </div>
  );
}
