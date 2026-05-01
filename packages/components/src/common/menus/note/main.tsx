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
  IconBook,
  IconCategory,
  IconCopy,
  IconFileTypePdf,
  IconGitMerge,
  IconListDetails,
  IconLock,
  IconLockOpen,
  IconPencil,
  IconSortAscendingSmallBig,
  IconSwipeLeft,
  IconTrash,
  IconWriting,
} from '@tabler/icons-react';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@repo/constants/sizes';
import { NoteGet } from '@repo/types/models/note';
import { useNoteActions } from '@repo/hooks/actions/note';
import ModalConfirm, {
  ConfirmProps,
} from '@repo/components/common/modals/confirm';
import { useStoreUserStates } from '@repo/libraries/zustand/stores/user-states';
import ModalMerge from '../../modals/merge';
import ModalMove from '../../modals/move';
import { useStoreNote } from '@repo/libraries/zustand/stores/note';
import { useStoreActiveItems } from '@repo/libraries/zustand/stores/active-items';

export default function Main({
  props,
  children,
}: {
  props?: { noteId?: string };
  children: React.ReactNode;
}) {
  const addActiveNote = useStoreActiveItems((s) => s.addActiveNote);
  const addActiveConfirm = useStoreActiveItems((s) => s.addActiveConfirm);
  const note = useStoreNote((s) => s.notes?.find((n) => n.id == props?.noteId));

  const userStates = useStoreUserStates((s) => s.userStates);
  const toggleUserStateEditing = useStoreUserStates(
    (s) => s.toggleUserStateEditing
  );

  const toogleProperties = {
    label: userStates?.editing == true ? 'Lock' : 'Unlock',
    icon: userStates?.editing == true ? IconLock : IconLockOpen,
  };

  const { noteDelete } = useNoteActions();

  return (
    <Menu withinPortal position="bottom-end" width={undefined}>
      <MenuTarget>
        <span>{children}</span>
      </MenuTarget>

      <MenuDropdown maw={240}>
        <MenuLabel>
          <Text component="span" inherit lineClamp={1}>
            {note?.title}
          </Text>
        </MenuLabel>

        <MenuDivider />

        <MenuItem
          leftSection={
            <toogleProperties.icon
              size={ICON_SIZE}
              stroke={ICON_STROKE_WIDTH}
            />
          }
          onClick={() => {
            if (!userStates) return;
            toggleUserStateEditing();
          }}
        >
          {toogleProperties.label} note
        </MenuItem>

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
            <IconSortAscendingSmallBig
              size={ICON_SIZE}
              stroke={ICON_STROKE_WIDTH}
            />
          }
          onClick={() => {
            if (note) addActiveNote(note, { move: { toNote: true } });
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

        <MenuItem
          leftSection={
            <IconCategory size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
          }
          onClick={() => {
            if (note) addActiveNote(note, { move: { toWorkspace: true } });
          }}
        >
          Change note workspace to...
        </MenuItem>

        <MenuDivider />

        {/* <MenuItem
          leftSection={
            <IconListDetails size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
          }
          onClick={() => {}}
          disabled
        >
          Add file property
        </MenuItem> */}

        {/* <MenuDivider /> */}

        {/* <MenuItem
          leftSection={
            <IconFileTypePdf size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
          }
          onClick={() => {}}
          disabled
        >
          Export to PDF
        </MenuItem> */}

        {/* <MenuDivider /> */}

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
  );
}
