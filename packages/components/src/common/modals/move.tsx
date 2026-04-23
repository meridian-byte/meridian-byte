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
import {
  ActiveWorkspaceValue,
  useStoreActiveItems,
} from '@repo/libraries/zustand/stores/active-items';
import { useStoreWorkspace } from '@repo/libraries/zustand/stores/workspace';
import { WorkspaceGet } from '@repo/types/models/workspace';

export default function Move({
  props,
  options,
  children,
}: {
  props?: { noteId?: string };
  options?: { global?: boolean };
  children: React.ReactNode;
}) {
  const activeNote = useStoreActiveItems((s) => s.activeItems?.note);
  const addActiveNote = useStoreActiveItems((s) => s.addActiveNote);
  const removeActiveNote = useStoreActiveItems((s) => s.removeActiveNote);

  const resolvedOpened = !!activeNote && !!activeNote.move;

  const [searchValue, setSearchValue] = useState('');

  const workspaces = useStoreWorkspace((s) => s.workspaces);
  const activeWorkspace = useStoreActiveItems((s) => s.activeItems?.workspace);
  const notes = useStoreNote((s) => s.notes);

  // find default workspace
  const oldestWorkspace = workspaces?.reduce((oldest, current) => {
    return new Date(current.created_at) < new Date(oldest.created_at)
      ? current
      : oldest;
  });

  let workspaceNotes = [];

  if (activeWorkspace?.id === oldestWorkspace?.id) {
    workspaceNotes = (notes || []).filter((ni) => {
      return !ni.workspace_id || ni.workspace_id === oldestWorkspace?.id;
    });
  } else {
    workspaceNotes = (notes || []).filter((ni) => {
      return ni.workspace_id === activeWorkspace?.id;
    });
  }

  const note = workspaceNotes?.find((n) => n.id == props?.noteId);

  const { noteMove } = useNoteActions();

  const { searchCriteriaItems } = useSearchCriteria({
    list: activeNote?.move?.toNote
      ? getValidParentNotes(
          !props?.noteId ? activeNote.item.id || '' : props?.noteId || '',
          workspaceNotes || []
        )
      : getValidWorkspaces(workspaces || [], activeWorkspace),
    searchValue: searchValue,
  });

  const handleClose = () => {
    setSearchValue('');
    removeActiveNote();
  };

  return (
    <>
      <Modal
        opened={resolvedOpened}
        onClose={handleClose}
        withCloseButton={false}
        centered
      >
        <LayoutModalMain
          props={{
            close: handleClose,
            title: activeNote?.move?.toNote
              ? 'Move Note'
              : 'Change Note Workspace',
          }}
        >
          <InputTextSearch
            props={{ value: searchValue, setValue: setSearchValue }}
            aria-label={`Search ${activeNote?.move?.toNote ? 'notes' : 'workspaces'}`}
            placeholder={`Search ${activeNote?.move?.toNote ? 'notes' : 'workspaces'}...`}
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
                      No {activeNote?.move?.toNote ? 'notes' : 'workspaces'}{' '}
                      found...
                    </Text>
                  </Center>
                </>
              ) : (
                <>
                  <NavLink
                    label={'Root'}
                    display={
                      !activeNote?.move?.toNote ||
                      !activeNote?.item.parent_note_id
                        ? 'none'
                        : undefined
                    }
                    style={{
                      borderRadius: 'var(--mantine-radius-sm)',
                    }}
                    onClick={() => {
                      if (activeNote?.move?.toNote) {
                        noteMove({
                          values: activeNote.item,
                          parent_note_id: null,
                        });
                      }

                      handleClose();
                    }}
                  />

                  {searchCriteriaItems.map((listedItem) => (
                    <NavLink
                      key={listedItem.id}
                      label={listedItem.title}
                      style={{
                        borderRadius: 'var(--mantine-radius-sm)',
                      }}
                      onClick={() => {
                        if (activeNote) {
                          if (activeNote?.move?.toNote) {
                            noteMove({
                              values: activeNote.item,
                              parent_note_id: listedItem.id,
                            });
                          }

                          if (activeNote?.move?.toWorkspace) {
                            noteMove({
                              values: activeNote.item,
                              workspace_id: listedItem.id,
                            });
                          }
                        }

                        handleClose();
                      }}
                    />
                  ))}
                </>
              )}
            </Stack>
          </ScrollArea>
        </LayoutModalMain>
      </Modal>

      <span
        onClick={
          options?.global
            ? undefined
            : () => {
                if (note) addActiveNote(note);
              }
        }
      >
        {children}
      </span>
    </>
  );
}

function getValidWorkspaces(
  workspaces?: WorkspaceGet[],
  activeWorkspace?: ActiveWorkspaceValue
) {
  const resolvedWorkspaces = workspaces?.filter(
    (wi) => wi.id != activeWorkspace?.id
  );

  return resolvedWorkspaces || [];
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
