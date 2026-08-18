'use client';

import React, { useEffect, useState } from 'react';
import { TasksValue, useStoreTask, useStoreTaskList, useSubView } from '@repo/store';
import {
  Box,
  Button,
  Card,
  CheckboxCard,
  CheckboxIndicator,
  Divider,
  Group,
  Stack,
  Text,
  ThemeIcon,
  Title,
  useMantineTheme,
} from '@mantine/core';
import {
  capitalizeWords,
  extractUuidFromParam,
  getRegionalDate,
  isOverdue,
  isToday,
  isWithinNext7Days,
} from '@repo/utils';
import { LayoutSection } from '@repo/ui';
import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
  SECTION_SPACING,
  SUBVIEW_NAMES,
} from '@repo/constants';
import {
  IconCalendarEvent,
  IconCategory,
  IconCircleFilled,
  IconFlag,
  IconPlus,
} from '@tabler/icons-react';
import { TaskGet } from '@repo/types';
import FormTask from '@atlas/ui/form/task';

export default function TaskList() {
  const taskLists = useStoreTaskList((s) => s.taskLists);
  const tasks = useStoreTask((s) => s.tasks);
  const { subViewValue } = useSubView();

  if (subViewValue === undefined || subViewValue === null) return <>loading</>;

  // handle title

  let title = subViewValue;

  const taskListId = extractUuidFromParam(subViewValue);

  if (taskListId) {
    const taskList = taskLists?.find((tli) => tli.id == taskListId);
    if (taskList) title = taskList.title;
  }

  // handle task filtering
  let filteredTasks: TasksValue = undefined;

  const isTaskList = subViewValue?.includes('list: ');

  if (isTaskList) {
    filteredTasks = tasks?.filter((ti) => ti.taskListId && ti.taskListId == taskListId);
  } else {
    switch (subViewValue) {
      case SUBVIEW_NAMES.STRIDE.INBOX:
        filteredTasks = tasks?.filter((ti) => !ti.taskListId);
        break;
      case SUBVIEW_NAMES.STRIDE.TODAY:
        filteredTasks = tasks?.filter((ti) => ti.dueDate && isToday(ti.dueDate));
        break;
      case SUBVIEW_NAMES.STRIDE.UPCOMING:
        filteredTasks = tasks?.filter((ti) => ti.dueDate && isWithinNext7Days(ti.dueDate));
        break;
      case SUBVIEW_NAMES.STRIDE.OVERDUE:
        filteredTasks = tasks?.filter((ti) => ti.dueDate && isOverdue(ti.dueDate));
        break;
      case SUBVIEW_NAMES.STRIDE.COMPLETE:
        filteredTasks = tasks?.filter((ti) => ti.complete);
        break;
      default:
        filteredTasks = tasks;
        break;
    }
  }

  return (
    <LayoutSection id={'task-list'} containerized>
      <Stack py={SECTION_SPACING}>
        <Group>
          <Title order={1} fz={'xl'}>
            {capitalizeWords(title)}
          </Title>
        </Group>

        <div>
          {filteredTasks?.map((ftli, i) => (
            <div key={ftli.id}>
              {i > 0 && <Divider />}
              <TaskCard props={ftli} />
            </div>
          ))}

          <AddTask />
        </div>
      </Stack>
    </LayoutSection>
  );
}

function TaskCard({ props, options }: { props?: TaskGet; options?: { add?: boolean } }) {
  const [checked, setChecked] = useState(false);
  const taskList = useStoreTaskList((s) => s.taskLists?.find((tli) => tli.id == props?.taskListId));
  const circleIcon = <IconCircleFilled size={4} />;

  return (
    <Box
      style={{
        transition: '.25s all ease',
        cursor: 'pointer',
        borderRadius: 'var(--mantine-radius-md)',
        overflow: 'hidden',
      }}
      className="hover:bg-[light-dark(var(--mantine-color-gray-1),var(--mantine-color-dark-8))]"
    >
      <Card withBorder={false} bg={'transparent'} radius={0}>
        <Group wrap="nowrap" align="flex-start">
          <Box mt={2}>
            {options?.add ? (
              <ThemeIcon color={'pri'} variant="light" radius={99} size={20}>
                <IconPlus size={18} stroke={ICON_STROKE_WIDTH} />
              </ThemeIcon>
            ) : (
              <CheckboxIndicator
                onClick={() => setChecked((c) => !c)}
                checked={checked}
                radius={99}
              />
            )}
          </Box>

          <Stack gap={5}>
            <Text inherit fw={500} c={options?.add ? 'pri' : undefined}>
              {options?.add ? 'Add task' : props?.title}
            </Text>

            {!options?.add && (
              <Group gap={'xs'} fz={'xs'} c={'dimmed'}>
                {taskList && (
                  <Group gap={5}>
                    <IconCategory size={ICON_SIZE - 6} stroke={2} />
                    <Text inherit>{taskList.title}</Text>
                  </Group>
                )}

                {taskList && props?.dueDate && circleIcon}

                {props?.dueDate && (
                  <Group gap={5}>
                    <IconCalendarEvent size={ICON_SIZE - 6} stroke={2} />
                    <Text inherit>{getRegionalDate(props?.dueDate).date}</Text>
                  </Group>
                )}

                {((props?.dueDate && props?.priority) || (taskList && props?.priority)) &&
                  circleIcon}

                {props?.priority && (
                  <Group gap={5}>
                    <IconFlag size={ICON_SIZE - 6} stroke={2} />
                    <Text inherit>{capitalizeWords(props?.priority)}</Text>
                  </Group>
                )}
              </Group>
            )}
          </Stack>
        </Group>
      </Card>
    </Box>
  );
}

export function AddTask() {
  const [adding, setAdding] = useState(false);
  const { subViewValue } = useSubView();

  useEffect(() => {
    setAdding(false);
  }, [subViewValue]);

  return (
    <Box display={subViewValue === SUBVIEW_NAMES.STRIDE.OVERDUE ? 'none' : undefined}>
      <Divider variant="dashed" display={!adding ? undefined : 'none'} />

      {adding && (
        <Card
          px={15}
          py={'xs'}
          // bg={'light-dark(var(--mantine-color-gray-1), var(--mantine-color-dark-8))'}
          bg={'transparent'}
          withBorder
        >
          <FormTask onUnmount={setAdding} />
        </Card>
      )}

      <Box display={!adding ? undefined : 'none'} onClick={() => setAdding(true)}>
        <TaskCard options={{ add: true }} />
      </Box>
    </Box>
  );
}
