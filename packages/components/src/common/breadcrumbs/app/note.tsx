'use client';

import React from 'react';
import { Breadcrumbs, Anchor, Group, Skeleton, Button } from '@mantine/core';
import { useStoreNote } from '@repo/libraries/zustand/stores/note';
import { NoteGet } from '@repo/types/models/note';
import { linkify } from '@repo/utilities/url';
import Link from 'next/link';

export default function Note({ props }: { props?: { noteId?: string } }) {
  const notes = useStoreNote((s) => s.notes);

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

  const path = buildPath(props.noteId, notes);

  return (
    <Breadcrumbs>
      <Breadcrumbs separatorMargin={5}>
        {path.map((note) => (
          <Button
            size="compact-sm"
            variant="subtle"
            color="dark"
            fw={'normal'}
            key={note.id}
            component={Link}
            href={`/app/n/${linkify(note.title)}-${note.id}`}
          >
            {note.title}
          </Button>
        ))}
      </Breadcrumbs>
    </Breadcrumbs>
  );
}

function buildPath(activeId: string, notes: NoteGet[]): NoteGet[] {
  const path: NoteGet[] = [];

  let current = notes.find((n) => n.id === activeId);

  while (current) {
    path.push(current);

    if (!current.parent_note_id) break;

    current = notes.find((n) => n.id === current?.parent_note_id);
  }

  return path.reverse(); // root → active
}
