'use client';

import React, { useState } from 'react';
import {
  Menu,
  MenuTarget,
  MenuDropdown,
  MenuItem,
  MenuProps,
} from '@mantine/core';
import { IconArchive, IconPencil, IconTrash } from '@tabler/icons-react';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@repo/constants/sizes';
import ModalConfirm from '@repo/components/common/modals/confirm';
import ModalEdit from '../modals/edit';
import { useChatActions } from '@repo/hooks/actions/chat';
import { useStoreChat } from '@repo/libraries/zustand/stores/chat';

export default function ChatNavlink({
  chatId,
  children,
  opened,
  setOpened,
  ...restProps
}: {
  chatId: string;
  children: React.ReactNode;
  opened: boolean;
  setOpened: React.Dispatch<React.SetStateAction<boolean>>;
} & MenuProps) {
  const chat = useStoreChat((s) => s.chats?.find((c) => c.id == chatId));

  const [modalEditOpened, setModalEditOpened] = useState(false);
  const { chatArchive, chatDelete } = useChatActions();

  if (!chat) return null;

  return (
    <Menu
      opened={opened}
      onChange={setOpened}
      keepMounted
      position="bottom-start"
      {...restProps}
    >
      <MenuTarget>
        <div>{children}</div>
      </MenuTarget>

      <MenuDropdown>
        {/* <MenuItem
          leftSection={
            <IconShare
              size={ICON_SIZE / 1.25}
              stroke={ICON_STROKE_WIDTH}
              color="var(--mantine-color-dimmed)"
            />
          }
        >
          Share
        </MenuItem> */}

        <ModalEdit
          title="Edit Chat"
          chatId={chat.id}
          modalOpened={modalEditOpened}
          setModalOpened={setModalEditOpened}
        >
          <MenuItem
            leftSection={
              <IconPencil
                size={ICON_SIZE / 1.25}
                stroke={ICON_STROKE_WIDTH}
                color="var(--mantine-color-dimmed)"
              />
            }
          >
            Edit
          </MenuItem>
        </ModalEdit>

        <MenuItem
          leftSection={
            <IconArchive
              size={ICON_SIZE / 1.25}
              stroke={ICON_STROKE_WIDTH}
              color="var(--mantine-color-dimmed)"
            />
          }
          onClick={() => chatArchive(chat)}
        >
          Archive
        </MenuItem>

        <ModalConfirm
          props={{
            title: 'Delete Chat?',
            desc: `This will delete ${chat.title}.`,
            onConfirm: () => chatDelete(chat),
          }}
        >
          <MenuItem
            leftSection={
              <IconTrash size={ICON_SIZE / 1.25} stroke={ICON_STROKE_WIDTH} />
            }
            color="red"
          >
            Delete
          </MenuItem>
        </ModalConfirm>
      </MenuDropdown>
    </Menu>
  );
}
