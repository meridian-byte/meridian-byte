'use client';

import React from 'react';
import { IconArrowBarLeft, IconArrowBarRight } from '@tabler/icons-react';
import { ActionIcon } from '@mantine/core';
import { ICON_STROKE_WIDTH } from '@repo/constants';
import { SHELL_VALUES } from '@atlas/constants';
import { useAppshellChild } from '@atlas/hooks/appshell';

export default function Aside({
  options,
}: {
  options?: { hideWhenOpen?: boolean; hideWhenClosed?: boolean };
}) {
  const { asideChild, handleToggleChildAside } = useAppshellChild();

  const states = {
    iconRight: !asideChild ? IconArrowBarLeft : IconArrowBarRight,
  };

  const label = `${asideChild ? 'Collapse' : 'Expand'} Aside`;

  return (
    <ActionIcon
      radius={0}
      variant="subtle"
      color="gray"
      aria-label={label}
      size={SHELL_VALUES.FOOTER.HEIGHT - 1}
      onClick={handleToggleChildAside}
      display={!options?.hideWhenClosed ? undefined : asideChild ? undefined : 'none'}
      miw={47.43}
    >
      <states.iconRight size={SHELL_VALUES.FOOTER.HEIGHT - 8} stroke={ICON_STROKE_WIDTH} />
    </ActionIcon>
  );
}
