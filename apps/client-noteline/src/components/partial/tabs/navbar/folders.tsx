'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActionIcon,
  Box,
  Divider,
  Group,
  NavLink,
  Skeleton,
  Stack,
  Text,
  Tooltip,
} from '@mantine/core';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMediaQuery } from '@mantine/hooks';
import Link from 'next/link';
import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
  WEEK,
} from '@repo/constants/sizes';
import { IconFilePlus, IconFolderPlus } from '@tabler/icons-react';
import { useNotebookActions } from '@repo/hooks/actions/notebook';
import MenuNoteSide from '@repo/components/common/menus/note/side';
import InputTextRename from '@repo/components/common/inputs/text/rename';
import AccordionNotebooks from '@repo/components/common/accordions/notebooks';
import { useStoreAppShell } from '@repo/libraries/zustand/stores/shell';
import { useNoteActions } from '@repo/hooks/actions/note';
import { useStoreNote } from '@repo/libraries/zustand/stores/note';
import { useStoreNotebook } from '@repo/libraries/zustand/stores/notebook';
import { AppShell } from '@repo/types/components';
import { setCookieClient } from '@repo/utilities/cookie-client';
import { COOKIE_NAME } from '@repo/constants/names';
import { getUrlParam, linkify } from '@repo/utilities/url';
import { sortArray } from '@repo/utilities/array';
import { Order } from '@repo/types/enums';

export default function Folders() {
  const searchParams = useSearchParams();
  const appshell = useStoreAppShell((s) => s.appshell);
  const setAppShell = useStoreAppShell((s) => s.setAppShell);
  const desktop = useMediaQuery('(min-width: 62em)');
  const notes = useStoreNote((s) => s.notes);
  const notebooks = useStoreNotebook((s) => s.notebooks);
  const router = useRouter();

  const {
    noteCreate,
    noteUpdate,
    noteDelete,
    noteCopy,
    startNoteRename,
    noteInputRefs,
    noteEditing,
    noteEditingId,
    setNoteEditingState,
  } = useNoteActions();

  const {
    notebookCreate,
    notebookUpdate,
    notebookInputRefs,
    notebookEditing,
    setNotebookEditingState,
  } = useNotebookActions();

  const [paramNoteId, setParamNoteId] = useState('');

  useEffect(() => {
    if (!notebooks || !notes) return;

    const paramNoteId = getUrlParam('noteId');
    if (!paramNoteId) return;

    setParamNoteId(paramNoteId as string);
  }, [notebooks, notes, searchParams]);

  const handleAppshellChange = (params: AppShell) => {
    if (!appshell) return;

    setAppShell(params);

    setCookieClient(COOKIE_NAME.APP_SHELL, params, {
      expiryInSeconds: WEEK,
    });
  };

  const NoteComponent = React.memo(function NoteComponent({
    props,
  }: {
    props: { noteId: string };
  }) {
    const item = useStoreNote((s) =>
      s.notes?.find((n) => n.id === props.noteId)
    );

    const menuProps = useMemo(
      () => ({
        copyNote: noteCopy,
        deleteNote: noteDelete,
        startRename: startNoteRename,
      }),
      [noteCopy, noteDelete, startNoteRename]
    );

    const navLinkStyles = {
      root: {
        borderRadius: 'var(--mantine-radius-md)',
        padding:
          'calc(var(--mantine-spacing-xs) / 4) var(--mantine-spacing-xs)',
      },
      label: {
        fontSize: 'var(--mantine-font-size-sm)',
        fontWeight: 'normal',
      },
    };

    const RenameMemo = React.memo(InputTextRename) as typeof InputTextRename;

    const renameProps = useMemo(
      () => ({
        editing: noteEditing,
        editingId: noteEditingId,
        setEditing: setNoteEditingState,
        updateItem: noteUpdate,
        placeholder: 'New Note',
      }),
      [noteEditing, noteUpdate]
    );

    return !item ? null : (
      <MenuNoteSide item={item} menuProps={menuProps}>
        <NavLink
          component={Link}
          href={`/app/n/${linkify(item.title)}-${item.id}`}
          active={paramNoteId === item.id}
          label={
            !renameProps.editing || renameProps.editingId !== item.id ? (
              <Group mih={30}>
                <Text component="span" inherit lineClamp={1}>
                  {item.title}
                </Text>
              </Group>
            ) : (
              <RenameMemo
                ref={(el) => {
                  noteInputRefs.current[item.id] = el;
                }}
                item={item}
                renameProps={renameProps}
              />
            )
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
          styles={navLinkStyles}
        />
      </MenuNoteSide>
    );
  });

  const notebookRenameProps = useMemo(
    () => ({
      editing: notebookEditing,
      setEditing: setNotebookEditingState,
      updateItem: notebookUpdate,
      placeholder: 'New Folder',
    }),
    [notebookEditing, notebookUpdate]
  );

  const notebookRefCallback = useCallback(
    (id: string) => (el: HTMLInputElement | null) => {
      notebookInputRefs.current[id] = el;
    },
    []
  );

  const InputTextRenameMemo = React.memo(
    InputTextRename
  ) as typeof InputTextRename;

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
        <Divider color="light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-6))" />

        <Group gap={5} pos={'sticky'} top={48} py={'xs'} mb={8}>
          {notes === undefined ? (
            <Skeleton w={ICON_WRAPPER_SIZE} h={ICON_WRAPPER_SIZE} />
          ) : (
            <Tooltip label={'New Note'}>
              <ActionIcon
                size={ICON_WRAPPER_SIZE}
                variant={'subtle'}
                onClick={() => {
                  const newNote = noteCreate();
                  router.push(
                    `/app/n/${linkify(newNote?.title || '')}-${newNote?.id}`
                  );

                  if (desktop) return;
                  if (!appshell) return;

                  handleAppshellChange({
                    ...appshell,
                    child: { ...appshell.child, navbar: false },
                  });
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

      <Stack gap={5} style={{ zIndex: 0 }}>
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
                editing: notebookEditing,
                noteComponent: (note) => (
                  <NoteComponent props={{ noteId: note.id }} />
                ),
                inputComponent: (notebook) => (
                  <InputTextRenameMemo
                    ref={notebookRefCallback(notebook.id)}
                    item={notebook}
                    renameProps={notebookRenameProps}
                  />
                ),
              }}
            />

            {sortArray(
              (notes || []).filter((n) => !n.notebook_id),
              (i) => i.created_at,
              Order.DESCENDING
            ).map((n) => {
              return (
                <div key={n.id}>
                  <NoteComponent props={{ noteId: n.id }} />
                </div>
              );
            })}
          </>
        )}
      </Stack>
    </div>
  );
}
