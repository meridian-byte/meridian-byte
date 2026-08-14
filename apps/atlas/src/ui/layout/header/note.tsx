'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
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
import { useScroll } from '@repo/hooks';
// import BreadcrumbAppNote from '@repo/components/common/breadcrumbs/app/note';
import BadgeUpdatedTimestamp from '@atlas/ui/badge/updated-timestamp';
import BadgeNoteStatus from '@atlas/ui/badge/note-status';
import { useStoreNote, useStoreUserStates, useSubView } from '@repo/store';
import MenuNote from '@atlas/ui/menu/note';
import { extractUuidFromParam } from '@repo/utils';

export default function Note() {
  const { subViewValue } = useSubView();
  const noteId = extractUuidFromParam(subViewValue || '');
  const note = useStoreNote((s) => s.notes?.find((n) => n.id == noteId));

  const { styles } = useScroll({
    threshold: 70,
    defaultStyles: useMemo(() => ({ opacity: 0 }), []),
    scrolledStyles: useMemo(() => ({ opacity: 1 }), []),
  });

  return (
    <Box
      pos={'sticky'}
      top={0}
      style={{ zIndex: 1 }}
      display={!noteId ? 'none' : undefined}
      visibleFrom="xs"
    >
      <LayoutSection id={`note-details-header`} containerized={false}>
        <WrapperUnderlayGlass props={{ blur: 4, opacity: 0.8 }}>
          <Group justify="space-between" wrap="nowrap">
            <Group gap={5} wrap="nowrap">
              {/* <BreadcrumbAppNote props={{ noteId: note?.id }} /> */}
            </Group>

            <Group gap={0} wrap="nowrap" justify="end">
              <BadgeUpdatedTimestamp />

              <BadgeNoteStatus />

              {note === undefined ? (
                <Skeleton h={30} w={30} radius={0} />
              ) : (
                note && (
                  <MenuNote defaultValues={note}>
                    <Group>
                      <Tooltip label={'More options'}>
                        <ActionIcon size={30} variant={'subtle'} color="gray" radius={0}>
                          <IconDotsVertical size={ICON_SIZE - 4} stroke={ICON_STROKE_WIDTH} />
                        </ActionIcon>
                      </Tooltip>
                    </Group>
                  </MenuNote>
                )
              )}
            </Group>
          </Group>
        </WrapperUnderlayGlass>
      </LayoutSection>

      <Box style={{ ...styles, transition: '0.25s all ease' }}>
        <Divider />
      </Box>
    </Box>
  );
}
