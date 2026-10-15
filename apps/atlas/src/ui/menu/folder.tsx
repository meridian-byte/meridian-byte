'use client';

import {
  useCalendarActions,
  useFolderActions,
  useNoteActions,
  useTaskListActions,
  useViewModal,
  useViewNavbar,
} from '@repo/store';
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
import { FolderGet } from '@repo/types';
import {
  IconEdit,
  IconFolderPlus,
  IconFolderSymlink,
  IconPlus,
  IconTrash,
} from '@tabler/icons-react';
import { useMediaQuery } from '@mantine/hooks';
import { generateUUID } from '@repo/utils';

export default function Folder({
  defaultValues,
  options,
  children,
  location,
  ...restProps
}: {
  defaultValues: FolderGet;
  options?: { context?: boolean };
  location: string;
  children: React.ReactNode;
} & MenuProps) {
  const desktop = useMediaQuery('(min-width: 62em)');

  const { showModalViewFolderCrud } = useViewModal();

  const { navbarViewValue, setNavbarViewValue } = useViewNavbar();

  const componentProps = { renderOption: options?.context ? MenuContextMenu : MenuTarget };

  const { folderCreate } = useFolderActions();
  const { calendarCreate } = useCalendarActions();
  const { noteCreate } = useNoteActions();
  const { taskListCreate } = useTaskListActions();

  let locationProps: {
    onAddFolder: () => void;
    onAddItem: () => void;
  } = {
    onAddFolder: () => {},
    onAddItem: () => {},
  };

  switch (location) {
    case APP_NAMES_ATLAS.PAVE:
      locationProps = {
        onAddFolder: () =>
          folderCreate({
            id: generateUUID(),
            location,
            folderId: defaultValues.id,
          }),
        onAddItem: () => calendarCreate({ id: generateUUID(), folderId: defaultValues.id }),
      };
      break;
    case APP_NAMES_ATLAS.JOT:
      locationProps = {
        onAddFolder: () =>
          folderCreate({
            id: generateUUID(),
            location,
            folderId: defaultValues.id,
          }),
        onAddItem: () => noteCreate({ id: generateUUID(), folderId: defaultValues.id }),
      };
      break;
    case APP_NAMES_ATLAS.STRIDE:
      locationProps = {
        onAddFolder: () =>
          folderCreate({
            id: generateUUID(),
            location,
            folderId: defaultValues.id,
          }),
        onAddItem: () => taskListCreate({ id: generateUUID(), folderId: defaultValues.id }),
      };
      break;

    default:
      break;
  }

  return (
    <Menu
      width={220}
      trigger="click"
      position={desktop ? 'right-start' : undefined}
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
        <span
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {children}
        </span>
      </componentProps.renderOption>

      <MenuDropdown>
        <MenuLabel p={desktop ? 6 : 10}>
          <Tooltip
            label={defaultValues.name}
            multiline
            maw={320}
            position="top-start"
            arrowOffset={16}
          >
            <Text inherit lineClamp={1} fz={{ base: 'md', md: 'xs' }}>
              {defaultValues.name}
            </Text>
          </Tooltip>
        </MenuLabel>

        <MenuDivider />

        <MenuItem
          leftSection={
            <IconPlus size={desktop ? ICON_SIZE - 4 : ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
          }
          onClick={(e) => {
            e.stopPropagation();

            // add item
            locationProps.onAddItem();

            // Check if current folder is already expanded, if not, add it
            const currentOpened = navbarViewValue || '';
            if (!currentOpened.includes(defaultValues.id)) {
              setNavbarViewValue([...currentOpened, defaultValues.id]);
            }
          }}
        >
          <Tooltip
            label={`Add item in ${defaultValues.name}`}
            multiline
            maw={320}
            position="top-start"
            arrowOffset={16}
          >
            <Text component="span" inherit lineClamp={1} lh={2}>
              Add item in {defaultValues.name}
            </Text>
          </Tooltip>
        </MenuItem>

        <MenuItem
          leftSection={
            <IconFolderPlus size={desktop ? ICON_SIZE - 4 : ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
          }
          onClick={(e) => {
            e.stopPropagation();

            // add folder
            locationProps.onAddFolder();

            // Check if current folder is already expanded, if not, add it
            const currentOpened = navbarViewValue || '';
            if (!currentOpened.includes(defaultValues.id)) {
              setNavbarViewValue([...currentOpened, defaultValues.id]);
            }
          }}
        >
          <Tooltip
            label={`Add folder in ${defaultValues.name}`}
            multiline
            maw={320}
            position="top-start"
            arrowOffset={16}
          >
            <Text component="span" inherit lineClamp={1} lh={2}>
              Add folder in {defaultValues.name}
            </Text>
          </Tooltip>
        </MenuItem>

        <MenuDivider />

        <MenuItem
          leftSection={
            <IconEdit size={desktop ? ICON_SIZE - 4 : ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
          }
          onClick={(e) => {
            e.stopPropagation();
            showModalViewFolderCrud(defaultValues.id, MODAL_VIEW_NAMES.CRUD.FOLDER.UPDATE);
          }}
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
          onClick={(e) => {
            e.stopPropagation();
            showModalViewFolderCrud(
              defaultValues.id,
              `${MODAL_VIEW_NAMES.CRUD.FOLDER.MOVE}-${defaultValues.location}`,
            );
          }}
        >
          Move to...
        </MenuItem>

        <MenuDivider />

        <MenuItem
          leftSection={
            <IconTrash size={desktop ? ICON_SIZE - 4 : ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
          }
          color="red"
          onClick={(e) => {
            e.stopPropagation();
            showModalViewFolderCrud(defaultValues.id, MODAL_VIEW_NAMES.CRUD.FOLDER.DELETE);
          }}
        >
          Delete
        </MenuItem>
      </MenuDropdown>
    </Menu>
  );
}
