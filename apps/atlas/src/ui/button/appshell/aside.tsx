'use client';

import React from 'react';
import { IconArrowBarLeft, IconArrowBarRight } from '@tabler/icons-react';
import { ActionIcon, Skeleton, Tooltip } from '@mantine/core';
import { ICON_STROKE_WIDTH } from '@repo/constants';
import { SHELL_VALUES } from '@atlas/constants';
import { useAppshellChild } from '@repo/hooks';

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

  if (asideChild === undefined) {
    return <Skeleton w={47.43} h={SHELL_VALUES.FOOTER.HEIGHT.DESKTOP - 1} radius={0} />;
  }

  return (
    <Tooltip label={label}>
      <ActionIcon
        variant="subtle"
        color="gray"
        aria-label={label}
        size={sharedHeight - 1}
        onClick={handleToggleChildAside}
        display={!options?.hideWhenClosed ? undefined : asideChild ? undefined : 'none'}
        miw={47.43}
      >
        <states.iconRight size={sharedHeight - 8} stroke={ICON_STROKE_WIDTH} />
      </ActionIcon>
    </Tooltip>
  );
}

const sharedHeight = SHELL_VALUES.FOOTER.HEIGHT.DESKTOP - 10;
