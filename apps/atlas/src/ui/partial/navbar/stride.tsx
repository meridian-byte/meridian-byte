'use client';

import {
  ActionIcon,
  Box,
  Divider,
  Group,
  Loader,
  NavLink,
  Stack,
  Text,
  ThemeIcon,
  Title,
  Tooltip,
} from '@mantine/core';
import {
  APP_NAMES_ATLAS,
  ASIDE_VIEW_NAMES,
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
  SUBVIEW_NAMES,
} from '@repo/constants';
import { capitalizeWords, extractUuidFromParam, generateUUID, sortArray } from '@repo/utils';
import {
  IconCalendarCancel,
  IconCalendarDown,
  IconCalendarShare,
  IconCircleCheck,
  IconCircleFilled,
  IconDots,
  IconFolderPlus,
  IconInbox,
  IconListCheck,
  IconPlus,
  IconTextPlus,
} from '@tabler/icons-react';
import {
  useFolderActions,
  useStoreAppShell,
  useStoreFolder,
  useSubView,
  useTaskListActions,
  useViewAside,
} from '@repo/store';
import React from 'react';
import LayoutPartialNavbar from '@atlas/ui/layout/partial/navbar';
import { useStoreTaskList } from '@repo/store';
import MenuTaskList from '@atlas/ui/menu/task-list';
import PartialEmpty from '../empty';
import NavlinkTaskList from '@atlas/ui/navlink/task-list';
import { Order } from '@repo/types';
import AccordionFolder from '@atlas/ui/accordion/folder';
import { useMediaQuery } from '@mantine/hooks';

export default function Stride() {
  const desktop = useMediaQuery('(min-width: 62em)');

  const navbarActive = useStoreAppShell((s) => s.appshell?.child?.navbar);
  const toggleNavbarChild = useStoreAppShell((s) => s.toggleNavbarChild);

  const { subViewValue, showSubViewStride } = useSubView();
  const { showAsideViewStride } = useViewAside();

  const folders = useStoreFolder((s) => s.folders);
  const { folderCreate } = useFolderActions();
  const strideFolders = folders?.filter(
    (fi) => fi.location == APP_NAMES_ATLAS.STRIDE && !fi.folderId,
  );

  const taskLists = useStoreTaskList((s) => s.taskLists);
  const { taskListCreate } = useTaskListActions();
  const taskListsWithoutFolder = taskLists?.filter((ci) => !ci.folderId);

  const navLinks = [
    {
      icon: IconInbox,
      label: capitalizeWords(SUBVIEW_NAMES.STRIDE.INBOX),
      action: () => showSubViewStride(SUBVIEW_NAMES.STRIDE.INBOX),
    },
    {
      icon: IconListCheck,
      label: capitalizeWords(SUBVIEW_NAMES.STRIDE.ALL),
      action: () => showSubViewStride(SUBVIEW_NAMES.STRIDE.ALL),
    },
    {
      icon: IconCalendarDown,
      label: capitalizeWords(SUBVIEW_NAMES.STRIDE.TODAY),
      action: () => showSubViewStride(SUBVIEW_NAMES.STRIDE.TODAY),
    },
    {
      icon: IconCalendarShare,
      label: capitalizeWords(SUBVIEW_NAMES.STRIDE.UPCOMING),
      action: () => showSubViewStride(SUBVIEW_NAMES.STRIDE.UPCOMING),
    },
    {
      icon: IconCalendarCancel,
      label: capitalizeWords(SUBVIEW_NAMES.STRIDE.OVERDUE),
      action: () => showSubViewStride(SUBVIEW_NAMES.STRIDE.OVERDUE),
    },
    {
      icon: IconCircleCheck,
      label: capitalizeWords(SUBVIEW_NAMES.STRIDE.COMPLETE),
      action: () => showSubViewStride(SUBVIEW_NAMES.STRIDE.COMPLETE),
    },
  ];

  return (
    <div>
      <div>
        {navLinks.map((nl, i) => {
          const active = nl.label.toLocaleLowerCase() == subViewValue;

          return (
            <React.Fragment key={nl.label}>
              {/* {i > 0 && <Divider />} */}

              <NavLink
                label={nl.label}
                color="gray"
                p={desktop ? 0 : undefined}
                fw={600}
                styles={{
                  section: desktop ? { marginInlineEnd: 0 } : undefined,
                  body: { marginBottom: 4 },
                  label: {
                    fontSize: desktop ? 'var(--mantine-font-size-xs)' : undefined,
                    color: active ? 'var(--mantine-color-pri-6)' : undefined,
                  },
                }}
                onClick={() => {
                  if (!desktop) {
                    if (navbarActive) toggleNavbarChild();
                  }

                  nl.action();
                }}
                leftSection={
                  <ThemeIcon
                    size={desktop ? 30 : ICON_WRAPPER_SIZE}
                    variant="transparent"
                    color={active ? 'var(--mantine-color-pri-6)' : 'gray'}
                  >
                    <nl.icon
                      size={desktop ? ICON_SIZE - 4 : ICON_SIZE}
                      stroke={ICON_STROKE_WIDTH}
                    />
                  </ThemeIcon>
                }
              />
            </React.Fragment>
          );
        })}
      </div>

      <div className="group/strideLists">
        <Group justify="space-between" align="end" pl={desktop ? 5 : 12 + 5} mt={5}>
          <Title order={2} fz={{ base: 'lg', md: '.8rem' }} fw={500} c={'dimmed'}>
            Task Lists
          </Title>

          <Group
            justify="end"
            gap={desktop ? 0 : 5}
            className={
              desktop
                ? 'opacity-0 group-hover/strideLists:opacity-100 transition-opacity duration-250 pointer-events-none group-hover/strideLists:pointer-events-auto'
                : undefined
            }
            mih={desktop ? 30 : ICON_WRAPPER_SIZE * 1.25 + 6}
            pr={5}
          >
            <Tooltip label={`Add task list`}>
              <ActionIcon
                size={desktop ? 30 - 6 : ICON_WRAPPER_SIZE * 1.25}
                color="gray"
                variant={desktop ? 'subtle' : 'light'}
                onClick={() => taskListCreate()}
              >
                <IconPlus
                  size={desktop ? ICON_SIZE - 4 : ICON_SIZE * 1.25}
                  stroke={ICON_STROKE_WIDTH}
                />
              </ActionIcon>
            </Tooltip>

            <Tooltip label={`Add task list folder`}>
              <ActionIcon
                size={desktop ? 30 - 6 : ICON_WRAPPER_SIZE * 1.25}
                color="gray"
                variant={desktop ? 'subtle' : 'light'}
                onClick={() => {
                  folderCreate({ id: generateUUID(), location: APP_NAMES_ATLAS.STRIDE });
                }}
              >
                <IconFolderPlus
                  size={desktop ? ICON_SIZE - 4 : ICON_SIZE * 1.25}
                  stroke={ICON_STROKE_WIDTH}
                />
              </ActionIcon>
            </Tooltip>
          </Group>
        </Group>

        <Box mih={220}>
          <Divider my={5} />

          {sortArray(strideFolders || [], (i) => i.createdAt, Order.DESCENDING)?.map((fi) => (
            <div key={fi.id}>
              <AccordionFolder folderId={fi.id} location={APP_NAMES_ATLAS.STRIDE} />
            </div>
          ))}

          {taskLists === undefined || !taskLists?.length ? (
            <PartialEmpty loading={taskLists === undefined} label={`No task lists.`} />
          ) : (
            sortArray(taskListsWithoutFolder || [], (i) => i.createdAt, Order.DESCENDING).map(
              (tli) => (
                <div key={tli.id}>
                  <NavlinkTaskList props={tli} />
                </div>
              ),
            )
          )}
        </Box>
      </div>
    </div>
  );
}
