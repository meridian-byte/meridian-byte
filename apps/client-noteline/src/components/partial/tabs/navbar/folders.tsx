'use client';

import React from 'react';
import {
  ActionIcon,
  Box,
  Divider,
  Group,
  NavLink,
  Skeleton,
  Stack,
  Tooltip,
} from '@mantine/core';
import { usePathname, useRouter } from 'next/navigation';
import { useMediaQuery } from '@mantine/hooks';
import Link from 'next/link';
import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
} from '@repo/constants/sizes';
import { IconFilePlus, IconFolderPlus } from '@tabler/icons-react';
import { useNotebookActions } from '@/hooks/actions/notebook';
import MenuNoteSide from '@/components/common/menu/note/side';
import InputTextRename from '@/components/common/inputs/text/rename';
import { NoteGet } from '@repo/types/models/note';
import AccordionNotebooks from '@/components/common/accordions/notebooks';
import { useStoreAppShell } from '@/libraries/zustand/stores/shell';
import { useNoteActions } from '@/hooks/actions/note';
import { useStoreNote } from '@/libraries/zustand/stores/note';
import { useStoreNotebook } from '@/libraries/zustand/stores/notebook';

export default function Folders() {
  const pathname = usePathname();
  const { appshell, setAppShell } = useStoreAppShell();
  const desktop = useMediaQuery('(min-width: 62em)');
  const { notes } = useStoreNote();
  const { notebooks } = useStoreNotebook();
  const router = useRouter();

  const {
    noteCreate,
    noteUpdate,
    noteDelete,
    noteCopy,
    startNoteRename,
    noteInputRefs,
    noteEditing,
    setNoteEditingState,
  } = useNoteActions();

  const {
    notebookCreate,
    notebookUpdate,
    notebookInputRefs,
    notebookEditing,
    setNotebookEditingState,
  } = useNotebookActions();

  const NoteComponent = ({ item }: { item: NoteGet }) => {
    return (
      <MenuNoteSide
        item={item}
        menuProps={{
          copyNote: noteCopy,
          deleteNote: noteDelete,
          startRename: startNoteRename,
        }}
      >
        <NavLink
          component={Link}
          href={`/app?noteId=${item.id}`}
          active={pathname.includes(item.id)}
          label={
            <InputTextRename
              ref={(el) => {
                noteInputRefs.current[item.id] = el;
              }}
              item={item}
              renameProps={{
                editing: noteEditing,
                setEditing: setNoteEditingState,
                updateItem: noteUpdate,
                placeholder: 'New Note',
              }}
            />
          }
          onClick={(e) => {
            if (noteEditing) e.preventDefault();

            if (desktop) return;

            if (!appshell) return;

            setAppShell({
              ...appshell,
              child: { ...appshell.child, navbar: false },
            });
          }}
          styles={{
            root: {
              borderRadius: 'var(--mantine-radius-md)',
              padding:
                'calc(var(--mantine-spacing-xs) / 4) var(--mantine-spacing-xs)',
            },
            label: {
              fontSize: 'var(--mantine-font-size-sm)',
              fontWeight: 'normal',
            },
          }}
        />
      </MenuNoteSide>
    );
  };

  return (
    <div>
      <Box
        pos={'sticky'}
        top={48}
        bg={
          'light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-8))'
        }
        style={{ zIndex: 1 }}
      >
        <Divider />

        <Group gap={5} pos={'sticky'} top={48} py={'xs'}>
          {notes === undefined ? (
            <Skeleton w={ICON_WRAPPER_SIZE} h={ICON_WRAPPER_SIZE} />
          ) : (
            <Tooltip label={'New Note'}>
              <ActionIcon
                size={ICON_WRAPPER_SIZE}
                variant={'subtle'}
                onClick={() => {
                  const newNote = noteCreate();
                  router.push(`/app?noteId=${newNote?.id}`);
                }}
              >
                <IconFilePlus size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
              </ActionIcon>
            </Tooltip>
          )}

          {notes === undefined ? (
            <Skeleton w={ICON_WRAPPER_SIZE} h={ICON_WRAPPER_SIZE} />
          ) : (
            <Tooltip label={'New Folder'}>
              <ActionIcon
                size={ICON_WRAPPER_SIZE}
                variant={'subtle'}
                onClick={() => notebookCreate()}
              >
                <IconFolderPlus size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
              </ActionIcon>
            </Tooltip>
          )}
        </Group>
      </Box>

      <Stack mt={`xs`} gap={5} style={{ zIndex: 0 }}>
        {notes === undefined || notebooks === undefined ? (
          <>
            <Skeleton h={35} />
            <Skeleton h={35} />
            <Skeleton h={35} />
          </>
        ) : (
          <>
            <AccordionNotebooks
              props={{
                noteComponent: (note) => <NoteComponent item={note} />,
                inputComponent: (notebook) => (
                  <InputTextRename
                    ref={(el) => {
                      notebookInputRefs.current[notebook.id] = el;
                    }}
                    item={notebook}
                    renameProps={{
                      editing: notebookEditing,
                      setEditing: setNotebookEditingState,
                      updateItem: notebookUpdate,
                      placeholder: 'New Folder',
                    }}
                  />
                ),
              }}
            />

            {notes
              ?.filter((n) => !n.notebook_id)
              .map((n) => {
                return (
                  <div key={n.id}>
                    <NoteComponent item={n} />
                  </div>
                );
              })}
          </>
        )}
      </Stack>
    </div>
  );
}
