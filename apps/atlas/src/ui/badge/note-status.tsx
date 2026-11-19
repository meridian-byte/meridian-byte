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
import { useBreakpointFlags, useMinuteTicker } from '@repo/hooks';
import { useStoreUserStates, useSubView } from '@repo/store';
import { IconBook, IconLock, IconLockOpen, IconWriting } from '@tabler/icons-react';
import { usePathname } from 'next/navigation';
import { useStoreNote } from '@repo/store';
import { extractUuidFromParam } from '@repo/utils';

export default function NoteStatus({ props }: { props?: { options?: { hide?: boolean } } }) {
  const { ready, isMobile, isDesktop } = useBreakpointFlags();

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

  if (!ready) {
    // Must not render wrong layout before client knows viewport
    return null;
  }

  return userStateEditing === undefined ? (
    <Skeleton h={30 - 6} w={30 - 6} />
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
                size={isDesktop ? 30 - 6 : ICON_WRAPPER_SIZE * 1.25}
                onClick={() => toggleUserStateEditing()}
              >
                <buttonProps.icon
                  size={isDesktop ? ICON_SIZE - 4 : ICON_SIZE * 1.25}
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
