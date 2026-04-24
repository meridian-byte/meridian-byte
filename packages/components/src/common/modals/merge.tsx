'use client';

import React, { useMemo, useState } from 'react';
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
import { useStoreNote } from '@repo/libraries/zustand/stores/note';
import { useSearchCriteria } from '@repo/hooks/search';
import { SECTION_SPACING } from '@repo/constants/sizes';
import { useStoreActiveItems } from '@repo/libraries/zustand/stores/active-items';
import { useStoreWorkspace } from '@repo/libraries/zustand/stores/workspace';

export default function Merge({
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
  const resolvedOpened = !!activeNote && !!activeNote.merge;

  const [searchValue, setSearchValue] = useState('');

  const notes = useStoreNote((s) => s.notes);

  const workspaces = useStoreWorkspace((s) => s.workspaces);
  const activeWorkspace = useStoreActiveItems((s) => s.activeItems?.workspace);

  // find default workspace
  const oldestWorkspace = useMemo(() => {
    if (!workspaces?.length) return null;
    return workspaces.reduce((oldest, current) =>
      new Date(current.created_at) < new Date(oldest.created_at)
        ? current
        : oldest
    );
  }, [workspaces]);

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

  const { noteMerge } = useNoteActions();

  const { searchCriteriaItems } = useSearchCriteria({
    list: (workspaceNotes || []).filter((n) =>
      !props?.noteId ? n.id != activeNote?.item.id : n.id != props?.noteId
    ),
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
        <LayoutModalMain props={{ close: handleClose, title: 'Merge Note' }}>
          <InputTextSearch
            props={{ value: searchValue, setValue: setSearchValue }}
            aria-label={`Search notes`}
            placeholder={`Search notes...`}
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
                searchCriteriaItems.map((mni) => (
                  <NavLink
                    key={mni.id}
                    label={mni.title}
                    style={{
                      borderRadius: 'var(--mantine-radius-sm)',
                    }}
                    onClick={() => {
                      if (note) noteMerge({ from: note, to: mni });
                    }}
                  />
                ))
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
