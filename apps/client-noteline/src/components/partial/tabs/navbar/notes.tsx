'use client';

import { Skeleton, Stack } from '@mantine/core';
import { useStoreNote } from '@repo/libraries/zustand/stores/note';
import { sortArray } from '@repo/utilities/array';
import { Order } from '@repo/types/enums';
import NavlinkNote from '@/components/common/navlink/note';

export default function Notes() {
  const notes = useStoreNote((s) => s.notes);

  return (
    <div>
      <Stack gap={0} style={{ zIndex: 0 }}>
        {notes === undefined ? (
          <>
            <Skeleton h={35} />
            <Skeleton h={35} />
            <Skeleton h={35} />
          </>
        ) : (
          <>
            {sortArray(
              (notes || []).filter((n) => !n.parent_note_id),
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
