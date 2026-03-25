'use client';

import {
  ActionIcon,
  Badge,
  Group,
  Text,
  ThemeIcon,
  Tooltip,
  Transition,
} from '@mantine/core';
import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
} from '@repo/constants/sizes';
import { getRegionalDate, getRelativeTime } from '@repo/utilities/date-time';
import React from 'react';
import { useMinuteTicker } from '@repo/hooks/interval';
import { useStoreUserStates } from '@repo/libraries/zustand/stores/user-states';
import { IconLock, IconLockOpen } from '@tabler/icons-react';

export default function NoteStatus({
  props,
}: {
  props?: { options?: { hide?: boolean } };
}) {
  const userStateEditing = useStoreUserStates((s) => s.userStates?.editing);
  const toggleUserStateEditing = useStoreUserStates(
    (s) => s.toggleUserStateEditing
  );

  const locked = userStateEditing == false;
  const buttonProps = {
    color: locked ? 'yellow.6' : 'dark',
    variant: locked ? 'light' : 'subtle',
    label: locked ? 'Unlock' : 'Lock',
    icon: locked ? IconLock : IconLockOpen,
  };

  return (
    <Transition mounted={!props?.options?.hide ? true : locked}>
      {(styles) => (
        <div style={styles}>
          <Tooltip
            label={<span>{buttonProps.label} note</span>}
            styles={{ tooltip: { textAlign: 'center' } }}
          >
            <Group>
              <ActionIcon
                variant={buttonProps.variant}
                color={buttonProps.color}
                size={ICON_WRAPPER_SIZE}
                radius={'md'}
                onClick={() => toggleUserStateEditing()}
              >
                <buttonProps.icon
                  size={ICON_SIZE - 2}
                  stroke={ICON_STROKE_WIDTH}
                />
              </ActionIcon>
            </Group>
          </Tooltip>
        </div>
      )}
    </Transition>
  );
}
