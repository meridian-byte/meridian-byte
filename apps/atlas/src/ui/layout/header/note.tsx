'use client';

import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import { LayoutSection } from '@repo/ui';
import { ICON_SIZE, ICON_STROKE_WIDTH, ICON_WRAPPER_SIZE } from '@repo/constants';
import {
  ActionIcon,
  Badge,
  Box,
  Divider,
  Group,
  ScrollArea,
  Skeleton,
  Stack,
  Text,
  Title,
  Tooltip,
} from '@mantine/core';
import {
  IconArrowLeft,
  IconArrowRight,
  IconBook,
  IconDotsVertical,
  IconWriting,
} from '@tabler/icons-react';
import { NoteGet } from '@repo/types';
import { useRouter, useSearchParams } from 'next/navigation';
import { WrapperUnderlayGlass } from '@repo/ui';
import { useBreakpointFlags, useScroll } from '@repo/hooks';
// import BreadcrumbAppNote from '@repo/components/common/breadcrumbs/app/note';
import BadgeUpdatedTimestamp from '@atlas/ui/badge/updated-timestamp';
import BadgeNoteStatus from '@atlas/ui/badge/note-status';
import { useStoreNote, useStoreUserStates, useStoreView, useSubView } from '@repo/store';
import MenuNote from '@atlas/ui/menu/note';
import { extractUuidFromParam } from '@repo/utils';

const Note = memo(function Note() {
  const { ready, isDesktop } = useBreakpointFlags();

  const subViewValue = useStoreView((s) => s.view?.subView);
  const noteId = useMemo(
    () => (subViewValue ? extractUuidFromParam(subViewValue) : ''),
    [subViewValue],
  );
  const note = useStoreNote((s) => s.notes?.find((n) => n.id === noteId));

  const actionSize = isDesktop ? 30 - 6 : ICON_WRAPPER_SIZE * 1.25;
  const iconSize = isDesktop ? ICON_SIZE - 4 : ICON_SIZE * 1.25;

  const menuTrigger = useMemo(
    () => (
      <Group>
        <Tooltip label="More options">
          <ActionIcon size={actionSize} variant="subtle" color="gray">
            <IconDotsVertical size={iconSize} stroke={ICON_STROKE_WIDTH} />
          </ActionIcon>
        </Tooltip>
      </Group>
    ),
    [actionSize, iconSize],
  );

  if (!ready) {
    return null;
  }

  return (
    <Box pos="sticky" top={0} style={{ zIndex: 1 }} display={!noteId ? 'none' : undefined}>
      <LayoutSection id="note-details-header" containerized={false}>
        <WrapperUnderlayGlass props={{ blur: 4, opacity: 0.8 }}>
          <Group justify="space-between" wrap="nowrap" mih={30} py={5} px="xs">
            <Group gap={5} wrap="nowrap" />

            <Group gap={5}>
              <BadgeUpdatedTimestamp />

              <Group gap={5} wrap="nowrap" justify="end">
                <BadgeNoteStatus />

                {note === undefined ? (
                  <Skeleton h={30 - 6} w={30 - 6} />
                ) : (
                  note && <MenuNote defaultValues={note}>{menuTrigger}</MenuNote>
                )}
              </Group>
            </Group>
          </Group>
        </WrapperUnderlayGlass>
      </LayoutSection>

      <Divider />
    </Box>
  );
});

export default Note;
