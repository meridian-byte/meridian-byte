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
  IconFilePlus,
  IconFolders,
  IconPencil,
  IconTrash,
} from '@tabler/icons-react';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@repo/constants/sizes';
import { useContextMenu } from '@repo/hooks/ui/context-menu';
import { NotebookGet } from '@repo/types/models/notebook';
import ModalConfirm from '@repo/components/common/modals/confirm';

export default function Side({
  item,
  menuProps,
  children,
}: {
  item: NotebookGet;
  menuProps: {
    createNote: () => void;
    deleteNotebook: (input: NotebookGet) => void;
    copyNotebook: (input: NotebookGet) => void;
    startRename: (input: NotebookGet) => void;
  };
  children: React.ReactNode;
}) {
  const { opened, setOpened, close, menuWidth, targetProps, anchor } =
    useContextMenu();

  return (
    <>
      <span id="notebook-menu-target" {...targetProps}>
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

        <MenuDropdown onClick={(e) => e.stopPropagation()}>
          <MenuItem
            leftSection={
              <IconFilePlus size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            }
            onClick={() => menuProps.createNote()}
          >
            New Note
          </MenuItem>

          <MenuDivider />

          <MenuItem
            leftSection={
              <IconFolders size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            }
            onClick={() => {
              menuProps.copyNotebook(item);
            }}
          >
            Make a copy
          </MenuItem>

          <MenuDivider />

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
            onClick={() => menuProps.startRename(item)}
          >
            Rename
          </MenuItem>

          <ModalConfirm
            props={{
              onConfirm: () => menuProps.deleteNotebook(item),
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
