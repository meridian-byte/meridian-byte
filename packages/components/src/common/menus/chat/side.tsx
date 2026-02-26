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
import { useContextMenu } from '@repo/hooks/ui/context-menu';
import { ChatGet } from '@repo/types/models/chat';
import ModalConfirm from '@repo/components/common/modals/confirm';
import ModalMerge from '../../modals/merge';
import ModalMove from '../../modals/move';

export default function Side({
  item,
  menuProps,
  children,
}: {
  item: ChatGet;
  menuProps: {
    deleteChat: (input: ChatGet) => void;
    startRename: (input: string) => void;
  };
  children: React.ReactNode;
}) {
  const { opened, setOpened, close, menuWidth, targetProps, anchorProps } =
    useContextMenu();

  return (
    <>
      <span id="chat-menu-target" {...targetProps}>
        {children}
      </span>

      <Menu
        opened={opened}
        onChange={setOpened}
        onClose={close}
        withinPortal
        width={menuWidth}
        keepMounted
      >
        <MenuTarget>
          <div {...anchorProps} />
        </MenuTarget>

        <MenuDropdown>
          <MenuItem
            leftSection={
              <IconPencil size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            }
            onClick={() => menuProps.startRename(item.id)}
          >
            Rename
          </MenuItem>

          <MenuDivider />

          {/* <ModalMove item={item}>
            <MenuItem
              leftSection={
                <IconSortAscendingSmallBig
                  size={ICON_SIZE}
                  stroke={ICON_STROKE_WIDTH}
                />
              }
              onClick={() => {}}
            >
              Move chat to...
            </MenuItem>
          </ModalMove> */}

          {/* <ModalMerge item={item}>
            <MenuItem
              leftSection={
                <IconGitMerge size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
              }
            >
              Merge entire file with...
            </MenuItem>
          </ModalMerge> */}

          {/* <MenuDivider /> */}

          <MenuItem
            leftSection={
              <IconCopy size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            }
            onClick={() => {}}
          >
            Copy URL
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

          <ModalConfirm
            props={{
              onConfirm: () => menuProps.deleteChat(item),
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
