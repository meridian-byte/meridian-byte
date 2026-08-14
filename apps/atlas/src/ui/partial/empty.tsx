'use client';

import React from 'react';
import { Group, Stack, Text, ThemeIcon } from '@mantine/core';
import { ICON_SIZE, ICON_STROKE_WIDTH, ICON_WRAPPER_SIZE, SECTION_SPACING } from '@repo/constants';
import { IconMoodEmpty } from '@tabler/icons-react';

export default function Empty({ label }: { label?: string }) {
  return (
    <Stack align="center" py={SECTION_SPACING}>
      <Group>
        <ThemeIcon size={ICON_WRAPPER_SIZE * 1.5} variant="default">
          <IconMoodEmpty size={ICON_SIZE * 1.5} stroke={ICON_STROKE_WIDTH} />
        </ThemeIcon>
      </Group>

      <Text fz={'sm'} c={'dimmed'}>
        {label || 'Empty.'}
      </Text>
    </Stack>
  );
}
