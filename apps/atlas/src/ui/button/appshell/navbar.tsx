'use client';

import React from 'react';
import { IconArrowBarLeft, IconArrowBarRight, IconMenu2, IconX } from '@tabler/icons-react';
import { ActionIcon, Skeleton, Tooltip } from '@mantine/core';
import { ICON_SIZE, ICON_STROKE_WIDTH, ICON_WRAPPER_SIZE } from '@repo/constants';
import { useStoreAppShell } from '@repo/store';
import { SHELL_VALUES } from '@atlas/constants';
import { useMediaQuery } from '@mantine/hooks';

export default function Navbar({ options }: { options?: { hideWhenOpen?: boolean } }) {
  const desktop = useMediaQuery('(min-width: 62em)');
  const navbarChild = useStoreAppShell((s) => s.appshell?.child?.navbar);
  // const asideChild = useStoreAppShell((s) => s.appshell?.child?.aside);
  const toggleNavbarChild = useStoreAppShell((s) => s.toggleNavbarChild);

  const states = {
    iconLeft: desktop
      ? !navbarChild
        ? IconArrowBarRight
        : IconArrowBarLeft
      : !navbarChild
        ? IconMenu2
        : IconX,
  };

  const label = `${navbarChild ? 'Collapse' : 'Expand'} Navbar`;

  if (navbarChild === undefined) {
    return <Skeleton maw={`${100 / 6}%`} h={sharedHeight} />;
  }

  return (
    <Tooltip label={label}>
      <ActionIcon
        variant="subtle"
        color="gray"
        aria-label={label}
        size={desktop ? sharedHeight : ICON_WRAPPER_SIZE}
        onClick={toggleNavbarChild}
        display={!options?.hideWhenOpen ? undefined : navbarChild ? 'none' : undefined}
        miw={desktop ? 47.43 : ICON_SIZE}
      >
        <states.iconLeft size={desktop ? sharedHeight - 8 : ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
      </ActionIcon>
    </Tooltip>
  );
}

const sharedHeight = SHELL_VALUES.FOOTER.HEIGHT.DESKTOP - 10;
