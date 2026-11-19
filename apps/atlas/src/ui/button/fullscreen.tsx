'use client';

import React from 'react';
import { useFullscreenDocument, useMediaQuery } from '@mantine/hooks';
import { ActionIcon, Group, Tooltip } from '@mantine/core';
import { IconArrowsMaximize, IconArrowsMinimize } from '@tabler/icons-react';
import { ICON_SIZE, ICON_STROKE_WIDTH, ICON_WRAPPER_SIZE } from '@repo/constants';
import { SHELL_VALUES } from '@atlas/constants';
import { useBreakpointFlags } from '@repo/hooks';

export default function Fullscreen() {
  const { ready, isDesktop } = useBreakpointFlags();

  const { toggle, fullscreen } = useFullscreenDocument();

  const buttonProps = {
    icon: fullscreen ? IconArrowsMinimize : IconArrowsMaximize,
    label: `${fullscreen ? 'Exit' : 'Enter'} fullscreen mode`,
  };

  if (!ready) {
    // Must not render wrong layout before client knows viewport
    return null;
  }

  return !isDesktop ? null : (
    <Tooltip label={buttonProps.label}>
      <ActionIcon
        size={!isDesktop ? ICON_WRAPPER_SIZE * 1.25 : sharedHeight}
        onClick={toggle}
        variant="subtle"
        color="gray"
      >
        <buttonProps.icon
          size={!isDesktop ? ICON_SIZE * 1.25 : sharedHeight - 8}
          stroke={ICON_STROKE_WIDTH}
        />
      </ActionIcon>
    </Tooltip>
  );
}

const sharedHeight = SHELL_VALUES.FOOTER.HEIGHT.DESKTOP - 10;
