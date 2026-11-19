'use client';

import { useNoteActions, useViewModal } from '@repo/store';
import {
  Menu,
  MenuTarget,
  MenuDropdown,
  MenuItem,
  MenuProps,
  MenuLabel,
  Text,
  MenuDivider,
  Tooltip,
  MenuContextMenu,
} from '@mantine/core';
import { APP_NAMES_ATLAS, ICON_SIZE, ICON_STROKE_WIDTH, MODAL_VIEW_NAMES } from '@repo/constants';
import { NoteGet } from '@repo/types';
import { IconCopy, IconEdit, IconFolderSymlink, IconTrash } from '@tabler/icons-react';

import { useBreakpointFlags } from '@repo/hooks';

export default function Note({
  defaultValues,
  options,
  children,
  ...restProps
}: {
  defaultValues: NoteGet;
  options?: { context?: boolean };
  children: React.ReactNode;
} & MenuProps) {
  const { ready, isMobile, isDesktop } = useBreakpointFlags();

  const { showModalViewNoteCrud } = useViewModal();
  const { noteCopy } = useNoteActions();

  const componentProps = { renderOption: options?.context ? MenuContextMenu : MenuTarget };

  if (!ready) {
    // Must not render wrong layout before client knows viewport
    return null;
  }

  return (
    <Menu
      width={220}
      trigger="click"
      position={isDesktop ? 'right-start' : undefined}
      styles={{
        item: {
          padding: isDesktop ? 6 : 10,
        },
        itemLabel: {
          fontWeight: 500,
          fontSize: isDesktop ? 'var(--mantine-font-size-xs)' : undefined,
        },
        itemSection: {
          color: 'dark',
        },
      }}
      {...restProps}
    >
      <componentProps.renderOption>
        <span>{children}</span>
      </componentProps.renderOption>

      <MenuDropdown>
        <MenuLabel p={isDesktop ? 6 : 10}>
          <Tooltip
            label={defaultValues.title}
            multiline
            maw={320}
            position="top-start"
            arrowOffset={16}
          >
            <Text inherit lineClamp={1} fz={{ base: 'md', md: 'xs' }}>
              {defaultValues.title}
            </Text>
          </Tooltip>
        </MenuLabel>

        <MenuDivider />

        <MenuItem
          leftSection={
            <IconEdit size={isDesktop ? ICON_SIZE - 4 : ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
          }
          onClick={() =>
            showModalViewNoteCrud(defaultValues.id, MODAL_VIEW_NAMES.CRUD.JOT.NOTE.UPDATE)
          }
        >
          Rename
        </MenuItem>

        <MenuItem
          leftSection={
            <IconCopy size={isDesktop ? ICON_SIZE - 4 : ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
          }
          onClick={() => noteCopy({ values: defaultValues })}
        >
          Make a copy
        </MenuItem>

        <MenuItem
          leftSection={
            <IconFolderSymlink
              size={isDesktop ? ICON_SIZE - 4 : ICON_SIZE}
              stroke={ICON_STROKE_WIDTH}
            />
          }
          onClick={() =>
            showModalViewNoteCrud(
              defaultValues.id,
              `${MODAL_VIEW_NAMES.CRUD.JOT.NOTE.MOVE}-${APP_NAMES_ATLAS.JOT}`,
            )
          }
        >
          Move to...
        </MenuItem>

        <MenuDivider />

        <MenuItem
          leftSection={
            <IconTrash size={isDesktop ? ICON_SIZE - 4 : ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
          }
          color="red"
          onClick={() =>
            showModalViewNoteCrud(defaultValues.id, MODAL_VIEW_NAMES.CRUD.JOT.NOTE.DELETE)
          }
        >
          Delete
        </MenuItem>
      </MenuDropdown>
    </Menu>
  );
}
