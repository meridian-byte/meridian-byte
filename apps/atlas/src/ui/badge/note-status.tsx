'use client';

import {
  ActionIcon,
  Badge,
  Group,
  Skeleton,
  Stack,
  Text,
  ThemeIcon,
  Tooltip,
  Transition,
} from '@mantine/core';
import { ICON_SIZE, ICON_STROKE_WIDTH, ICON_WRAPPER_SIZE } from '@repo/constants';
import { getRegionalDate, getRelativeTime } from '@repo/utils';
import React, { useEffect } from 'react';
import { useMinuteTicker } from '@repo/hooks';
import { useStoreUserStates, useSubView } from '@repo/store';
import { IconBook, IconLock, IconLockOpen, IconWriting } from '@tabler/icons-react';
import { usePathname } from 'next/navigation';
import { useStoreNote } from '@repo/store';
import { extractUuidFromParam } from '@repo/utils';

export default function NoteStatus({ props }: { props?: { options?: { hide?: boolean } } }) {
  const { subViewValue } = useSubView();
  const noteId = extractUuidFromParam(subViewValue || '');
  const notes = useStoreNote((s) => s.notes);
  // const note = notes?.find((n) => n.id == noteId);

  const userStateEditing = useStoreUserStates((s) => s.userStates?.editing);
  const toggleUserStateEditing = useStoreUserStates((s) => s.toggleUserStateEditing);

  const reading = userStateEditing == false;

  const buttonProps = {
    view: reading ? 'Reading' : 'Editing',
    label: reading ? 'edit' : 'read',
    icon: reading ? IconWriting : IconBook,
  };

  return userStateEditing === undefined ? (
    <Skeleton h={30} w={ICON_WRAPPER_SIZE} radius={0} />
  ) : (
    <Transition mounted={true}>
      {(styles) => (
        <div style={styles}>
          <Tooltip
            label={
              <Stack ta={'center'} gap={0}>
                <Text inherit>Current View: {buttonProps.view}</Text>
                <Text inherit>Click to {buttonProps.label}</Text>
              </Stack>
            }
            styles={{ tooltip: { textAlign: 'center' } }}
          >
            <Group>
              <ActionIcon
                variant={'subtle'}
                color={'gray'}
                size={ICON_WRAPPER_SIZE}
                radius={0}
                onClick={() => toggleUserStateEditing()}
              >
                <buttonProps.icon size={ICON_SIZE - 2} stroke={ICON_STROKE_WIDTH} />
              </ActionIcon>
            </Group>
          </Tooltip>
        </div>
      )}
    </Transition>
  );
}
