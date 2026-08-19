'use client';

import React, { useEffect, useState } from 'react';
import { TasksValue, useStoreTask, useStoreTaskList, useSubView, useViewModal } from '@repo/store';
import {
  Box,
  Button,
  Card,
  Center,
  Checkbox,
  CheckboxCard,
  CheckboxIndicator,
  Divider,
  Grid,
  GridCol,
  Group,
  Loader,
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
  sortArray,
} from '@repo/utils';
import { LayoutSection } from '@repo/ui';
import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
  MODAL_VIEW_NAMES,
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
import { Order, TaskGet } from '@repo/types';
import FormTask from '@atlas/ui/form/task';
import { useFormTask } from '@repo/hooks';
import PartialEmpty from '../../empty';

export default function TaskList() {
  const taskLists = useStoreTaskList((s) => s.taskLists);
  const tasks = useStoreTask((s) => s.tasks);
  const sortedTasks = sortArray(tasks || [], (i) => i.createdAt, Order.DESCENDING);
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
  let completeTasks: TasksValue = undefined;
  let filteredTasks: TasksValue = undefined;

  const isTaskList = subViewValue?.includes('list: ');

  if (isTaskList) {
    filteredTasks = sortedTasks?.filter(
      (ti) => !ti.complete && ti.taskListId && ti.taskListId == taskListId,
    );
    completeTasks = sortedTasks?.filter(
      (ti) => ti.complete && ti.taskListId && ti.taskListId == taskListId,
    );
  } else {
    switch (subViewValue) {
      case SUBVIEW_NAMES.STRIDE.INBOX:
        filteredTasks = sortedTasks?.filter((ti) => !ti.complete && !ti.taskListId);
        completeTasks = sortedTasks?.filter((ti) => ti.complete && !ti.taskListId);
        break;
      case SUBVIEW_NAMES.STRIDE.TODAY:
        filteredTasks = sortedTasks?.filter(
          (ti) => !ti.complete && ti.dueDate && isToday(ti.dueDate),
        );
        completeTasks = sortedTasks?.filter(
          (ti) => ti.complete && ti.dueDate && isToday(ti.dueDate),
        );
        break;
      case SUBVIEW_NAMES.STRIDE.UPCOMING:
        filteredTasks = sortedTasks?.filter(
          (ti) =>
            !ti.complete && ti.dueDate && isWithinNext7Days(ti.dueDate, { excludeToday: true }),
        );
        completeTasks = sortedTasks?.filter(
          (ti) =>
            ti.complete && ti.dueDate && isWithinNext7Days(ti.dueDate, { excludeToday: true }),
        );
        break;
      case SUBVIEW_NAMES.STRIDE.OVERDUE:
        filteredTasks = sortedTasks?.filter(
          (ti) => !ti.complete && ti.dueDate && isOverdue(ti.dueDate),
        );
        break;
      case SUBVIEW_NAMES.STRIDE.COMPLETE:
        filteredTasks = sortedTasks?.filter((ti) => ti.complete);
        break;
      default:
        filteredTasks = sortedTasks;
        break;
    }
  }

  return (
    <LayoutSection id={'task-list'} containerized>
      <Box py={SECTION_SPACING}>
        {tasks === undefined || !filteredTasks?.length ? (
          <div>
            <PartialEmpty loading={tasks === undefined} label="No tasks found" />
            <AddTask />
          </div>
        ) : (
          <Stack gap={SECTION_SPACING}>
            <Stack>
              <Group>
                <Title order={1} fz={'xl'}>
                  {capitalizeWords(title)}
                </Title>
              </Group>

              <div>
                {filteredTasks?.map((fti, i) => (
                  <div key={fti.id}>
                    {i > 0 && (
                      <Box px={SECTION_SPACING - 8}>
                        <Divider />
                      </Box>
                    )}
                    <TaskCard props={fti} />
                  </div>
                ))}

                <AddTask />
              </div>
            </Stack>

            <Stack display={completeTasks && completeTasks.length > 0 ? undefined : 'none'}>
              <Group>
                <Title order={1} fz={'xl'}>
                  Complete
                </Title>
              </Group>

              <div>
                {completeTasks?.map((cti, i) => (
                  <div key={cti.id}>
                    {i > 0 && (
                      <Box px={SECTION_SPACING - 8}>
                        <Divider />
                      </Box>
                    )}
                    <TaskCard props={cti} />
                  </div>
                ))}
              </div>
            </Stack>
          </Stack>
        )}
      </Box>
    </LayoutSection>
  );
}

function TaskCard({ props, options }: { props?: TaskGet; options?: { add?: boolean } }) {
  const taskList = useStoreTaskList((s) => s.taskLists?.find((tli) => tli.id == props?.taskListId));
  const circleIcon = <IconCircleFilled size={4} />;
  const { showModalViewTaskCrud } = useViewModal();

  const { form } = useFormTask({
    defaultValues: props,
    options: { checkBox: true },
  });

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
      <Card withBorder={false} bg={'transparent'} radius={0} padding={0}>
        <Grid gap={0}>
          <GridCol span={0.5}>
            <Box mt={3} py={'md'} pl={'md'}>
              {options?.add ? (
                <ThemeIcon color={'pri'} variant="light" radius={99} size={20}>
                  <IconPlus size={18} stroke={ICON_STROKE_WIDTH} />
                </ThemeIcon>
              ) : (
                <Checkbox
                  aria-label={'Complete'}
                  defaultChecked={form.values.complete}
                  {...form.getInputProps('complete')}
                  size="sm"
                  radius={99}
                />
              )}
            </Box>
          </GridCol>

          <GridCol span={11.5}>
            <Box
              py={'md'}
              pl={'md'}
              onClick={() => {
                if (!options?.add && props?.id) {
                  showModalViewTaskCrud(props.id, MODAL_VIEW_NAMES.CRUD.STRIDE.TASK.UPDATE);
                }
              }}
            >
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
            </Box>
          </GridCol>
        </Grid>
      </Card>
    </Box>
  );
}

export function AddTask({ options }: { options?: { adding?: boolean } }) {
  const [adding, setAdding] = useState(options?.adding ?? false);
  const { subViewValue } = useSubView();

  useEffect(() => {
    if (options?.adding !== undefined) return;
    setAdding(false);
  }, [subViewValue]);

  return (
    <Box>
      <Box px={SECTION_SPACING - 8} display={!adding ? undefined : 'none'}>
        <Divider variant="dashed" />
      </Box>

      {adding && (
        <Card
          // px={15}
          // py={'xs'}
          padding={0}
          // bg={'light-dark(var(--mantine-color-gray-1), var(--mantine-color-dark-8))'}
          bg={'transparent'}
          withBorder={options?.adding === undefined}
        >
          <FormTask
            onUnmount={setAdding}
            options={{ withoutCheck: options?.adding !== undefined }}
          />
        </Card>
      )}

      <Box display={!adding ? undefined : 'none'} onClick={() => setAdding(true)}>
        <TaskCard options={{ add: true }} />
      </Box>
    </Box>
  );
}
