'use client';

import { Skeleton, Stack } from '@mantine/core';
import { useStoreNote } from '@repo/libraries/zustand/stores/note';
import { sortArray } from '@repo/utilities/array';
import { Order } from '@repo/types/enums';
import NavlinkNote from '@/components/common/navlink/note';

export default function Notes() {
  const notes = useStoreNote((s) => s.notes);
  const ids = new Set((notes || []).map((n) => n.id));

  return (
    <div>
      <Stack gap={0} style={{ zIndex: 0 }}>
        {notes === undefined ? (
          <Stack gap={2}>
            <Skeleton h={31.7} />
            <Skeleton h={31.7} />
            <Skeleton h={31.7} />
            <Skeleton h={31.7} />
            <Skeleton h={31.7} />
            <Skeleton h={31.7} />
            <Skeleton h={31.7} />
            <Skeleton h={31.7} />
            <Skeleton h={31.7} />
          </Stack>
        ) : (
          <>
            {sortArray(
              (notes || []).filter(
                (n) => !n.parent_note_id || !ids.has(n.parent_note_id)
              ),
              (i) => i.created_at,
              Order.DESCENDING
            ).map((n) => {
              return (
                <div key={n.id}>
                  <NavlinkNote props={{ noteId: n.id }} />
                </div>
              );
            })}
          </>
        )}
      </Stack>
    </div>
  );
}
