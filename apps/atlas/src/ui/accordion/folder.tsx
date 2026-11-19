'use client';

import {
  Accordion,
  AccordionControl,
  AccordionItem,
  AccordionPanel,
  ActionIcon,
  Box,
  Center,
  Divider,
  Group,
  NavLink,
  Text,
  ThemeIcon,
  Tooltip,
} from '@mantine/core';
import { APP_NAMES_ATLAS, ICON_SIZE, ICON_STROKE_WIDTH, ICON_WRAPPER_SIZE } from '@repo/constants';
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
import { generateUUID, sortArray } from '@repo/utils';
import NavlinkCalendar from '../navlink/calendar';
import NavlinkNote from '../navlink/note';
import NavlinkTaskList from '../navlink/task-list';
import MenuFolder from '../menu/folder';
import LayoutPartialNavbar from '../layout/partial/navbar';
import { Order } from '@repo/types';
import { useMediaQuery } from '@mantine/hooks';
import { useBreakpointFlags } from '@repo/hooks';
import { memo, useCallback, useMemo } from 'react';

const EMPTY_ARRAY: any[] = [];

const Folder = memo(function Folder({
  folderId,
  location,
}: {
  folderId: string;
  location: string;
}) {
  const { ready, isDesktop } = useBreakpointFlags();

  const { subViewValue } = useSubView();
  const { navbarViewValue, setNavbarViewValue } = useViewNavbar();

  const folders = useStoreFolder((s) => s.folders) ?? EMPTY_ARRAY;
  const { folderCreate } = useFolderActions();

  const calendars = useStoreCalendar((s) => s.calendars) ?? EMPTY_ARRAY;
  const { calendarCreate } = useCalendarActions();

  const notes = useStoreNote((s) => s.notes) ?? EMPTY_ARRAY;
  const { noteCreate } = useNoteActions();

  const taskLists = useStoreTaskList((s) => s.taskLists) ?? EMPTY_ARRAY;
  const { taskListCreate } = useTaskListActions();

  const currentFolder = useMemo(() => folders.find((f) => f.id === folderId), [folders, folderId]);

  const currentItems = useMemo(() => {
    switch (location) {
      case APP_NAMES_ATLAS.PAVE:
        return calendars;
      case APP_NAMES_ATLAS.JOT:
        return notes;
      case APP_NAMES_ATLAS.STRIDE:
        return taskLists;
      default:
        return EMPTY_ARRAY;
    }
  }, [location, calendars, notes, taskLists]);

  const NavLinkItemComponent = useMemo(() => {
    switch (location) {
      case APP_NAMES_ATLAS.PAVE:
        return NavlinkCalendar;
      case APP_NAMES_ATLAS.JOT:
        return NavlinkNote;
      case APP_NAMES_ATLAS.STRIDE:
        return NavlinkTaskList;
      default:
        return null;
    }
  }, [location]);

  const handleAddItem = useCallback(() => {
    switch (location) {
      case APP_NAMES_ATLAS.PAVE:
        calendarCreate({ id: generateUUID(), folderId });
        break;
      case APP_NAMES_ATLAS.JOT:
        noteCreate({ id: generateUUID(), folderId });
        break;
      case APP_NAMES_ATLAS.STRIDE:
        taskListCreate({ id: generateUUID(), folderId });
        break;
    }
  }, [location, folderId, calendarCreate, noteCreate, taskListCreate]);

  const sortedChildFolders = useMemo(() => {
    const filtered = folders.filter((f) => f.folderId === folderId);
    return sortArray(filtered, (i) => i.createdAt, Order.DESCENDING);
  }, [folders, folderId]);

  const sortedNavLinkItems = useMemo(() => {
    const filtered = currentItems.filter((item) => item.folderId === folderId);
    return sortArray(filtered, (i) => i.createdAt, Order.DESCENDING);
  }, [currentItems, folderId]);

  const isActive = useMemo(
    () => isFolderOrChildrenActive(folderId, folders, currentItems, subViewValue || ''),
    [folderId, folders, currentItems, subViewValue],
  );

  const accordionValue = navbarViewValue ?? EMPTY_ARRAY;
  const isExpanded = accordionValue.includes(folderId);
  const ChevronIcon = isExpanded ? IconChevronDown : IconChevronRight;
  const hasContent = sortedChildFolders.length > 0 || sortedNavLinkItems.length > 0;

  const ensureFolderExpanded = useCallback(() => {
    const currentOpened = navbarViewValue ?? [];
    if (!currentOpened.includes(folderId)) {
      setNavbarViewValue([...currentOpened, folderId]);
    }
  }, [navbarViewValue, folderId, setNavbarViewValue]);

  if (!ready || !currentFolder) {
    return null;
  }

  return (
    <Accordion
      order={3}
      value={accordionValue}
      onChange={setNavbarViewValue}
      chevronIconSize={ICON_SIZE}
      chevron={null}
      multiple
      styles={{
        control: {
          height: isDesktop ? 30 : 'fit-content',
          padding: 0,
          paddingLeft: 0,
          borderRadius: 'var(--mantine-radius-md)',
          transition: 'background-color 200ms ease, color 150ms ease',
        },
        label: { padding: 0 },
        content: { padding: 0 },
        item: { borderBottomWidth: 0 },
        icon: { marginInlineEnd: 0 },
      }}
    >
      <AccordionItem
        key={currentFolder.id}
        value={currentFolder.id}
        className="group/accordionFolder"
      >
        <MenuFolder defaultValues={currentFolder} options={{ context: true }} location={location}>
          <AccordionControl>
            <NavLink
              label={
                <Tooltip
                  label={currentFolder.name}
                  multiline
                  maw={320}
                  position="top-start"
                  arrowOffset={16}
                >
                  <Text component="span" inherit lineClamp={1} lh={2}>
                    {currentFolder.name}
                  </Text>
                </Tooltip>
              }
              color="gray"
              p={isDesktop ? 0 : undefined}
              fw={600}
              styles={{
                section: isDesktop ? { marginInlineEnd: 0 } : undefined,
                label: {
                  fontSize: isDesktop ? 'var(--mantine-font-size-xs)' : undefined,
                  color: isActive ? 'var(--mantine-color-pri-6)' : undefined,
                },
              }}
              leftSection={
                <ThemeIcon
                  size={isDesktop ? 30 : ICON_WRAPPER_SIZE}
                  variant="transparent"
                  color="gray"
                >
                  <ChevronIcon
                    size={isDesktop ? ICON_SIZE - 4 : ICON_SIZE}
                    stroke={ICON_STROKE_WIDTH}
                  />
                </ThemeIcon>
              }
              rightSection={
                <Group
                  component="span"
                  justify="end"
                  gap={0}
                  className={
                    isDesktop
                      ? 'opacity-0 group-hover/accordionFolder:opacity-100 transition-opacity duration-200 pointer-events-none group-hover/accordionFolder:pointer-events-auto'
                      : undefined
                  }
                  mih={30}
                  pr={4}
                  visibleFrom="md"
                >
                  <Tooltip label={`Add item in ${currentFolder.name}`}>
                    <ActionIcon
                      component="span"
                      size={30 - 6}
                      color="gray"
                      variant="subtle"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddItem();
                        ensureFolderExpanded();
                      }}
                    >
                      <IconPlus size={ICON_SIZE - 4} stroke={ICON_STROKE_WIDTH} />
                    </ActionIcon>
                  </Tooltip>

                  <Tooltip label={`Add sub-folder in ${currentFolder.name}`}>
                    <ActionIcon
                      component="span"
                      size={30 - 6}
                      color="gray"
                      variant="subtle"
                      onClick={(e) => {
                        e.stopPropagation();
                        folderCreate({ id: generateUUID(), location, folderId });
                        ensureFolderExpanded();
                      }}
                    >
                      <IconFolderPlus size={ICON_SIZE - 4} stroke={ICON_STROKE_WIDTH} />
                    </ActionIcon>
                  </Tooltip>

                  <Tooltip label={`Edit ${currentFolder.name}`}>
                    <MenuFolder defaultValues={currentFolder} location={location}>
                      <ActionIcon component="span" size={30 - 6} color="gray" variant="subtle">
                        <IconDots size={ICON_SIZE - 4} />
                      </ActionIcon>
                    </MenuFolder>
                  </Tooltip>
                </Group>
              }
            />
          </AccordionControl>
        </MenuFolder>

        <AccordionPanel>
          <LayoutPartialNavbar options={{ folder: true }}>
            {!hasContent ? (
              <Center fz="xs" ta="center" py="md">
                <Text inherit>Folder empty</Text>
              </Center>
            ) : (
              <>
                {sortedChildFolders.map((childFolder) => (
                  <div key={childFolder.id}>
                    <Folder folderId={childFolder.id} location={location} />
                  </div>
                ))}

                {NavLinkItemComponent &&
                  sortedNavLinkItems.map((nli: any) => (
                    <div key={nli.id}>
                      <NavLinkItemComponent props={nli} />
                    </div>
                  ))}
              </>
            )}
          </LayoutPartialNavbar>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
});

export default Folder;

// Checks if a folder or any of its sub-folders contain an active item
function isFolderOrChildrenActive(
  folderId: string,
  folders: any[],
  items: any[],
  activeItemId: string | undefined,
): boolean {
  if (!activeItemId) return false;

  const hasActiveItem = items.some(
    (item) => item.folderId === folderId && activeItemId.includes(item.id),
  );
  if (hasActiveItem) return true;

  return folders
    .filter((f) => f.folderId === folderId)
    .some((child) => isFolderOrChildrenActive(child.id, folders, items, activeItemId));
}
