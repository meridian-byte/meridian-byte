'use client';

import React from 'react';
import { useFullscreen } from '@mantine/hooks';
import { ActionIcon, Group, Tooltip } from '@mantine/core';
import { IconArrowsMaximize, IconArrowsMinimize } from '@tabler/icons-react';
import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
} from '@repo/constants/sizes';

export default function Fullscreen() {
  const { toggle, fullscreen } = useFullscreen();

  const buttonProps = {
    icon: fullscreen ? IconArrowsMinimize : IconArrowsMaximize,
    label: `${fullscreen ? 'Exit' : 'Enter'} fullscreen mode`,
  };

  return (
    <Group>
      <Tooltip label={buttonProps.label}>
        <ActionIcon size={ICON_WRAPPER_SIZE} onClick={toggle} variant="subtle">
          <buttonProps.icon size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
        </ActionIcon>
      </Tooltip>
    </Group>
  );
}
