'use client';

import React from 'react';
import { useFullscreenDocument } from '@mantine/hooks';
import { ActionIcon, Group, Tooltip } from '@mantine/core';
import { IconArrowsMaximize, IconArrowsMinimize } from '@tabler/icons-react';
import { ICON_SIZE, ICON_STROKE_WIDTH, ICON_WRAPPER_SIZE } from '@repo/constants';
import { SHELL_VALUES } from '@atlas/constants';

export default function Fullscreen() {
  const { toggle, fullscreen } = useFullscreenDocument();

  const buttonProps = {
    icon: fullscreen ? IconArrowsMinimize : IconArrowsMaximize,
    label: `${fullscreen ? 'Exit' : 'Enter'} fullscreen mode`,
  };

  return (
    <ActionIcon
      radius={0}
      size={SHELL_VALUES.FOOTER.HEIGHT}
      onClick={toggle}
      variant="subtle"
      color="gray"
    >
      <buttonProps.icon size={SHELL_VALUES.FOOTER.HEIGHT - 8} stroke={ICON_STROKE_WIDTH} />
    </ActionIcon>
  );
}
