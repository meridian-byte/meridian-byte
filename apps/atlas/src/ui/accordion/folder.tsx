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
import { IconChevronDown, IconChevronRight, IconDots, IconPlus } from '@tabler/icons-react';
import {
  useCalendarActions,
  useNoteActions,
  useStoreCalendar,
  useStoreFolder,
  useStoreNote,
  useStoreTaskList,
  useTaskListActions,
  useViewNavbar,
} from '@repo/store';
import { generateUUID } from '@repo/utils';
import NavlinkCalendar from '../navlink/calendar';
import NavlinkNote from '../navlink/note';
import NavlinkTaskList from '../navlink/task-list';
import MenuFolder from '../menu/folder';

export default function Folder({ folderId, location }: { folderId: string; location: string }) {
  const { navbarViewValue, setNavbarViewValue } = useViewNavbar();

  const folders = useStoreFolder((s) => s.folders);

  const calendars = useStoreCalendar((s) => s.calendars);
  const { calendarCreate } = useCalendarActions();
  const notes = useStoreNote((s) => s.notes);
  const { noteCreate } = useNoteActions();
  const taskLists = useStoreTaskList((s) => s.taskLists);
  const { taskListCreate } = useTaskListActions();

  const currentFolder = folders?.find((f) => f.id === folderId);
  if (!currentFolder) return null;

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
        navLinkItems: (calendars || []).filter((ci) => ci.folderId == folderId),
        component: NavlinkCalendar,
        onAdd: () => calendarCreate({ id: generateUUID(), folderId }),
      };
      break;
    case APP_NAMES_ATLAS.JOT:
      locationProps = {
        navLinkItems: (notes || []).filter((ni) => ni.folderId == folderId),
        component: NavlinkNote,
        onAdd: () => noteCreate({ id: generateUUID(), folderId }),
      };
      break;
    case APP_NAMES_ATLAS.STRIDE:
      locationProps = {
        navLinkItems: (taskLists || []).filter((ni) => ni.folderId == folderId),
        component: NavlinkTaskList,
        onAdd: () => taskListCreate({ id: generateUUID(), folderId }),
      };
      break;

    default:
      break;
  }

  const props = {
    icon: (navbarViewValue || []).includes(currentFolder.id) ? IconChevronDown : IconChevronRight,
  };

  return (
    <Accordion
      order={3}
      value={navbarViewValue || []}
      onChange={(newValues) => setNavbarViewValue(newValues)}
      chevronIconSize={ICON_SIZE}
      chevron={null}
      // keepMounted
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
            <Text component="span" inherit c={'var(--mantine-color-text)'}>
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
                    locationProps.onAdd();
                  }}
                >
                  <IconPlus size={ICON_SIZE - 4} stroke={ICON_STROKE_WIDTH} />
                </ActionIcon>
              </Tooltip>

              <Tooltip label={`Edit ${currentFolder.name}`}>
                <MenuFolder defaultValues={currentFolder}>
                  <ActionIcon
                    component="span"
                    size={30}
                    radius={0}
                    color="gray"
                    variant="subtle"
                    // onClick={(e) => {
                    //   e.stopPropagation();
                    // }}
                  >
                    <IconDots size={ICON_SIZE - 4} />
                  </ActionIcon>
                </MenuFolder>
              </Tooltip>
            </Group>
          </Group>
        </AccordionControl>

        <AccordionPanel pl={15}>
          <Divider />

          {!locationProps.navLinkItems.length ? (
            <Center fz={'xs'} ta={'center'} py={'md'}>
              <Text inherit>Folder empty</Text>
            </Center>
          ) : (
            locationProps.navLinkItems.map((nli: any) => (
              <div key={nli.id}>
                <locationProps.component props={nli} />
              </div>
            ))
          )}
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}
