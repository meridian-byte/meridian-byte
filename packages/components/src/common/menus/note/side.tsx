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
import ModalConfirm from '@repo/components/common/modals/confirm';
import ModalMerge from '../../modals/merge';
import ModalMove from '../../modals/move';
import { useNoteActions } from '@repo/hooks/actions/note';
import { useStoreNote } from '@repo/libraries/zustand/stores/note';

export default function Side({
  props,
  children,
}: {
  props: { noteId?: string; options?: { context?: boolean } };
  children: React.ReactNode;
}) {
  const { opened, setOpened, close, menuWidth, targetProps, anchorProps } =
    useContextMenu();

  const { noteDelete, noteCopy } = useNoteActions();

  const note = useStoreNote((s) => s.notes?.find((n) => n.id == props.noteId));

  const target = (
    <span id="note-menu-target" {...targetProps}>
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
        keepMounted
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
            onClick={() => {}}
            disabled
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

          <ModalMove props={{ noteId: note?.id }}>
            <MenuItem
              leftSection={
                <IconSortAscendingSmallBig
                  size={ICON_SIZE}
                  stroke={ICON_STROKE_WIDTH}
                />
              }
              onClick={() => {}}
            >
              Move to...
            </MenuItem>
          </ModalMove>

          <ModalMerge props={{ noteId: note?.id }}>
            <MenuItem
              leftSection={
                <IconGitMerge size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
              }
            >
              Merge with...
            </MenuItem>
          </ModalMerge>

          <MenuDivider />

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
              onConfirm: () => {
                if (note) noteDelete({ values: note });
              },
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
