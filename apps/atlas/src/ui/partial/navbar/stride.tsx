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
import { useFolderActions, useStoreFolder, useSubView, useViewAside } from '@repo/store';
import React from 'react';
import LayoutPartialNavbar from '@atlas/ui/layout/partial/navbar';
import { useStoreTaskList } from '@repo/store';
import MenuTaskList from '@atlas/ui/menu/task-list';
import PartialEmpty from '../empty';
import NavlinkTaskList from '@atlas/ui/navlink/task-list';
import { Order } from '@repo/types';
import AccordionFolder from '@atlas/ui/accordion/folder';

export default function Stride() {
  const { subViewValue, showSubViewStride } = useSubView();
  const { showAsideViewStride } = useViewAside();

  const { folderCreate } = useFolderActions();
  const folders = useStoreFolder((s) => s.folders);
  const strideFolders = folders?.filter(
    (fi) => fi.location == APP_NAMES_ATLAS.STRIDE && !fi.parentFolder,
  );

  const taskLists = useStoreTaskList((s) => s.taskLists);
  const taskListsWithoutFolder = taskLists?.filter((ci) => !ci.folderId);
  const sortedNotes = sortArray(taskListsWithoutFolder || [], (i) => i.createdAt, Order.DESCENDING);

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
    <LayoutPartialNavbar>
      <Stack gap={'xs'}>
        <Box>
          {navLinks.map((nl, i) => {
            const active = nl.label.toLocaleLowerCase() == subViewValue;

            return (
              <React.Fragment key={nl.label}>
                {i > 0 && <Divider />}

                <NavLink
                  label={nl.label}
                  color="gray"
                  px={'xs'}
                  py={3}
                  fw={500}
                  styles={{
                    label: {
                      fontSize: 'var(--mantine-font-size-xs)',
                      color: active ? 'var(--mantine-color-pri-6)' : undefined,
                    },
                  }}
                  onClick={nl.action}
                  leftSection={
                    <div style={{ color: active ? 'var(--mantine-color-pri-6)' : undefined }}>
                      <nl.icon
                        size={ICON_SIZE - 4}
                        stroke={ICON_STROKE_WIDTH}
                        style={{ marginTop: 2 }}
                      />
                    </div>
                  }
                />
              </React.Fragment>
            );
          })}
        </Box>

        <div>
          <Group justify="space-between" pl={'xs'}>
            <Title order={2} fz={'sm'} fw={500} c={'dimmed'}>
              Task Lists
            </Title>

            <Group justify="end" gap={0}>
              <Tooltip label={`Add task list`}>
                <ActionIcon
                  size={30}
                  color="gray"
                  variant="subtle"
                  radius={0}
                  onClick={() => showAsideViewStride(ASIDE_VIEW_NAMES.NEW.STRIDE.TASK_LIST)}
                >
                  <IconTextPlus size={ICON_SIZE - 4} stroke={ICON_STROKE_WIDTH} />
                </ActionIcon>
              </Tooltip>

              <Tooltip label={`Add task list folder`}>
                <ActionIcon
                  size={30}
                  color="gray"
                  variant="subtle"
                  radius={0}
                  onClick={() => {
                    folderCreate({ id: generateUUID(), location: APP_NAMES_ATLAS.STRIDE });
                  }}
                >
                  <IconFolderPlus size={ICON_SIZE - 4} stroke={ICON_STROKE_WIDTH} />
                </ActionIcon>
              </Tooltip>
            </Group>
          </Group>

          <div>
            {strideFolders?.map((fi) => (
              <div key={fi.id}>
                <Divider />
                <AccordionFolder folderId={fi.id} location={APP_NAMES_ATLAS.STRIDE} />
              </div>
            ))}

            {taskLists === undefined || !taskLists?.length ? (
              <PartialEmpty loading={taskLists === undefined} label={`No task lists.`} />
            ) : (
              sortedNotes.map((tli) => (
                <React.Fragment key={tli.id}>
                  {<Divider />}
                  <NavlinkTaskList props={tli} />
                </React.Fragment>
              ))
            )}
          </div>
        </div>
      </Stack>
    </LayoutPartialNavbar>
  );
}
