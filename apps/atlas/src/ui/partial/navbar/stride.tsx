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
  ASIDE_VIEW_NAMES,
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
  SUBVIEW_NAMES,
} from '@repo/constants';
import { capitalizeWords, extractUuidFromParam, generateUUID } from '@repo/utils';
import {
  IconCalendarCancel,
  IconCalendarDown,
  IconCalendarShare,
  IconCircleCheck,
  IconCircleFilled,
  IconDots,
  IconInbox,
  IconListCheck,
  IconPlus,
} from '@tabler/icons-react';
import { useSubView, useViewAside } from '@repo/store';
import React from 'react';
import LayoutPartialNavbar from '@atlas/ui/layout/partial/navbar';
import { useStoreTaskList } from '@repo/store';
import MenuTaskList from '@atlas/ui/menu/task-list';
import PartialEmpty from '../empty';

export default function Stride() {
  const { subViewValue, showSubViewStride } = useSubView();
  const { showAsideViewStride } = useViewAside();
  const taskLists = useStoreTaskList((s) => s.taskLists);

  const navLinks = [
    {
      icon: IconInbox,
      label: capitalizeWords(SUBVIEW_NAMES.STRIDE.INBOX),
      action: () => showSubViewStride(SUBVIEW_NAMES.STRIDE.INBOX),
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
                    <nl.icon
                      size={ICON_SIZE - 4}
                      stroke={ICON_STROKE_WIDTH}
                      style={{ marginTop: 2 }}
                    />
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
                  <IconListCheck size={ICON_SIZE - 4} stroke={ICON_STROKE_WIDTH} />
                </ActionIcon>
              </Tooltip>
            </Group>
          </Group>

          <div>
            {taskLists === undefined || !taskLists?.length ? (
              <PartialEmpty loading={taskLists === undefined} label={`No task lists.`} />
            ) : (
              taskLists.map((tli, i) => {
                const taskListActive =
                  subViewValue?.includes('list: ') && extractUuidFromParam(subViewValue) == tli.id;

                return (
                  <React.Fragment key={tli.title}>
                    {<Divider />}

                    <Group gap={0} wrap="nowrap">
                      <NavLink
                        label={tli.title}
                        color="gray"
                        px={'xs'}
                        py={3}
                        fw={500}
                        leftSection={
                          <ThemeIcon size={ICON_SIZE - 4} variant="transparent" mt={4}>
                            <IconCircleFilled size={6} color={tli.color || 'pri'} />
                          </ThemeIcon>
                        }
                        styles={{
                          label: {
                            fontSize: 'var(--mantine-font-size-xs)',
                            color: !taskListActive ? undefined : 'var(--mantine-color-pri-6)',
                          },
                        }}
                        onClick={() => showSubViewStride(`list: ${tli.id}`)}
                      />

                      <MenuTaskList defaultValues={tli}>
                        <ActionIcon size={30} color="gray" variant="subtle" radius={0}>
                          <IconDots size={ICON_SIZE - 4} stroke={ICON_STROKE_WIDTH} />
                        </ActionIcon>
                      </MenuTaskList>
                    </Group>
                  </React.Fragment>
                );
              })
            )}
          </div>
        </div>
      </Stack>
    </LayoutPartialNavbar>
  );
}
