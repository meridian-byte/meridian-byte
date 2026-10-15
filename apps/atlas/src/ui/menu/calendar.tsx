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
import { CalendarGet } from '@repo/types';
import { IconEdit, IconFolderSymlink, IconTrash } from '@tabler/icons-react';
import { useMediaQuery } from '@mantine/hooks';

export default function Calendar({
  defaultValues,
  options,
  children,
  ...restProps
}: {
  defaultValues: CalendarGet;
  options?: { context?: boolean };
  children: React.ReactNode;
} & MenuProps) {
  const desktop = useMediaQuery('(min-width: 62em)');

  const { showModalViewCalendarCrud } = useViewModal();

  const componentProps = { renderOption: options?.context ? MenuContextMenu : MenuTarget };

  return (
    <Menu
      width={220}
      trigger="click"
      position="right-start"
      styles={{
        item: {
          padding: desktop ? 6 : 10,
        },
        itemLabel: {
          fontWeight: 500,
          fontSize: desktop ? 'var(--mantine-font-size-xs)' : undefined,
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
        <MenuLabel p={desktop ? 6 : 10}>
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
            <IconEdit size={desktop ? ICON_SIZE - 4 : ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
          }
          onClick={() =>
            showModalViewCalendarCrud(defaultValues.id, MODAL_VIEW_NAMES.CRUD.PAVE.CALENDAR.UPDATE)
          }
        >
          Edit
        </MenuItem>

        <MenuItem
          leftSection={
            <IconFolderSymlink
              size={desktop ? ICON_SIZE - 4 : ICON_SIZE}
              stroke={ICON_STROKE_WIDTH}
            />
          }
          onClick={() =>
            showModalViewCalendarCrud(
              defaultValues.id,
              `${MODAL_VIEW_NAMES.CRUD.PAVE.CALENDAR.MOVE}-${APP_NAMES_ATLAS.PAVE}`,
            )
          }
        >
          Move to...
        </MenuItem>

        <MenuDivider />

        <MenuItem
          leftSection={
            <IconTrash size={desktop ? ICON_SIZE - 4 : ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
          }
          color="red"
          onClick={() =>
            showModalViewCalendarCrud(defaultValues.id, MODAL_VIEW_NAMES.CRUD.PAVE.CALENDAR.DELETE)
          }
        >
          Delete
        </MenuItem>
      </MenuDropdown>
    </Menu>
  );
}
