'use client';

import React from 'react';
import {
  IconArrowBarLeft,
  IconArrowBarRight,
  IconLayoutSidebarLeftCollapse,
  IconLayoutSidebarLeftExpand,
  IconLayoutSidebarRightCollapse,
  IconLayoutSidebarRightExpand,
} from '@tabler/icons-react';
import { ActionIcon, Group, Tooltip } from '@mantine/core';
import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
} from '@repo/constants/sizes';
import { useStoreAppShell } from '@repo/libraries/zustand/stores/shell';

export default function Navbar() {
  // ATOMIC: Only re-renders when this specific boolean changes
  // Do this in both Navbar components
  const navbarChild = useStoreAppShell((s) => s.appshell?.child?.navbar);
  const asideChild = useStoreAppShell((s) => s.appshell?.child?.aside);
  const toggleNavbarChild = useStoreAppShell((s) => s.toggleNavbarChild);

  const states = {
    iconLeft: !navbarChild ? IconArrowBarRight : IconArrowBarLeft,
    iconRight: !asideChild
      ? IconLayoutSidebarRightExpand
      : IconLayoutSidebarRightCollapse,
  };

  const label = `${navbarChild ? 'Collapse' : 'Expand'} Navbar`;
  return (
    <Group>
      <Tooltip label={label} position="right">
        <Group>
          <ActionIcon
            variant="subtle"
            color="dark"
            aria-label={label}
            size={ICON_WRAPPER_SIZE}
            onClick={toggleNavbarChild}
          >
            <states.iconLeft size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
          </ActionIcon>
        </Group>
      </Tooltip>
    </Group>
  );
}
