'use client';

import React, { Fragment, memo, useCallback, useEffect, useMemo, useState } from 'react';
import {
  TasksValue,
  useStoreRecurringRule,
  useStoreReminder,
  useStoreTask,
  useStoreTaskList,
  useStoreView,
  useSubView,
  useTaskActions,
  useViewModal,
} from '@repo/store';
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
  getFrequencyDetails,
  getPriorityDetails,
  getRegionalDate,
  isOverdue,
  isToday,
  isWithinNext7Days,
  sortArray,
} from '@repo/utils';
import { LayoutSection } from '@repo/ui';
import {
  audios,
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
  MODAL_VIEW_NAMES,
  SECTION_SPACING,
  SUBVIEW_NAMES,
} from '@repo/constants';
import {
  IconBell,
  IconCalendarEvent,
  IconCategory,
  IconCircleFilled,
  IconFlag,
  IconPlus,
  IconRepeat,
} from '@tabler/icons-react';
import {
  Frequency,
  Order,
  Priority,
  RecurringRuleGet,
  ReminderGet,
  TaskGet,
  TaskListGet,
} from '@repo/types';
import FormTask from '@atlas/ui/form/task';
import { useBreakpointFlags, useFormTask } from '@repo/hooks';
import PartialEmpty from '../../empty';
import { playNotificationSound } from '@repo/notifications';
import InputTextEditorTitle from '@atlas/ui/input/text/editor-title';
import { useTaskListTitle } from '@atlas/hooks/input';

const CARD_STYLE = {
  transition: 'background-color 150ms ease',
  cursor: 'pointer',
  borderRadius: 'var(--mantine-radius-md)',
  overflow: 'hidden',
};

const CHECKBOX_STYLES = {
  input: { borderWidth: 2 },
};

const TITLE_INPUT_STYLES = {
  input: {
    fontSize: 'var(--mantine-font-size-xl)',
    backgroundColor: 'transparent',
  },
};

const COMPLETE_DIVIDER_STYLES = {
  label: {
    fontSize: 'var(--mantine-font-size-md)',
    fontWeight: 600,
    lineHeight: 0,
  },
};

const TASK_LIST_SUBVIEWS = new Set<string>([
  SUBVIEW_NAMES.STRIDE.INBOX,
  SUBVIEW_NAMES.STRIDE.ALL,
  SUBVIEW_NAMES.STRIDE.TODAY,
  SUBVIEW_NAMES.STRIDE.UPCOMING,
  SUBVIEW_NAMES.STRIDE.OVERDUE,
  SUBVIEW_NAMES.STRIDE.COMPLETE,
]);

function matchesTaskFilter(
  task: TaskGet,
  subViewValue: string | undefined,
  isCustomList: boolean,
  resolvedTaskListId: string | undefined,
): boolean {
  if (isCustomList) {
    return Boolean(task.taskListId && task.taskListId === resolvedTaskListId);
  }

  switch (subViewValue) {
    case SUBVIEW_NAMES.STRIDE.INBOX:
      return !task.taskListId;
    case SUBVIEW_NAMES.STRIDE.ALL:
      return true;
    case SUBVIEW_NAMES.STRIDE.TODAY:
      return Boolean(task.dueDate && isToday(task.dueDate));
    case SUBVIEW_NAMES.STRIDE.UPCOMING:
      return Boolean(task.dueDate && isWithinNext7Days(task.dueDate, { excludeToday: true }));
    case SUBVIEW_NAMES.STRIDE.OVERDUE:
      return Boolean(task.dueDate && isOverdue(task.dueDate));
    case SUBVIEW_NAMES.STRIDE.COMPLETE:
      return Boolean(task.complete);
    default:
      return true;
  }
}

interface TaskCardProps {
  task?: TaskGet;
  addMode?: boolean;
  taskList?: TaskListGet;
  reminder?: ReminderGet;
  recurringRule?: RecurringRuleGet;
  onToggleComplete?: (task: TaskGet, nextComplete: boolean) => void;
  onSelectTask?: (taskId: string) => void;
  onAddClick?: () => void;
}

const TaskCard = memo(function TaskCard({
  task,
  addMode = false,
  taskList,
  reminder,
  recurringRule,
  onToggleComplete,
  onSelectTask,
  onAddClick,
}: TaskCardProps) {
  const handleCheckboxChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!task || !onToggleComplete) return;
      onToggleComplete(task, e.currentTarget.checked);
    },
    [task, onToggleComplete],
  );

  const handleRowClick = useCallback(() => {
    if (addMode) {
      onAddClick?.();
      return;
    }
    if (task?.id && onSelectTask) {
      onSelectTask(task.id);
    }
  }, [addMode, onAddClick, task?.id, onSelectTask]);

  const dueDateMeta = useMemo(() => {
    if (!task?.dueDate) return null;
    const isTaskToday = isToday(task.dueDate);
    const isTaskOverdue = !isTaskToday && isOverdue(task.dueDate);
    const color = isTaskToday ? 'blue.6' : isTaskOverdue ? 'red.6' : undefined;
    const formatted = getRegionalDate(task.dueDate).date;
    return { color, formatted };
  }, [task?.dueDate]);

  const reminderFormatted = useMemo(() => {
    if (!reminder) return null;
    const dt = getRegionalDate(reminder.remindAt);
    return `${dt.date}, ${dt.time.toUpperCase()}`;
  }, [reminder]);

  const recurringLabel = useMemo(() => {
    if (!recurringRule) return null;
    const freq = getFrequencyDetails(recurringRule.frequency as Frequency).label;
    const plural = recurringRule.interval > 1 ? 's' : '';
    const prefix = recurringRule.interval === 1 ? '' : `${recurringRule.interval} `;
    return `Every ${prefix}${freq}${plural}`;
  }, [recurringRule]);

  const priorityDetails = useMemo(
    () => (task?.priority ? getPriorityDetails(task.priority as Priority) : null),
    [task?.priority],
  );

  const metaItems = useMemo(() => {
    if (addMode || !task) return [];
    const items: Array<{ key: string; node: React.ReactNode }> = [];

    if (taskList) {
      items.push({
        key: 'list',
        node: (
          <Group gap={5}>
            <Box c={taskList.color ? `${taskList.color}.6` : undefined}>
              <IconCategory size={ICON_SIZE - 6} stroke={2} />
            </Box>
            <Text inherit>{taskList.title}</Text>
          </Group>
        ),
      });
    }

    if (dueDateMeta) {
      items.push({
        key: 'due',
        node: (
          <Group gap={5}>
            <Box c={dueDateMeta.color}>
              <IconCalendarEvent size={ICON_SIZE - 6} stroke={2} />
            </Box>
            <Text inherit>{dueDateMeta.formatted}</Text>
          </Group>
        ),
      });
    }

    if (reminderFormatted) {
      items.push({
        key: 'reminder',
        node: (
          <Group gap={5}>
            <IconBell size={ICON_SIZE - 6} stroke={2} />
            <Text inherit>{reminderFormatted}</Text>
          </Group>
        ),
      });
    }

    if (recurringLabel) {
      items.push({
        key: 'recurring',
        node: (
          <Group gap={5}>
            <IconRepeat size={ICON_SIZE - 6} stroke={2} />
            <Text inherit>{recurringLabel}</Text>
          </Group>
        ),
      });
    }

    if (priorityDetails && task.priority) {
      items.push({
        key: 'priority',
        node: (
          <Group gap={5}>
            <Box c={`${priorityDetails.color}.6`}>
              <IconFlag size={ICON_SIZE - 6} stroke={2} />
            </Box>
            <Text inherit>{priorityDetails.label}</Text>
          </Group>
        ),
      });
    }

    return items;
  }, [addMode, task, taskList, dueDateMeta, reminderFormatted, recurringLabel, priorityDetails]);

  return (
    <Box
      style={CARD_STYLE}
      className="hover:bg-[light-dark(var(--mantine-color-gray-1),var(--mantine-color-dark-8))]"
    >
      <Card withBorder={false} bg="transparent" radius={0} padding={0}>
        <Grid gap={0}>
          <GridCol span={{ base: 1.5, xs: 0.5 }}>
            <Box mt={3} py="md" pl={{ base: 'md' }}>
              {addMode ? (
                <ThemeIcon color="pri" variant="light" radius={99} size={20}>
                  <IconPlus size={18} stroke={ICON_STROKE_WIDTH} />
                </ThemeIcon>
              ) : (
                <Checkbox
                  aria-label="Complete"
                  checked={Boolean(task?.complete)}
                  onChange={handleCheckboxChange}
                  size="sm"
                  radius={99}
                  styles={CHECKBOX_STYLES}
                />
              )}
            </Box>
          </GridCol>

          <GridCol span={{ base: 10.5, xs: 11.5 }}>
            <Box py="md" pl="md" onClick={handleRowClick}>
              <Stack gap={5}>
                <Text inherit fw={500} c={addMode ? 'pri' : undefined}>
                  {addMode ? 'Add task' : task?.title}
                </Text>

                {!addMode && metaItems.length > 0 && (
                  <Group gap="xs" fz="xs" c="dimmed">
                    {metaItems.map((item, idx) => (
                      <Fragment key={item.key}>
                        {idx > 0 && <IconCircleFilled size={4} />}
                        {item.node}
                      </Fragment>
                    ))}
                  </Group>
                )}
              </Stack>
            </Box>
          </GridCol>
        </Grid>
      </Card>
    </Box>
  );
});

const TaskRow = memo(function TaskRow({
  task,
  showDivider,
  taskList,
  reminder,
  recurringRule,
  onToggleComplete,
  onSelectTask,
}: {
  task: TaskGet;
  showDivider: boolean;
  taskList?: TaskListGet;
  reminder?: ReminderGet;
  recurringRule?: RecurringRuleGet;
  onToggleComplete: (task: TaskGet, nextComplete: boolean) => void;
  onSelectTask: (taskId: string) => void;
}) {
  return (
    <div>
      {showDivider && (
        <Box px={{ md: SECTION_SPACING - 8 }}>
          <Divider />
        </Box>
      )}
      <TaskCard
        task={task}
        taskList={taskList}
        reminder={reminder}
        recurringRule={recurringRule}
        onToggleComplete={onToggleComplete}
        onSelectTask={onSelectTask}
      />
    </div>
  );
});

export default function TaskList() {
  const { ready, isMobile } = useBreakpointFlags();

  const taskLists = useStoreTaskList((s) => s.taskLists);
  const tasks = useStoreTask((s) => s.tasks);
  const reminders = useStoreReminder((s) => s.reminders);
  const recurringRules = useStoreRecurringRule((s) => s.recurringRules);

  const subViewValue = useStoreView((s) => s.view?.subView);
  const { showModalViewTaskCrud } = useViewModal();
  const { taskUpdate } = useTaskActions(); // or your task update action

  const taskListId = useMemo(
    () => (subViewValue ? extractUuidFromParam(subViewValue) : ''),
    [subViewValue],
  );

  const taskList = useMemo(
    () => taskLists?.find((tli) => tli.id === taskListId),
    [taskLists, taskListId],
  );

  const { field, inputRef, handleBlur, handleKeyDown } = useTaskListTitle(taskList?.id || '');

  // O(1) lookup maps instead of O(N) .find() inside every TaskCard
  const taskListById = useMemo(() => {
    const map = new Map<string, TaskListGet>();
    for (const item of taskLists || []) map.set(item.id, item);
    return map;
  }, [taskLists]);

  const reminderByTaskId = useMemo(() => {
    const map = new Map<string, ReminderGet>();
    for (const item of reminders || []) {
      if (item.taskId) map.set(item.taskId, item);
    }
    return map;
  }, [reminders]);

  const recurringRuleById = useMemo(() => {
    const map = new Map<string, RecurringRuleGet>();
    for (const item of recurringRules || []) map.set(item.id, item);
    return map;
  }, [recurringRules]);

  const sortedTasks = useMemo(
    () => sortArray(tasks || [], (i) => i.createdAt, Order.DESCENDING),
    [tasks],
  );

  const isCustomTaskList = Boolean(subViewValue?.includes('list: '));
  const isCompleteOnlyView = subViewValue === SUBVIEW_NAMES.STRIDE.COMPLETE;
  const isOverdueOnlyView = subViewValue === SUBVIEW_NAMES.STRIDE.OVERDUE;

  const { activeTasks, completedTasks } = useMemo(() => {
    if (!tasks) {
      return { activeTasks: undefined, completedTasks: undefined };
    }

    const active: TaskGet[] = [];
    const completed: TaskGet[] = [];

    for (const item of sortedTasks) {
      if (!matchesTaskFilter(item, subViewValue || '', isCustomTaskList, taskList?.id)) {
        continue;
      }

      if (isCompleteOnlyView) {
        completed.push(item);
      } else if (isOverdueOnlyView) {
        if (!item.complete) active.push(item);
      } else if (item.complete) {
        completed.push(item);
      } else {
        active.push(item);
      }
    }

    return { activeTasks: active, completedTasks: completed };
  }, [
    tasks,
    sortedTasks,
    subViewValue,
    isCustomTaskList,
    taskList?.id,
    isCompleteOnlyView,
    isOverdueOnlyView,
  ]);

  const handleToggleComplete = useCallback(
    (targetTask: TaskGet, nextComplete: boolean) => {
      taskUpdate({ ...targetTask, complete: nextComplete });
    },
    [taskUpdate],
  );

  const handleSelectTask = useCallback(
    (taskId: string) => {
      showModalViewTaskCrud(taskId, MODAL_VIEW_NAMES.CRUD.STRIDE.TASK.UPDATE);
    },
    [showModalViewTaskCrud],
  );

  const inputProps = useMemo(() => field.getInputProps(), [field]);

  if (!ready) {
    return null;
  }

  const isLoadingTasks = tasks === undefined;
  const hasActiveTasks = Boolean(activeTasks && activeTasks.length > 0);
  const hasCompletedTasks = Boolean(completedTasks && completedTasks.length > 0);

  return (
    <LayoutSection id="task-list" containerized={isMobile ? false : 'md'}>
      <Box py={{ base: 0, xs: SECTION_SPACING }}>
        <Stack>
          <div>
            {!taskList ? (
              <Group mih={42}>
                <Title order={1} fz="xl">
                  {capitalizeWords(subViewValue || '')}
                </Title>
              </Group>
            ) : (
              <InputTextEditorTitle
                inputProps={inputProps}
                inputRef={inputRef}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                styles={TITLE_INPUT_STYLES}
              />
            )}
          </div>

          {isLoadingTasks || !hasActiveTasks ? (
            <div>
              {/* <PartialEmpty loading={isLoadingTasks} label="No tasks found" /> */}
              <AddTask />
            </div>
          ) : (
            <div>
              {activeTasks!.map((item, index) => (
                <TaskRow
                  key={item.id}
                  task={item}
                  showDivider={index > 0}
                  taskList={item.taskListId ? taskListById.get(item.taskListId) : undefined}
                  reminder={reminderByTaskId.get(item.id)}
                  recurringRule={
                    item.recurringRuleId ? recurringRuleById.get(item.recurringRuleId) : undefined
                  }
                  onToggleComplete={handleToggleComplete}
                  onSelectTask={handleSelectTask}
                />
              ))}

              <AddTask />
            </div>
          )}
        </Stack>

        {!isLoadingTasks && hasCompletedTasks && (
          <Box>
            <Divider my="xl" label="Complete" styles={COMPLETE_DIVIDER_STYLES} />

            <div>
              {completedTasks!.map((item, index) => (
                <TaskRow
                  key={item.id}
                  task={item}
                  showDivider={index > 0}
                  taskList={item.taskListId ? taskListById.get(item.taskListId) : undefined}
                  reminder={reminderByTaskId.get(item.id)}
                  recurringRule={
                    item.recurringRuleId ? recurringRuleById.get(item.recurringRuleId) : undefined
                  }
                  onToggleComplete={handleToggleComplete}
                  onSelectTask={handleSelectTask}
                />
              ))}
            </div>
          </Box>
        )}
      </Box>
    </LayoutSection>
  );
}

export function AddTask({ options }: { options?: { adding?: boolean } }) {
  const [adding, setAdding] = useState(options?.adding ?? false);
  const subViewValue = useStoreView((s) => s.view?.subView);

  useEffect(() => {
    if (options?.adding !== undefined) return;
    setAdding(false);
  }, [options?.adding, subViewValue]);

  const handleStartAdding = useCallback(() => {
    setAdding(true);
  }, []);

  return (
    <Box>
      <Box px={{ md: SECTION_SPACING - 8 }} display={!adding ? undefined : 'none'}>
        <Divider variant="dashed" />
      </Box>

      {adding && (
        <Card
          px={0}
          pt={8}
          bg="transparent"
          withBorder={options?.adding === undefined}
          style={{ overflow: 'visible' }}
        >
          <FormTask
            onUnmount={setAdding}
            options={{ withoutCheck: options?.adding !== undefined }}
          />
        </Card>
      )}

      <Box display={!adding ? undefined : 'none'}>
        <TaskCard addMode onAddClick={handleStartAdding} />
      </Box>
    </Box>
  );
}
