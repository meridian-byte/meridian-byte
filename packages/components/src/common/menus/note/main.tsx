'use client';

import React from 'react';
import {
  Menu,
  MenuDivider,
  MenuDropdown,
  MenuItem,
  MenuTarget,
} from '@mantine/core';
import {
  IconBook,
  IconCopy,
  IconFileTypePdf,
  IconGitMerge,
  IconListDetails,
  IconPencil,
  IconSortAscendingSmallBig,
  IconSwipeLeft,
  IconTrash,
  IconWriting,
} from '@tabler/icons-react';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@repo/constants/sizes';
import { NoteGet } from '@repo/types/models/note';
import { useNoteActions } from '@repo/hooks/actions/note';
import ModalConfirm from '@repo/components/common/modals/confirm';
import { useStoreUserStates } from '@repo/libraries/zustand/stores/user-states';
import ModalMerge from '../../modals/merge';
import ModalMove from '../../modals/move';

export default function Main({
  item,
  children,
}: {
  item: NoteGet;
  children: React.ReactNode;
}) {
  // const userStates = useStoreUserStates((s) => s.userStates);
  // const setUserStates = useStoreUserStates((s) => s.setUserStates);

  // const toogleProperties = {
  //   label: userStates?.editing == true ? 'Reading' : 'Editing',
  //   icon: userStates?.editing == true ? IconBook : IconWriting,
  // };

  const { noteDelete } = useNoteActions();

  const handleRename = () => {
    const myInput = document.getElementById(
      'note-title-input'
    ) as HTMLInputElement | null;

    if (myInput) {
      myInput.focus();
      myInput.select(); // highlights all text
    }
  };

  return (
    <Menu
      onClose={close}
      withinPortal
      position="bottom-end"
      keepMounted
      width={220}
      styles={{
        dropdown: {
          padding: 5,
        },
        item: {
          padding: '2.5px 10px',
        },
        itemLabel: {
          fontSize: 'var(--mantine-font-size-sm)',
        },
      }}
    >
      <MenuTarget>
        <span>{children}</span>
      </MenuTarget>

      <MenuDropdown>
        {/* <MenuItem
          leftSection={
            <toogleProperties.icon
              size={ICON_SIZE}
              stroke={ICON_STROKE_WIDTH}
            />
          }
          onClick={() => {
            if (!userStates) return;

            setUserStates({
              ...userStates,
              editing: !userStates.editing,
            });
          }}
        >
          {toogleProperties.label} view
        </MenuItem> */}

        <MenuItem
          leftSection={
            <IconPencil size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
          }
          onClick={() => handleRename()}
        >
          Rename
        </MenuItem>

        <ModalMove props={{ noteId: item.id }}>
          <MenuItem
            leftSection={
              <IconSortAscendingSmallBig
                size={ICON_SIZE}
                stroke={ICON_STROKE_WIDTH}
              />
            }
            onClick={() => {}}
          >
            Move file to...
          </MenuItem>
        </ModalMove>

        <ModalMerge props={{ noteId: item.id }}>
          <MenuItem
            leftSection={
              <IconGitMerge size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            }
            onClick={() => {}}
          >
            Merge entire file with...
          </MenuItem>
        </ModalMerge>

        <MenuDivider />

        <MenuItem
          leftSection={
            <IconSwipeLeft size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
          }
          onClick={() => {}}
        >
          Backlinks in document
        </MenuItem>

        <MenuItem
          leftSection={
            <IconListDetails size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
          }
          onClick={() => {}}
        >
          Add file property
        </MenuItem>

        <MenuDivider />

        <MenuItem
          leftSection={<IconCopy size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />}
          onClick={() => {}}
        >
          Copy URL
        </MenuItem>

        <MenuItem
          leftSection={<IconCopy size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />}
          onClick={() => {}}
        >
          Copy path
        </MenuItem>

        <MenuItem
          leftSection={<IconCopy size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />}
          onClick={() => {}}
        >
          Copy relative path
        </MenuItem>

        <MenuDivider />

        <MenuItem
          leftSection={
            <IconFileTypePdf size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
          }
          onClick={() => {}}
        >
          Export to PDF
        </MenuItem>

        <MenuDivider />

        <ModalConfirm props={{ onConfirm: () => noteDelete({ values: item }) }}>
          <MenuItem
            color="red.6"
            leftSection={
              <IconTrash size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            }
          >
            Delete
          </MenuItem>
        </ModalConfirm>
      </MenuDropdown>
    </Menu>
  );
}
