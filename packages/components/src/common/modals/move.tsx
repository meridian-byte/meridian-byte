'use client';

import React, { useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import {
  Center,
  Divider,
  Modal,
  NavLink,
  ScrollArea,
  Skeleton,
  Stack,
  Text,
} from '@mantine/core';
import LayoutModalMain from '@repo/components/layout/modal';
import { useNoteActions } from '@repo/hooks/actions/note';
import InputTextSearch from '../inputs/text/search';
import { useSearchCriteria } from '@repo/hooks/search';
import { SECTION_SPACING } from '@repo/constants/sizes';
import { NotesValue, useStoreNote } from '@repo/libraries/zustand/stores/note';
import { NoteGet } from '@repo/types/models/note';

export default function Move({
  props,
  children,
}: {
  props?: { noteId?: string };
  children: React.ReactNode;
}) {
  const [opened, { open, close }] = useDisclosure(false);
  const [searchValue, setSearchValue] = useState('');

  const notes = useStoreNote((s) => s.notes);
  const note = useStoreNote((s) => s.notes?.find((n) => n.id == props?.noteId));

  const { noteMove } = useNoteActions();

  const { searchCriteriaItems } = useSearchCriteria({
    list: getValidParentNotes(props?.noteId || '', notes || []),
    searchValue: searchValue,
  });

  const handleClose = () => {
    setSearchValue('');
    close();
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={handleClose}
        withCloseButton={false}
        centered
      >
        <LayoutModalMain props={{ close: handleClose, title: 'Move Note' }}>
          <InputTextSearch
            props={{ value: searchValue, setValue: setSearchValue }}
            data-autofocus
          />

          <Divider />

          <ScrollArea h={280}>
            <Stack gap={2}>
              {notes === undefined ? (
                <>
                  <Stack h={41} justify="center">
                    <Skeleton h={18} />
                  </Stack>
                  <Stack h={41} justify="center">
                    <Skeleton h={18} />
                  </Stack>
                  <Stack h={41} justify="center">
                    <Skeleton h={18} />
                  </Stack>
                </>
              ) : !searchCriteriaItems.length ? (
                <>
                  <Center ta={'center'} py={SECTION_SPACING}>
                    <Text inherit fz={'sm'} c={'dimmed'}>
                      No notes found...
                    </Text>
                  </Center>
                </>
              ) : (
                <>
                  <NavLink
                    label={'Root'}
                    display={!note?.parent_note_id ? 'none' : undefined}
                    style={{
                      borderRadius: 'var(--mantine-radius-sm)',
                    }}
                    onClick={() => {
                      if (note) {
                        noteMove({ values: note, parent_note_id: null });
                      }
                    }}
                  />

                  {searchCriteriaItems.map((pni) => (
                    <NavLink
                      key={pni.id}
                      label={pni.title}
                      style={{
                        borderRadius: 'var(--mantine-radius-sm)',
                      }}
                      onClick={() => {
                        if (note) {
                          noteMove({ values: note, parent_note_id: pni.id });
                        }
                      }}
                    />
                  ))}
                </>
              )}
            </Stack>
          </ScrollArea>
        </LayoutModalMain>
      </Modal>

      <span onClick={open}>{children}</span>
    </>
  );
}

function getValidParentNotes(noteId: string, notes: NoteGet[]): NoteGet[] {
  const childrenMap = new Map<string, string[]>();

  for (const note of notes) {
    if (!note.parent_note_id) continue;

    if (!childrenMap.has(note.parent_note_id)) {
      childrenMap.set(note.parent_note_id, []);
    }

    childrenMap.get(note.parent_note_id)!.push(note.id);
  }

  const descendants = new Set<string>();

  function collect(id: string) {
    const children = childrenMap.get(id) || [];
    for (const child of children) {
      descendants.add(child);
      collect(child);
    }
  }

  collect(noteId);

  // Find the immediate parent of the note
  const note = notes.find((n) => n.id === noteId);
  const parentId = note?.parent_note_id;

  return notes.filter(
    (n) => n.id !== noteId && !descendants.has(n.id) && n.id !== parentId
  );
}
