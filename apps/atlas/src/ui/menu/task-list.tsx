'use client';

import { useViewModal } from '@repo/store';
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
import { TaskListGet } from '@repo/types';
import { IconEdit, IconFolderSymlink, IconTrash } from '@tabler/icons-react';

export default function TaskList({
  defaultValues,
  options,
  children,
  ...restProps
}: {
  defaultValues: TaskListGet;
  options?: { context?: boolean };
  children: React.ReactNode;
} & MenuProps) {
  const { showModalViewTaskListCrud } = useViewModal();

  const componentProps = { renderOption: options?.context ? MenuContextMenu : MenuTarget };

  return (
    <Menu
      width={220}
      trigger="click"
      position="right-start"
      styles={{
        item: {
          height: 28,
          padding: 6,
        },
        itemLabel: {
          fontWeight: 500,
          fontSize: 'var(--mantine-font-size-xs)',
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
        <MenuLabel>
          <Tooltip
            label={defaultValues.title}
            multiline
            maw={320}
            position="top-start"
            arrowOffset={16}
          >
            <Text inherit lineClamp={1}>
              {defaultValues.title}
            </Text>
          </Tooltip>
        </MenuLabel>

        <MenuDivider />

        <MenuItem
          leftSection={<IconEdit size={ICON_SIZE - 4} stroke={ICON_STROKE_WIDTH} />}
          onClick={() =>
            showModalViewTaskListCrud(
              defaultValues.id,
              MODAL_VIEW_NAMES.CRUD.STRIDE.TASK_LIST.UPDATE,
            )
          }
        >
          Edit
        </MenuItem>

        <MenuItem
          leftSection={<IconFolderSymlink size={ICON_SIZE - 4} stroke={ICON_STROKE_WIDTH} />}
          onClick={() =>
            showModalViewTaskListCrud(
              defaultValues.id,
              `${MODAL_VIEW_NAMES.CRUD.STRIDE.TASK_LIST.MOVE}-${APP_NAMES_ATLAS.STRIDE}`,
            )
          }
        >
          Move to...
        </MenuItem>

        <MenuDivider />

        <MenuItem
          leftSection={<IconTrash size={ICON_SIZE - 4} stroke={ICON_STROKE_WIDTH} />}
          color="red"
          onClick={() =>
            showModalViewTaskListCrud(
              defaultValues.id,
              MODAL_VIEW_NAMES.CRUD.STRIDE.TASK_LIST.DELETE,
            )
          }
        >
          Delete
        </MenuItem>
      </MenuDropdown>
    </Menu>
  );
}
