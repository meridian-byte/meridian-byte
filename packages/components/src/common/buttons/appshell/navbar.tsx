'use client';

import React from 'react';
import { useAppshellNavbar } from '@repo/hooks/app-shell';
import {
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

export default function Navbar({
  props,
}: {
  props: { options?: { mobile?: boolean } };
}) {
  const { appshell, handleAppshellChange } = useAppshellNavbar();

  const states = {
    iconLeft: !appshell?.child.navbar
      ? IconLayoutSidebarLeftExpand
      : IconLayoutSidebarLeftCollapse,
    iconRight: !appshell?.child.aside
      ? IconLayoutSidebarRightExpand
      : IconLayoutSidebarRightCollapse,
  };

  return (
    <Tooltip
      label={appshell?.child.navbar ? 'Collapse' : 'Expand'}
      position="right"
    >
      <Group display={!props.options?.mobile ? 'none' : undefined}>
        <ActionIcon
          variant="subtle"
          color="pri.5"
          aria-label={appshell?.child.navbar ? 'Collapse' : 'Expand'}
          onClick={() => {
            if (!props.options?.mobile) return;
            if (!appshell) return;

            handleAppshellChange({
              ...appshell,
              child: {
                ...appshell.child,
                navbar: !appshell?.child.navbar,
              },
            });
          }}
          size={ICON_WRAPPER_SIZE}
        >
          <states.iconLeft size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
        </ActionIcon>
      </Group>
    </Tooltip>
  );
}
