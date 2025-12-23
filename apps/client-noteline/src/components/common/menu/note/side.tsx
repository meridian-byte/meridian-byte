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
  IconCopy,
  IconFiles,
  IconGitMerge,
  IconPencil,
  IconSortAscendingSmallBig,
  IconTrash,
} from '@tabler/icons-react';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@repo/constants/sizes';
import { useContextMenu } from '@/hooks/ui';
import { NoteGet } from '@repo/types/models/note';
import ModalConfirm from '@repo/components/common/modals/confirm';
import { APP_NAME } from '@/data/constants';
import ModalMerge from '../../modals/merge';
import ModalMove from '../../modals/move';

export default function Side({
  item,
  menuProps,
  children,
}: {
  item: NoteGet;
  menuProps: {
    deleteNote: (input: { values: NoteGet }) => void;
    copyNote: (input: { values: NoteGet }) => void;
    startRename: (input: string) => void;
  };
  children: React.ReactNode;
}) {
  const { opened, setOpened, close, menuWidth, targetProps, anchor } =
    useContextMenu();

  return (
    <>
      <span id="note-menu-target" {...targetProps}>
        {children}
      </span>

      <Menu
        opened={opened}
        onChange={setOpened}
        onClose={close}
        withinPortal
        width={menuWidth}
        keepMounted
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
        <MenuTarget>{anchor}</MenuTarget>

        <MenuDropdown>
          <MenuItem
            leftSection={
              <IconFiles size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            }
            onClick={() => {
              menuProps.copyNote({ values: item });
            }}
          >
            Make a copy
          </MenuItem>

          <ModalMove item={item}>
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

          <ModalMerge item={item}>
            <MenuItem
              leftSection={
                <IconGitMerge size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
              }
            >
              Merge entire file with...
            </MenuItem>
          </ModalMerge>

          <MenuDivider />

          <MenuItem
            leftSection={
              <IconCopy size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            }
            onClick={() => {}}
          >
            Copy {APP_NAME} URL
          </MenuItem>

          <MenuItem
            leftSection={
              <IconCopy size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            }
            onClick={() => {}}
          >
            Copy path
          </MenuItem>

          <MenuItem
            leftSection={
              <IconCopy size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            }
            onClick={() => {}}
          >
            Copy relative path
          </MenuItem>

          <MenuDivider />

          <MenuItem
            leftSection={
              <IconPencil size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            }
            onClick={() => menuProps.startRename(item.id)}
          >
            Rename
          </MenuItem>

          <ModalConfirm
            props={{
              onConfirm: () => menuProps.deleteNote({ values: item }),
            }}
          >
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
    </>
  );
}
