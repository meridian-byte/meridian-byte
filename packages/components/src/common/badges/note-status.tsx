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
import { IconLock } from '@tabler/icons-react';

export default function NoteStatus() {
  const userStateEditing = useStoreUserStates((s) => s.userStates?.editing);
  const toggleUserStateEditing = useStoreUserStates(
    (s) => s.toggleUserStateEditing
  );

  return (
    <Transition mounted={userStateEditing == false}>
      {(styles) => (
        <div style={styles}>
          <Tooltip
            label={<span>Note Locked. Click to unlock</span>}
            styles={{ tooltip: { textAlign: 'center' } }}
          >
            <Group>
              <ActionIcon
                variant="light"
                color="yellow.6"
                size={ICON_WRAPPER_SIZE}
                radius={'md'}
                onClick={() => toggleUserStateEditing()}
              >
                <IconLock size={ICON_SIZE - 2} stroke={ICON_STROKE_WIDTH} />
              </ActionIcon>
            </Group>
          </Tooltip>
        </div>
      )}
    </Transition>
  );
}
