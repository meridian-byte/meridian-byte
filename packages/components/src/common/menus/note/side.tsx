'use client';

import React from 'react';
import {
  Menu,
  MenuDivider,
  MenuDropdown,
  MenuItem,
  MenuLabel,
  MenuTarget,
  Text,
} from '@mantine/core';
import {
  IconCopy,
  IconFiles,
  IconGitMerge,
  IconPencil,
  IconSortAscendingSmallBig,
  IconTrash,
} from '@tabler/icons-react';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@repo/constants/sizes';
import { useContextMenu } from '@repo/hooks/ui/context-menu';
import { NoteGet } from '@repo/types/models/note';
import ModalConfirm, {
  ConfirmProps,
} from '@repo/components/common/modals/confirm';
import ModalMerge from '../../modals/merge';
import ModalMove from '../../modals/move';
import { useNoteActions } from '@repo/hooks/actions/note';
import { useStoreNote } from '@repo/libraries/zustand/stores/note';
import { useStoreActiveItems } from '@repo/libraries/zustand/stores/active-items';

export default function Side({
  props,
  children,
}: {
  props: { noteId?: string; options?: { context?: boolean } };
  children: React.ReactNode;
}) {
  const addActiveNote = useStoreActiveItems((s) => s.addActiveNote);
  const addActiveConfirm = useStoreActiveItems((s) => s.addActiveConfirm);

  const { opened, setOpened, close, menuWidth, targetProps, anchorProps } =
    useContextMenu();

  const { noteDelete, noteCopy } = useNoteActions();

  const note = useStoreNote((s) => s.notes?.find((n) => n.id == props.noteId));

  const target = (
    <span
      id={`note-menu-target-${props.noteId}`}
      {...targetProps}
      onContextMenu={(e) => {
        e.stopPropagation();
        targetProps.onContextMenu?.(e);
      }}
    >
      {children}
    </span>
  );

  return (
    <>
      {props.options?.context && target}

      <Menu
        position={props.options?.context ? undefined : 'bottom-start'}
        opened={props.options?.context ? opened : undefined}
        onChange={props.options?.context ? setOpened : undefined}
        onClose={props.options?.context ? close : undefined}
        withinPortal
        width={menuWidth}
      >
        <MenuTarget>
          {props.options?.context ? <div {...anchorProps} /> : target}
        </MenuTarget>

        <MenuDropdown>
          <MenuLabel>
            <Text component="span" inherit lineClamp={1}>
              {note?.title}
            </Text>
          </MenuLabel>

          <MenuDivider />

          <MenuItem
            leftSection={
              <IconPencil size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            }
            onClick={() => {
              if (note) addActiveNote(note);
            }}
          >
            Rename
          </MenuItem>

          <MenuItem
            leftSection={
              <IconFiles size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            }
            onClick={() => {
              if (note) noteCopy({ values: note });
            }}
          >
            Make a copy
          </MenuItem>

          <MenuDivider />

          <MenuItem
            leftSection={
              <IconSortAscendingSmallBig
                size={ICON_SIZE}
                stroke={ICON_STROKE_WIDTH}
              />
            }
            onClick={() => {
              if (note) addActiveNote(note, { move: true });
            }}
          >
            Move note to...
          </MenuItem>

          <MenuItem
            leftSection={
              <IconGitMerge size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            }
            onClick={() => {
              if (note) addActiveNote(note, { merge: true });
            }}
          >
            Merge note with...
          </MenuItem>

          <MenuDivider />

          <MenuItem
            color="red.6"
            leftSection={
              <IconTrash size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            }
            onClick={() => {
              addActiveConfirm({
                onConfirm: () => {
                  if (note) noteDelete({ values: note });
                },
              } satisfies ConfirmProps);
            }}
          >
            Delete
          </MenuItem>
        </MenuDropdown>
      </Menu>
    </>
  );
}
