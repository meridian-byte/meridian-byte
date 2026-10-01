'use client';

import {
  Accordion,
  AccordionControl,
  AccordionItem,
  AccordionPanel,
  ActionIcon,
  Center,
  Divider,
  Group,
  Text,
  Tooltip,
} from '@mantine/core';
import { APP_NAMES_ATLAS, ICON_SIZE, ICON_STROKE_WIDTH } from '@repo/constants';
import {
  IconChevronDown,
  IconChevronRight,
  IconDots,
  IconFolderPlus,
  IconPlus,
} from '@tabler/icons-react';
import {
  useCalendarActions,
  useFolderActions,
  useNoteActions,
  useStoreCalendar,
  useStoreFolder,
  useStoreNote,
  useStoreTaskList,
  useSubView,
  useTaskListActions,
  useViewNavbar,
} from '@repo/store';
import { generateUUID } from '@repo/utils';
import NavlinkCalendar from '../navlink/calendar';
import NavlinkNote from '../navlink/note';
import NavlinkTaskList from '../navlink/task-list';
import MenuFolder from '../menu/folder';
import LayoutPartialNavbar from '../layout/partial/navbar';

export default function Folder({ folderId, location }: { folderId: string; location: string }) {
  const { subViewValue } = useSubView();
  const { navbarViewValue, setNavbarViewValue } = useViewNavbar();

  const folders = useStoreFolder((s) => s.folders);
  const { folderCreate } = useFolderActions();
  const calendars = useStoreCalendar((s) => s.calendars);
  const { calendarCreate } = useCalendarActions();
  const notes = useStoreNote((s) => s.notes);
  const { noteCreate } = useNoteActions();
  const taskLists = useStoreTaskList((s) => s.taskLists);
  const { taskListCreate } = useTaskListActions();

  const currentFolder = folders?.find((f) => f.id === folderId);

  if (!currentFolder) return null;

  // 1. Get child folders inside this folder
  const childFolders = folders?.filter((f) => f.parentFolder === folderId);

  let locationProps: {
    navLinkItems: any[];
    component: any | null;
    onAdd: () => void;
  } = {
    navLinkItems: [],
    component: null,
    onAdd: () => {},
  };

  switch (location) {
    case APP_NAMES_ATLAS.PAVE:
      locationProps = {
        navLinkItems: (calendars || []).filter((ci) => ci.folderId === folderId),
        component: NavlinkCalendar,
        onAdd: () => calendarCreate({ id: generateUUID(), folderId }),
      };
      break;
    case APP_NAMES_ATLAS.JOT:
      locationProps = {
        navLinkItems: (notes || []).filter((ni) => ni.folderId === folderId),
        component: NavlinkNote,
        onAdd: () => noteCreate({ id: generateUUID(), folderId }),
      };
      break;
    case APP_NAMES_ATLAS.STRIDE:
      locationProps = {
        navLinkItems: (taskLists || []).filter((ni) => ni.folderId === folderId),
        component: NavlinkTaskList,
        onAdd: () => taskListCreate({ id: generateUUID(), folderId }),
      };
      break;

    default:
      break;
  }

  // Select items list based on current app location
  let currentItems: any[] = [];
  if (location === APP_NAMES_ATLAS.PAVE) currentItems = calendars || [];
  if (location === APP_NAMES_ATLAS.JOT) currentItems = notes || [];
  if (location === APP_NAMES_ATLAS.STRIDE) currentItems = taskLists || [];

  // Determine if this folder or any nested child contains the active item
  const isActive = isFolderOrChildrenActive(
    currentFolder.id,
    folders || [],
    currentItems,
    subViewValue || '',
  );

  const props = {
    icon: (navbarViewValue || []).includes(currentFolder.id) ? IconChevronDown : IconChevronRight,
  };

  const hasContent =
    (childFolders && childFolders.length > 0) || locationProps.navLinkItems.length > 0;

  return (
    <Accordion
      order={3}
      value={navbarViewValue || []}
      onChange={(newValues) => setNavbarViewValue(newValues)}
      chevronIconSize={ICON_SIZE}
      chevron={null}
      multiple
      styles={{
        control: { height: 30, padding: 0, paddingLeft: '5px' },
        label: { fontSize: 'var(--mantine-font-size-xs)', fontWeight: '500', padding: '0' },
        content: { padding: 0 },
        item: { borderBottomWidth: 0 },
      }}
    >
      <AccordionItem key={currentFolder.id} value={currentFolder.id}>
        <AccordionControl icon={<props.icon size={ICON_SIZE} />}>
          <Group justify="space-between">
            <Text
              component="span"
              inherit
              c={isActive ? 'var(--mantine-color-pri-6)' : 'var(--mantine-color-text)'}
            >
              {currentFolder.name}
            </Text>

            <Group component={'span'} justify="end" gap={0}>
              <Tooltip label={`Add item in ${currentFolder.name}`}>
                <ActionIcon
                  component="span"
                  size={30}
                  radius={0}
                  color="gray"
                  variant="subtle"
                  onClick={(e) => {
                    e.stopPropagation();

                    // add item
                    locationProps.onAdd();

                    // Check if current folder is already expanded, if not, add it
                    const currentOpened = navbarViewValue || '';
                    if (!currentOpened.includes(folderId)) {
                      setNavbarViewValue([...currentOpened, folderId]);
                    }
                  }}
                >
                  <IconPlus size={ICON_SIZE - 4} stroke={ICON_STROKE_WIDTH} />
                </ActionIcon>
              </Tooltip>

              <Tooltip label={`Add sub-folder in ${currentFolder.name}`}>
                <ActionIcon
                  component="span"
                  size={30}
                  color="gray"
                  variant="subtle"
                  radius={0}
                  onClick={(e) => {
                    e.stopPropagation();
                    folderCreate({ id: generateUUID(), location, parentFolder: folderId });
                  }}
                >
                  <IconFolderPlus size={ICON_SIZE - 4} stroke={ICON_STROKE_WIDTH} />
                </ActionIcon>
              </Tooltip>

              <Tooltip label={`Edit ${currentFolder.name}`}>
                <MenuFolder defaultValues={currentFolder}>
                  <ActionIcon component="span" size={30} radius={0} color="gray" variant="subtle">
                    <IconDots size={ICON_SIZE - 4} />
                  </ActionIcon>
                </MenuFolder>
              </Tooltip>
            </Group>
          </Group>
        </AccordionControl>

        <AccordionPanel>
          <Divider />

          <LayoutPartialNavbar>
            {!hasContent ? (
              <Center fz={'xs'} ta={'center'} py={'md'}>
                <Text inherit>Folder empty</Text>
              </Center>
            ) : (
              <>
                {/* 2. Render nested child folders recursively */}
                {childFolders?.map((childFolder) => (
                  <div key={childFolder.id}>
                    <Folder folderId={childFolder.id} location={location} />
                    <Divider />
                  </div>
                ))}

                {/* 3. Render items in current folder level */}
                {locationProps.navLinkItems.map((nli: any) => (
                  <div key={nli.id}>
                    <locationProps.component props={nli} />
                  </div>
                ))}
              </>
            )}
          </LayoutPartialNavbar>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}

// Checks if a folder or any of its sub-folders contain an active calendar item
function isFolderOrChildrenActive(
  folderId: string,
  folders: any[],
  items: any[],
  activeItemId: string | undefined,
): boolean {
  if (!activeItemId) return false;

  // 1. Check direct items inside this folder
  const hasActiveItem = items.some(
    (item) => item.folderId === folderId && activeItemId.includes(item.id),
  );

  if (hasActiveItem) return true;

  // 2. Recursively check child folders
  return folders
    .filter((f) => f.parentFolder == folderId)
    .some((child) => isFolderOrChildrenActive(child.id, folders, items, activeItemId));
}
