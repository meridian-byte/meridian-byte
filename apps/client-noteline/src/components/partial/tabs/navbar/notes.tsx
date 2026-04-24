'use client';

import {
  ActionIcon,
  Box,
  Divider,
  Group,
  Skeleton,
  Stack,
  Tooltip,
} from '@mantine/core';
import { useStoreNote } from '@repo/libraries/zustand/stores/note';
import { sortArray } from '@repo/utilities/array';
import { Order } from '@repo/types/enums';
import { Note as NavlinkNote } from '@/components/common/navlink/note';
import { useMemo } from 'react';
import { NoteGet } from '@repo/types/models/note';
import { create } from 'zustand';
import { useStoreActiveItems } from '@repo/libraries/zustand/stores/active-items';
import { useStoreWorkspace } from '@repo/libraries/zustand/stores/workspace';
import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
} from '@repo/constants/sizes';
import {
  IconEdit,
  IconLayoutBottombarExpand,
  IconLayoutNavbarExpand,
} from '@tabler/icons-react';
import { useNoteActions } from '@repo/hooks/actions/note';

export default function Notes() {
  const workspaces = useStoreWorkspace((s) => s.workspaces);
  const activeItems = useStoreActiveItems((s) => s.activeItems);
  const activeWorkspace = useStoreActiveItems((s) => s.activeItems?.workspace);

  const notes = useStoreNote((s) => s.notes);
  const { noteCreate } = useNoteActions();

  // const ids = new Set((notes || []).map((n) => n.id));

  const oldestWorkspaceId = useMemo(() => {
    if (!workspaces?.length) return null;
    return workspaces.reduce((oldest, current) =>
      new Date(current.created_at) < new Date(oldest.created_at)
        ? current
        : oldest
    ).id;
  }, [workspaces]);

  // Process tree structure ONCE here
  const { rootNotes, notesMap, childrenMap } = useMemo(() => {
    const nMap = new Map<string, NoteGet>();
    const cMap = new Map<string, NoteGet[]>();
    const roots: NoteGet[] = [];

    const isActiveDefault = activeWorkspace?.id === oldestWorkspaceId;

    // Single pass through notes
    (notes || []).forEach((note) => {
      // 1. Workspace Filtering Logic
      const belongsToActive = note.workspace_id === activeWorkspace?.id;
      const isOrphanInDefault = !note.workspace_id && isActiveDefault;

      if (belongsToActive || isOrphanInDefault) {
        nMap.set(note.id, note);

        // 2. Build Children Map
        if (note.parent_note_id) {
          const siblings = cMap.get(note.parent_note_id) || [];
          siblings.push(note);
          cMap.set(note.parent_note_id, siblings);
        }
      }
    });

    // 3. Determine Roots
    // We do this after the map is built to ensure parent_note_id existence check is accurate
    nMap.forEach((note) => {
      if (!note.parent_note_id || !nMap.has(note.parent_note_id)) {
        roots.push(note);
      }
    });

    // Sort roots (e.g., by title or position)
    roots.sort((a, b) => a.title.localeCompare(b.title));

    return { rootNotes: roots, notesMap: nMap, childrenMap: cMap };
  }, [notes, activeWorkspace, oldestWorkspaceId]);

  return (
    <div>
      <Box
        pos={'sticky'}
        top={48}
        bg={
          'light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-9))'
        }
        style={{ zIndex: 1 }}
      >
        <Box px={'xs'}>
          <Divider variant="dashed" />

          <Group gap={5} pb={'xs'} mt={'xs'}>
            <Tooltip label={`Create new`}>
              <Group>
                <ActionIcon
                  size={ICON_WRAPPER_SIZE}
                  variant={'light'}
                  color="dark"
                  onClick={() => {
                    noteCreate();
                  }}
                >
                  <IconEdit size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
                </ActionIcon>
              </Group>
            </Tooltip>

            <Tooltip label={`Expand all`}>
              <Group>
                <ActionIcon
                  size={ICON_WRAPPER_SIZE}
                  variant={'light'}
                  color="dark"
                  disabled
                >
                  <IconLayoutNavbarExpand
                    size={ICON_SIZE}
                    stroke={ICON_STROKE_WIDTH}
                  />
                </ActionIcon>
              </Group>
            </Tooltip>

            <Tooltip label={`Collapse all`}>
              <Group>
                <ActionIcon
                  size={ICON_WRAPPER_SIZE}
                  variant={'light'}
                  color="dark"
                  disabled
                >
                  <IconLayoutBottombarExpand
                    size={ICON_SIZE}
                    stroke={ICON_STROKE_WIDTH}
                  />
                </ActionIcon>
              </Group>
            </Tooltip>
          </Group>
        </Box>

        <Divider />
      </Box>

      <Stack
        gap={0}
        style={{ zIndex: 0 }}
        // pt={3.33333}
        pb={'xs'}
        pl={5}
        pr={'xs'}
        // mih={'150vh'}
      >
        {notes === undefined || activeItems === undefined ? (
          <Stack gap={5}>
            {navlinkSkeleton}
            {navlinkSkeleton}
            {navlinkSkeleton}
            {navlinkSkeleton}
            {navlinkSkeleton}
            {navlinkSkeleton}
            {navlinkSkeleton}
            {navlinkSkeleton}
            {navlinkSkeleton}
          </Stack>
        ) : (
          <>
            {sortArray(
              rootNotes || [],
              (i) => i.created_at,
              Order.DESCENDING
            ).map((n) => {
              return (
                <div key={n.id}>
                  <NavlinkNote
                    noteId={n.id}
                    notesMap={notesMap}
                    childrenMap={childrenMap}
                  />
                </div>
              );
            })}
          </>
        )}
      </Stack>
    </div>
  );
}

const navlinkSkeleton = <Skeleton h={26} />;
