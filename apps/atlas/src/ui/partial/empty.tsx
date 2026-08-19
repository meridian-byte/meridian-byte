'use client';

import React from 'react';
import { Center, Group, Loader, Stack, Text, ThemeIcon } from '@mantine/core';
import { ICON_SIZE, ICON_STROKE_WIDTH, ICON_WRAPPER_SIZE, SECTION_SPACING } from '@repo/constants';
import { IconMoodEmpty } from '@tabler/icons-react';

export default function Empty({ label, loading }: { label?: string; loading?: boolean }) {
  const sharedSize = ICON_WRAPPER_SIZE * 1.5;

  return (
    <Stack align="center" py={SECTION_SPACING} mih={220}>
      <Center h={sharedSize} w={sharedSize} display={loading ? undefined : 'none'}>
        <Loader />
      </Center>

      <Group display={loading ? 'none' : undefined}>
        <ThemeIcon size={sharedSize} variant="default">
          <IconMoodEmpty size={ICON_SIZE * 1.5} stroke={ICON_STROKE_WIDTH} />
        </ThemeIcon>
      </Group>

      <Text fz={'sm'} c={'dimmed'} ta={'center'} display={loading ? 'none' : undefined}>
        {label || 'Empty.'}
      </Text>
    </Stack>
  );
}
