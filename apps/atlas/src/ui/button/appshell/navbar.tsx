'use client';

import React from 'react';
import { IconArrowBarLeft, IconArrowBarRight } from '@tabler/icons-react';
import { ActionIcon } from '@mantine/core';
import { ICON_STROKE_WIDTH } from '@repo/constants';
import { useStoreAppShell } from '@repo/store';
import { SHELL_VALUES } from '@atlas/constants';

export default function Navbar({ options }: { options?: { hideWhenOpen?: boolean } }) {
  const navbarChild = useStoreAppShell((s) => s.appshell?.child?.navbar);
  // const asideChild = useStoreAppShell((s) => s.appshell?.child?.aside);
  const toggleNavbarChild = useStoreAppShell((s) => s.toggleNavbarChild);

  const states = {
    iconLeft: !navbarChild ? IconArrowBarRight : IconArrowBarLeft,
  };

  const label = `${navbarChild ? 'Collapse' : 'Expand'} Navbar`;

  return (
    <ActionIcon
      radius={0}
      variant="subtle"
      color="gray"
      aria-label={label}
      size={SHELL_VALUES.FOOTER.HEIGHT - 1}
      onClick={toggleNavbarChild}
      display={!options?.hideWhenOpen ? undefined : navbarChild ? 'none' : undefined}
      miw={47.43} // temporary hard code
    >
      <states.iconLeft size={SHELL_VALUES.FOOTER.HEIGHT - 8} stroke={ICON_STROKE_WIDTH} />
    </ActionIcon>
  );
}
