'use client';

import React, { useMemo } from 'react';
import { Breadcrumbs, Group, Skeleton, Button } from '@mantine/core';
import { useStoreNote } from '@repo/libraries/zustand/stores/note';
import { NoteGet } from '@repo/types/models/note';
import { linkify } from '@repo/utilities/url';
import Link from 'next/link';

export default function Note({ props }: { props?: { noteId?: string } }) {
  const notes = useStoreNote((s) => s.notes);

  const noteMap = useMemo(() => {
    const map = new Map<string, NoteGet>();
    for (const n of notes || []) {
      map.set(n.id, n);
    }
    return map;
  }, [notes]);

  if (notes === undefined) {
    return (
      <Group gap={'xs'}>
        <Skeleton h={18} w={60} />
        <span>/</span>
        <Skeleton h={18} w={60} />
        <span>/</span>
        <Skeleton h={18} w={60} />
      </Group>
    );
  }

  if (!props?.noteId || !notes) return null;

  const path = buildPath(props.noteId, noteMap);

  return (
    <Breadcrumbs>
      <Breadcrumbs separatorMargin={5}>
        {path.map((note, i) => {
          const isLast = i === path.length - 1;

          const sharedProps = {
            key: note.id,
            size: 'compact-sm',
            color: 'dark',
            fw: 'normal',
            variant: 'subtle',
          };

          return isLast ? (
            <Button {...sharedProps} variant="transparent">
              {note.title}
            </Button>
          ) : (
            <Button
              {...sharedProps}
              component={Link}
              href={`/app/n/${linkify(note.title)}-${note.id}`}
            >
              {note.title}
            </Button>
          );
        })}
      </Breadcrumbs>
    </Breadcrumbs>
  );
}

function buildPath(activeId: string, map: Map<string, NoteGet>): NoteGet[] {
  const path: NoteGet[] = [];

  let current = map.get(activeId);

  while (current) {
    path.push(current);
    current = current.parent_note_id
      ? map.get(current.parent_note_id)
      : undefined;
  }

  return path.reverse();
}
