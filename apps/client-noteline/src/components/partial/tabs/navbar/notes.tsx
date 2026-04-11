'use client';

import { Box, Divider, Skeleton, Stack } from '@mantine/core';
import { useStoreNote } from '@repo/libraries/zustand/stores/note';
import { sortArray } from '@repo/utilities/array';
import { Order } from '@repo/types/enums';
import { Note as NavlinkNote } from '@/components/common/navlink/note';
import { useMemo } from 'react';
import { NoteGet } from '@repo/types/models/note';
import { create } from 'zustand';

export default function Notes() {
  const notes = useStoreNote((s) => s.notes);
  // const ids = new Set((notes || []).map((n) => n.id));

  // Process tree structure ONCE here
  const { rootNotes, notesMap, childrenMap } = useMemo(() => {
    const nMap = new Map(notes?.map((n) => [n.id, n]));
    const cMap = new Map<string, NoteGet[]>();

    notes?.forEach((n) => {
      if (n.parent_note_id) {
        const arr = cMap.get(n.parent_note_id) || [];
        arr.push(n);
        cMap.set(n.parent_note_id, arr);
      }
    });

    const roots = notes?.filter(
      (n) => !n.parent_note_id || !nMap.has(n.parent_note_id)
    );
    // Sort roots here...

    return { rootNotes: roots, notesMap: nMap, childrenMap: cMap };
  }, [notes]);

  return (
    <div>
      <Box pos={'sticky'} top={48} style={{ zIndex: 1 }}>
        <Divider />
      </Box>

      <Stack gap={0} style={{ zIndex: 0 }} pt={3.33333} pb={'xs'}>
        {notes === undefined ? (
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
