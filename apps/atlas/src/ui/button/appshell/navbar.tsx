'use client';

import React from 'react';
import { IconArrowBarLeft, IconArrowBarRight, IconMenu2, IconX } from '@tabler/icons-react';
import { ActionIcon, Skeleton, Tooltip } from '@mantine/core';
import { ICON_SIZE, ICON_STROKE_WIDTH, ICON_WRAPPER_SIZE } from '@repo/constants';
import { useStoreAppShell } from '@repo/store';
import { SHELL_VALUES } from '@atlas/constants';

import { useBreakpointFlags } from '@repo/hooks';

export default function Navbar({ options }: { options?: { hideWhenOpen?: boolean } }) {
  const { ready, isDesktop } = useBreakpointFlags();

  const navbarChild = useStoreAppShell((s) => s.appshell?.child?.navbar);
  // const asideChild = useStoreAppShell((s) => s.appshell?.child?.aside);
  const toggleNavbarChild = useStoreAppShell((s) => s.toggleNavbarChild);

  const states = {
    iconLeft: isDesktop
      ? !navbarChild
        ? IconArrowBarRight
        : IconArrowBarLeft
      : !navbarChild
        ? IconMenu2
        : IconX,
  };

  const label = `${navbarChild ? 'Collapse' : 'Expand'} Navbar`;

  if (!ready) {
    // Must not render wrong layout before client knows viewport
    return null;
  }

  if (navbarChild === undefined) {
    return (
      <Skeleton
        maw={`${100 / 6}%`}
        miw={isDesktop ? undefined : ICON_WRAPPER_SIZE * 1.25}
        h={isDesktop ? sharedHeight : ICON_WRAPPER_SIZE * 1.25}
      />
    );
  }

  return (
    <Tooltip label={label}>
      <ActionIcon
        variant={isDesktop ? 'subtle' : 'subtle'}
        color="gray"
        aria-label={label}
        size={isDesktop ? sharedHeight : ICON_WRAPPER_SIZE * 1.25}
        onClick={toggleNavbarChild}
        display={!options?.hideWhenOpen ? undefined : navbarChild ? 'none' : undefined}
        miw={isDesktop ? 47.43 : ICON_SIZE * 1.25}
      >
        <states.iconLeft
          size={isDesktop ? sharedHeight - 8 : ICON_SIZE * 1.25}
          stroke={ICON_STROKE_WIDTH}
        />
      </ActionIcon>
    </Tooltip>
  );
}

const sharedHeight = SHELL_VALUES.FOOTER.HEIGHT.DESKTOP - 10;
