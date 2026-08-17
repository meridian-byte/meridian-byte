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
} from '@mantine/core';
import { ICON_SIZE, ICON_STROKE_WIDTH, MODAL_VIEW_NAMES } from '@repo/constants';
import { TaskListGet } from '@repo/types';
import { IconEdit, IconTrash } from '@tabler/icons-react';

export default function TaskList({
  defaultValues,
  children,
  ...restProps
}: { defaultValues: TaskListGet; children: React.ReactNode } & MenuProps) {
  const { showModalViewTaskListCrud } = useViewModal();

  return (
    <Menu
      width={200}
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
      <MenuTarget>
        <div>{children}</div>
      </MenuTarget>

      <MenuDropdown>
        <MenuLabel>
          <Text inherit lineClamp={1}>
            {defaultValues.title}
          </Text>
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
