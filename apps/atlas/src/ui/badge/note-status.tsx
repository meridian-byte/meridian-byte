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
import React, { memo, useCallback, useEffect, useMemo } from 'react';
import { useBreakpointFlags, useMinuteTicker } from '@repo/hooks';
import { useStoreUserStates, useSubView } from '@repo/store';
import { IconBook, IconLock, IconLockOpen, IconWriting } from '@tabler/icons-react';
import { usePathname } from 'next/navigation';
import { useStoreNote } from '@repo/store';
import { extractUuidFromParam } from '@repo/utils';

const TOOLTIP_STYLES = { tooltip: { textAlign: 'center' as const } };

const NoteStatus = memo(function NoteStatus() {
  const { ready, isDesktop } = useBreakpointFlags();

  const userStateEditing = useStoreUserStates((s) => s.userStates?.editing);
  const toggleUserStateEditing = useStoreUserStates((s) => s.toggleUserStateEditing);

  const reading = userStateEditing === false;
  const viewLabel = reading ? 'Reading' : 'Editing';
  const actionLabel = reading ? 'edit' : 'read';
  const IconComponent = reading ? IconWriting : IconBook;

  const tooltipLabel = useMemo(
    () => (
      <Stack ta="center" gap={0}>
        <Text inherit>Current View: {viewLabel}</Text>
        <Text inherit>Click to {actionLabel}</Text>
      </Stack>
    ),
    [viewLabel, actionLabel],
  );

  const handleToggle = useCallback(() => {
    toggleUserStateEditing();
  }, [toggleUserStateEditing]);

  if (!ready) {
    return null;
  }

  if (userStateEditing === undefined) {
    return <Skeleton h={30 - 6} w={30 - 6} />;
  }

  return (
    <Tooltip label={tooltipLabel} styles={TOOLTIP_STYLES}>
      <Group>
        <ActionIcon
          variant="subtle"
          color="gray"
          size={isDesktop ? 30 - 6 : ICON_WRAPPER_SIZE * 1.25}
          onClick={handleToggle}
        >
          <IconComponent
            size={isDesktop ? ICON_SIZE - 4 : ICON_SIZE * 1.25}
            stroke={ICON_STROKE_WIDTH}
          />
        </ActionIcon>
      </Group>
    </Tooltip>
  );
});

export default NoteStatus;
