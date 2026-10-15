'use client';

import React from 'react';
import { useFullscreenDocument, useMediaQuery } from '@mantine/hooks';
import { ActionIcon, Group, Tooltip } from '@mantine/core';
import { IconArrowsMaximize, IconArrowsMinimize } from '@tabler/icons-react';
import { ICON_SIZE, ICON_STROKE_WIDTH, ICON_WRAPPER_SIZE } from '@repo/constants';
import { SHELL_VALUES } from '@atlas/constants';

export default function Fullscreen() {
  const desktop = useMediaQuery('(min-width: 62em)');

  const { toggle, fullscreen } = useFullscreenDocument();

  const buttonProps = {
    icon: fullscreen ? IconArrowsMinimize : IconArrowsMaximize,
    label: `${fullscreen ? 'Exit' : 'Enter'} fullscreen mode`,
  };

  return !desktop ? null : (
    <Tooltip label={buttonProps.label}>
      <ActionIcon
        size={!desktop ? ICON_WRAPPER_SIZE * 1.25 : sharedHeight}
        onClick={toggle}
        variant="subtle"
        color="gray"
      >
        <buttonProps.icon
          size={!desktop ? ICON_SIZE * 1.25 : sharedHeight - 8}
          stroke={ICON_STROKE_WIDTH}
        />
      </ActionIcon>
    </Tooltip>
  );
}

const sharedHeight = SHELL_VALUES.FOOTER.HEIGHT.DESKTOP - 10;
