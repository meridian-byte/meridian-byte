'use client';

import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActionIcon,
  Box,
  Button,
  Center,
  Checkbox,
  Divider,
  Flex,
  Grid,
  GridCol,
  Group,
  NumberInput,
  ScrollArea,
  Select,
  Stack,
  Tabs,
  TabsList,
  TabsPanel,
  TabsTab,
  Text,
  Textarea,
  TextInput,
  Tooltip,
} from '@mantine/core';
import { useAppshellChild, useBreakpointFlags, useFormTask } from '@repo/hooks';
import { Alert, Frequency, Order, Priority, TaskGet } from '@repo/types';
import {
  useRecurringRuleActions,
  useReminderActions,
  useStoreRecurringRule,
  useStoreReminder,
  useStoreTask,
  useStoreTaskList,
  useSubView,
  useTaskActions,
  useViewAside,
  useViewModal,
} from '@repo/store';
import { DateInput, DateTimePicker } from '@mantine/dates';
import {
  IconAlignJustified,
  IconBell,
  IconCalendarEvent,
  IconCategory,
  IconChecklist,
  IconClock,
  IconFlag,
  IconPencilCog,
  IconRepeat,
  IconSettings,
  IconTrash,
  IconX,
} from '@tabler/icons-react';
import {
  ASIDE_VIEW_NAMES,
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
  SUBVIEW_NAMES,
} from '@repo/constants';
import {
  capitalizeWords,
  generateUUID,
  getNextWeek,
  getPriorityDetails,
  getTomorrow,
  getYesterday,
  sortArray,
} from '@repo/utils';
import dayjs from 'dayjs';
import { ModalConfirm } from '@repo/ui';

const TITLE_INPUT_STYLES = {
  input: {
    backgroundColor: 'transparent',
    fontWeight: 'bold',
  },
};

const DESCRIPTION_INPUT_STYLES = {
  input: {
    backgroundColor: 'transparent',
    padding: 0,
    fontWeight: 500,
  },
};

const TABS_STYLES = {
  tab: {
    paddingTop: 'var(--mantine-spacing-md)',
    paddingBottom: 'var(--mantine-spacing-md)',
  },
  tabLabel: { fontWeight: 600 },
};

const PRIORITY_OPTIONS = sortArray(
  [
    {
      value: Priority.URGENT_IMPORTANT,
      label: getPriorityDetails(Priority.URGENT_IMPORTANT).label,
    },
    {
      value: Priority.URGENT_UNIMPORTANT,
      label: getPriorityDetails(Priority.URGENT_UNIMPORTANT).label,
    },
    {
      value: Priority.NOT_URGENT_IMPORTANT,
      label: getPriorityDetails(Priority.NOT_URGENT_IMPORTANT).label,
    },
    {
      value: Priority.NOT_URGENT_UNIMPORTANT,
      label: getPriorityDetails(Priority.NOT_URGENT_UNIMPORTANT).label,
    },
  ],
  (i) => i.label,
  Order.ASCENDING,
);

function getDefaultReminderDate(dueDate: Date | string): Date {
  return dayjs(dueDate).hour(9).minute(0).second(0).millisecond(0).toDate();
}

const InputTaskList = memo(function InputTaskList({
  form,
  isModal,
  isDesktop,
  inboxView,
  taskListOptions,
}: {
  form: ReturnType<typeof useFormTask>['form'];
  isModal: boolean;
  isDesktop: boolean;
  inboxView: boolean;
  taskListOptions: Array<{ value: string; label: string }>;
}) {
  return (
    <div>
      <Select
        aria-label="Task list"
        label={isModal ? 'Task list' : undefined}
        placeholder={inboxView ? 'Inbox' : 'Task list'}
        size={isDesktop ? 'xs' : 'sm'}
        clearable
        clearSectionMode="clear"
        searchable
        {...form.getInputProps('taskListId')}
        leftSection={<IconCategory size={ICON_SIZE - 4} stroke={ICON_STROKE_WIDTH} />}
        comboboxProps={{ withinPortal: false }}
        data={taskListOptions}
      />
    </div>
  );
});

const SectionReminder = memo(function SectionReminder({
  taskId,
  currentDueDate,
  isDesktop,
  isPersistedTask,
}: {
  taskId?: string;
  currentDueDate: Date | string | null | undefined;
  isDesktop: boolean;
  isPersistedTask: boolean;
}) {
  const taskDueDate = useStoreTask((s) => s.tasks?.find((ti) => ti.id === taskId)?.dueDate);
  const reminder = useStoreReminder((s) => s.reminders?.find((ri) => ri.taskId === taskId));
  const { reminderCreate, reminderUpdate, reminderDelete } = useReminderActions();

  const [withReminder, setWithReminder] = useState<boolean>(Boolean(reminder));
  const [reminderState, setReminderState] = useState<string | null>(() =>
    reminder?.remindAt ? new Date(reminder.remindAt).toISOString() : null,
  );

  // Sync with due date changes
  useEffect(() => {
    if (!currentDueDate || !withReminder) {
      if (reminderState !== null) setReminderState(null);
      if (withReminder && !currentDueDate) setWithReminder(false);
      return;
    }

    if (!reminderState) {
      setReminderState(getDefaultReminderDate(currentDueDate).toISOString());
      return;
    }

    const dueDateEnd = dayjs(currentDueDate).endOf('day');
    if (dayjs(reminderState).isAfter(dueDateEnd)) {
      setReminderState(getDefaultReminderDate(currentDueDate).toISOString());
    }
  }, [currentDueDate, withReminder, reminderState]);

  // Delete reminder if persisted task loses its dueDate
  useEffect(() => {
    if (!isPersistedTask || !reminder || taskDueDate !== null) return;
    reminderDelete(reminder);
  }, [isPersistedTask, reminder, taskDueDate, reminderDelete]);

  // Persist reminder state changes for existing tasks
  useEffect(() => {
    if (!isPersistedTask || !taskId) return;

    if (!reminder) {
      if (!reminderState) return;
      reminderCreate({
        id: generateUUID(),
        remindAt: getDefaultReminderDate(currentDueDate || new Date()).toISOString() as any,
        taskId,
      });
      return;
    }

    if (!reminderState) {
      reminderDelete(reminder);
      return;
    }

    if (new Date(reminder.remindAt).toISOString() !== reminderState) {
      reminderUpdate({
        ...reminder,
        remindAt: reminderState as any,
      });
    }
  }, [
    isPersistedTask,
    taskId,
    reminder,
    reminderState,
    currentDueDate,
    reminderCreate,
    reminderUpdate,
    reminderDelete,
  ]);

  const handleToggleReminder = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const checked = event.currentTarget.checked;
      setWithReminder(checked);
      if (checked && currentDueDate && !reminderState) {
        setReminderState(getDefaultReminderDate(currentDueDate).toISOString());
      }
    },
    [currentDueDate, reminderState],
  );

  const maxDate = useMemo(
    () => (currentDueDate ? dayjs(currentDueDate).endOf('day').toDate() : undefined),
    [currentDueDate],
  );

  const stackHeight = !currentDueDate ? 0 : withReminder ? 16 + 10 + (isDesktop ? 30 : 36) : 16;

  return (
    <Stack
      gap={withReminder ? 'xs' : 0}
      style={{
        transition: 'height 120ms ease',
        height: stackHeight,
        overflow: 'hidden',
      }}
    >
      <Checkbox
        label="Remind"
        checked={withReminder}
        onChange={handleToggleReminder}
        disabled={withReminder && Boolean(reminderState)}
      />

      <DateTimePicker
        aria-label="Remind at"
        placeholder="Remind at"
        size={isDesktop ? 'xs' : 'sm'}
        clearable
        leftSection={<IconClock size={ICON_SIZE - 4} stroke={ICON_STROKE_WIDTH} />}
        value={reminderState}
        onChange={setReminderState}
        maxDate={maxDate}
        timePickerProps={{
          withDropdown: true,
          popoverProps: { withinPortal: false },
          format: '12h',
        }}
      />
    </Stack>
  );
});

const SectionRecurring = memo(function SectionRecurring({
  defaultValues,
  currentDueDate,
  isPersistedTask,
}: {
  defaultValues?: Partial<TaskGet>;
  currentDueDate: Date | string | null | undefined;
  isPersistedTask: boolean;
}) {
  const recurringRule = useStoreRecurringRule((s) =>
    s.recurringRules?.find((ri) => ri.id === defaultValues?.recurringRuleId),
  );
  const { recurringRuleCreate, recurringRuleUpdate, recurringRuleDelete } =
    useRecurringRuleActions();
  const { taskUpdate } = useTaskActions();

  const [withRecurringRule, setWithRecurringRule] = useState<boolean>(Boolean(recurringRule));
  const [frequencyState, setFrequencyState] = useState<string | null>(
    recurringRule?.frequency || null,
  );
  const [intervalState, setIntervalState] = useState<number | string>(
    recurringRule?.interval || '',
  );

  const handleToggleRecurring = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const checked = event.currentTarget.checked;
      setWithRecurringRule(checked);
      if (checked) {
        setIntervalState((prev) => prev || recurringRule?.interval || 1);
        setFrequencyState((prev) => prev || recurringRule?.frequency || Frequency.WEEKLY);
      }
    },
    [recurringRule],
  );

  const handleClearRule = useCallback(() => {
    setIntervalState('');
    setFrequencyState('');
    setWithRecurringRule(false);

    if (isPersistedTask && recurringRule) {
      recurringRuleDelete(recurringRule);
      taskUpdate({
        ...(defaultValues as TaskGet),
        recurringRuleId: null,
      });
    }
  }, [isPersistedTask, recurringRule, recurringRuleDelete, taskUpdate, defaultValues]);

  // Sync recurring rule updates for persisted tasks
  useEffect(() => {
    if (!isPersistedTask || !frequencyState || !intervalState) return;
    const normalizedInterval = typeof intervalState === 'string' ? 1 : intervalState;

    if (!recurringRule) {
      const created = recurringRuleCreate({
        id: generateUUID(),
        frequency: frequencyState as Frequency,
        interval: normalizedInterval,
      });
      if (created) {
        taskUpdate({
          ...(defaultValues as TaskGet),
          recurringRuleId: created.id,
        });
      }
      return;
    }

    if (
      recurringRule.frequency !== frequencyState ||
      recurringRule.interval !== normalizedInterval
    ) {
      recurringRuleUpdate({
        ...recurringRule,
        frequency: frequencyState as Frequency,
        interval: normalizedInterval,
      });
    }
  }, [
    isPersistedTask,
    frequencyState,
    intervalState,
    recurringRule,
    recurringRuleCreate,
    recurringRuleUpdate,
    taskUpdate,
    defaultValues,
  ]);

  const frequencyOptions = useMemo(() => {
    const plural = Number(intervalState) > 1 ? 's' : '';
    return [
      { value: Frequency.DAILY, label: `Day${plural}` },
      { value: Frequency.WEEKLY, label: `Week${plural}` },
      { value: Frequency.MONTHLY, label: `Month${plural}` },
      { value: Frequency.ANNUALLY, label: `Year${plural}` },
    ];
  }, [intervalState]);

  const stackHeight = !currentDueDate ? 0 : withRecurringRule ? 16 + 10 + 18.6 + 2 + 30 : 16;

  return (
    <Stack
      gap={withRecurringRule ? 'xs' : 0}
      style={{
        transition: 'height 120ms ease',
        height: stackHeight,
        overflow: 'hidden',
      }}
    >
      <Checkbox
        label="Repeat"
        checked={withRecurringRule}
        onChange={handleToggleRecurring}
        disabled={Boolean(intervalState) || Boolean(frequencyState)}
      />

      <Stack gap={2}>
        <Text inherit fz="xs" fw={500}>
          Every
        </Text>

        <Group gap={5} wrap="nowrap">
          <NumberInput
            w="30%"
            aria-label="Int."
            placeholder="Int."
            size="xs"
            value={intervalState}
            onChange={setIntervalState}
          />

          <Select
            w="70%"
            aria-label="Frequency"
            placeholder="Frequency"
            size="xs"
            clearable
            value={frequencyState}
            onChange={setFrequencyState}
            disabled={!intervalState}
            leftSection={<IconRepeat size={ICON_SIZE - 4} stroke={ICON_STROKE_WIDTH} />}
            data={frequencyOptions}
          />

          <Tooltip label="Delete rule">
            <ActionIcon size={30} color="red" variant="light" onClick={handleClearRule}>
              <IconX size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Stack>
    </Stack>
  );
});

const TaskProperties = memo(function TaskProperties({
  form,
  defaultValues,
  options,
  isDesktop,
  sharedPadding,
  sharedHeight,
  views,
  creatingTask,
  isPersistedTask,
  taskListOptions,
  checked,
  onCheckedChange,
  submitted,
  asideViewValue,
  onClose,
}: {
  form: ReturnType<typeof useFormTask>['form'];
  defaultValues?: Partial<TaskGet>;
  options?: { modal?: boolean; withoutCheck?: boolean };
  isDesktop: boolean;
  sharedPadding: string;
  sharedHeight: number | undefined;
  views: ReturnType<typeof useFormTask>['views'];
  creatingTask: boolean;
  isPersistedTask: boolean;
  taskListOptions: Array<{ value: string; label: string }>;
  checked: boolean | undefined;
  onCheckedChange: (checked: boolean) => void;
  submitted: boolean;
  asideViewValue: string | undefined;
  onClose: () => void;
}) {
  const { taskDelete } = useTaskActions();
  const isModal = Boolean(options?.modal);
  const withoutCheck = Boolean(options?.withoutCheck);
  const currentDueDate = form.values?.dueDate || defaultValues?.dueDate;

  const priorityColor = useMemo(
    () =>
      !form.values.priority
        ? undefined
        : `${getPriorityDetails(form.values.priority as Priority).color}.6`,
    [form.values.priority],
  );

  const minDueDate = useMemo(
    () =>
      creatingTask && views.upcomingView ? dayjs(getTomorrow()).format('YYYY-MM-DD') : undefined,
    [creatingTask, views.upcomingView],
  );

  const maxDueDate = useMemo(
    () =>
      creatingTask && views.overdueView ? dayjs(getYesterday()).format('YYYY-MM-DD') : undefined,
    [creatingTask, views.overdueView],
  );

  const handleDeleteTask = useCallback(() => {
    if (isPersistedTask && defaultValues) {
      taskDelete(defaultValues as TaskGet);
    }
  }, [isPersistedTask, defaultValues, taskDelete]);

  return (
    <Stack h={sharedHeight} gap={0}>
      <ScrollArea flex={1} style={{ overflow: 'visible' }}>
        <Flex
          align={isModal || withoutCheck ? undefined : 'center'}
          direction={isModal || withoutCheck ? 'column' : 'row'}
          pt={isModal ? sharedPadding : undefined}
          px={isModal ? sharedPadding : undefined}
          gap={isModal ? undefined : 5}
          pb={isModal ? sharedPadding : 0}
        >
          {(isModal || withoutCheck) && (
            <InputTaskList
              form={form}
              isModal={isModal}
              isDesktop={isDesktop}
              inboxView={Boolean(views.inboxView)}
              taskListOptions={taskListOptions}
            />
          )}

          <div>
            <Select
              aria-label="Priority"
              label={isModal ? 'Priority' : undefined}
              placeholder="Priority"
              comboboxProps={{ withinPortal: !isModal }}
              size={isDesktop ? 'xs' : 'sm'}
              {...form.getInputProps('priority')}
              leftSection={
                <Box c={priorityColor}>
                  <IconFlag size={ICON_SIZE - 4} stroke={ICON_STROKE_WIDTH} />
                </Box>
              }
              data={PRIORITY_OPTIONS}
            />
          </div>

          <Divider mt={isModal ? 16 : 8} mb={8} />

          <div>
            <DateInput
              aria-label="Due date"
              label={isModal ? 'Due date' : undefined}
              placeholder="Due date"
              size={isDesktop ? 'xs' : 'sm'}
              clearable
              disabled={creatingTask && Boolean(views.todayView)}
              minDate={minDueDate}
              maxDate={maxDueDate}
              {...form.getInputProps('dueDate')}
              leftSection={<IconCalendarEvent size={ICON_SIZE - 4} stroke={ICON_STROKE_WIDTH} />}
            />
          </div>

          {isModal && (
            <>
              {defaultValues?.dueDate && <Divider my={16} />}
              <SectionReminder
                taskId={defaultValues?.id}
                currentDueDate={currentDueDate}
                isDesktop={isDesktop}
                isPersistedTask={isPersistedTask}
              />
            </>
          )}

          {isModal && (
            <>
              {defaultValues?.dueDate && <Divider my={16} />}
              <SectionRecurring
                defaultValues={defaultValues}
                currentDueDate={currentDueDate}
                isPersistedTask={isPersistedTask}
              />
            </>
          )}
        </Flex>
      </ScrollArea>

      <Divider my={isModal ? undefined : sharedPadding} />

      {!isPersistedTask && asideViewValue === ASIDE_VIEW_NAMES.NEW.STRIDE.TASK && withoutCheck && (
        <div>
          <Checkbox
            label="Close when done"
            checked={Boolean(checked)}
            onChange={(event) => onCheckedChange(event.currentTarget.checked)}
            mb="xs"
          />
        </div>
      )}

      <Group
        justify={isModal ? 'end' : 'space-between'}
        gap="xs"
        p={isModal ? sharedPadding : undefined}
      >
        {!(isModal || withoutCheck) && (
          <InputTaskList
            form={form}
            isModal={isModal}
            isDesktop={isDesktop}
            inboxView={Boolean(views.inboxView)}
            taskListOptions={taskListOptions}
          />
        )}

        <Group gap="xs">
          <Button
            disabled={submitted}
            variant="default"
            size={isDesktop ? 'xs' : undefined}
            onClick={onClose}
          >
            Close
          </Button>

          {!isPersistedTask && (
            <Button type="submit" size={isDesktop ? 'xs' : undefined} loading={submitted}>
              {submitted ? 'Adding' : 'Add'}
            </Button>
          )}

          {isModal && (
            <ModalConfirm
              props={{
                variant: Alert.DANGER,
                title: 'Delete Task',
                desc: 'Are you sure? This action is irreversible.',
                onConfirm: handleDeleteTask,
              }}
            >
              <Tooltip label="Delete task">
                <ActionIcon
                  size={ICON_WRAPPER_SIZE * (isDesktop ? 1 : 1.25)}
                  color="red"
                  variant="light"
                >
                  <IconTrash size={ICON_SIZE * (isDesktop ? 1 : 1.25)} stroke={ICON_STROKE_WIDTH} />
                </ActionIcon>
              </Tooltip>
            </ModalConfirm>
          )}
        </Group>
      </Group>
    </Stack>
  );
});

const TaskTab = memo(function TaskTab({
  content,
  properties,
}: {
  content?: React.ReactNode;
  properties?: React.ReactNode;
}) {
  return (
    <Box>
      <Tabs defaultValue="content" styles={TABS_STYLES} keepMounted>
        <TabsList justify="center" grow>
          <TabsTab value="content">
            <Group justify="center">
              <IconPencilCog size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
              <span>Content</span>
            </Group>
          </TabsTab>

          <TabsTab value="properties">
            <Group justify="center">
              <IconSettings size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
              <span>Properties</span>
            </Group>
          </TabsTab>
        </TabsList>

        <TabsPanel
          value="content"
          bg="light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-9))"
        >
          {content}
        </TabsPanel>

        <TabsPanel value="properties">{properties}</TabsPanel>
      </Tabs>
    </Box>
  );
});

export default function Task({
  defaultValues,
  onUnmount,
  options,
}: {
  defaultValues?: Partial<TaskGet>;
  onUnmount?: React.Dispatch<React.SetStateAction<boolean>>;
  options?: { modal?: boolean; withoutCheck?: boolean };
}) {
  const { ready, isDesktop } = useBreakpointFlags();

  const [checked, setChecked] = useState(options?.withoutCheck);
  const { form, submitted, handleSubmit, views } = useFormTask({
    options: { closeWhenDone: checked },
    defaultValues,
  });

  const { closeModalView } = useViewModal();
  const { asideViewValue } = useViewAside();
  const { handleToggleChildAside } = useAppshellChild();
  const taskLists = useStoreTaskList((s) => s.taskLists);

  const isPersistedTask = Boolean(defaultValues?.updatedAt);
  const creatingTask = !isPersistedTask;
  const isModal = Boolean(options?.modal);
  const withoutCheck = Boolean(options?.withoutCheck);
  const sharedPadding = 'md';
  const sharedHeight = isModal ? (isDesktop ? 400 : 480) : undefined;

  const taskListOptions = useMemo(
    () => (taskLists || []).map((tli) => ({ value: tli.id, label: tli.title })),
    [taskLists],
  );

  const handleClose = useCallback(() => {
    if (onUnmount && !withoutCheck) {
      onUnmount(false);
    } else if (!isPersistedTask) {
      handleToggleChildAside();
    } else {
      closeModalView();
    }
  }, [onUnmount, withoutCheck, isPersistedTask, handleToggleChildAside, closeModalView]);

  const handleFormSubmit = useMemo(
    () =>
      form.onSubmit(() => {
        handleSubmit();
        if (onUnmount) onUnmount(false);
      }),
    [form, handleSubmit, onUnmount],
  );

  if (!ready) {
    return null;
  }

  const propertiesNode = (
    <TaskProperties
      form={form}
      defaultValues={defaultValues}
      options={options}
      isDesktop={isDesktop}
      sharedPadding={sharedPadding}
      sharedHeight={sharedHeight}
      views={views}
      creatingTask={creatingTask}
      isPersistedTask={isPersistedTask}
      taskListOptions={taskListOptions}
      checked={checked}
      onCheckedChange={setChecked}
      submitted={submitted}
      asideViewValue={asideViewValue || ''}
      onClose={handleClose}
    />
  );

  const contentNode = (
    <ScrollArea
      h={sharedHeight}
      py={isModal ? undefined : 0}
      p={withoutCheck ? 'xs' : sharedPadding}
      style={{ overflow: 'visible' }}
    >
      <Grid gap={0}>
        {!withoutCheck && (
          <GridCol span={{ md: isModal ? 1 : 0.5 }} visibleFrom="md">
            <Group pl={isModal ? 5 : 0}>
              <Checkbox
                aria-label="Complete"
                defaultChecked={Boolean(form.values.complete)}
                {...form.getInputProps('complete')}
                size="sm"
                disabled={creatingTask && Boolean(views.completeView)}
                radius={99}
                mt={12}
              />
            </Group>
          </GridCol>
        )}

        <GridCol span={{ md: isModal ? 11 : withoutCheck ? 12 : 11.5 }}>
          <Stack gap="xs">
            <div>
              <TextInput
                required
                aria-label="Title"
                placeholder="Title"
                variant="unstyled"
                styles={TITLE_INPUT_STYLES}
                {...form.getInputProps('title')}
                size="md"
              />

              <div>
                <Textarea
                  aria-label="Description"
                  placeholder="Description"
                  variant="unstyled"
                  styles={DESCRIPTION_INPUT_STYLES}
                  {...form.getInputProps('description')}
                  size="sm"
                  autosize
                  minRows={1}
                  maxRows={isModal ? undefined : 5}
                />
              </div>
            </div>

            {!isModal && propertiesNode}
          </Stack>
        </GridCol>
      </Grid>
    </ScrollArea>
  );

  if (isModal && !isDesktop) {
    return <TaskTab content={contentNode} properties={propertiesNode} />;
  }

  return (
    <Box component="form" onSubmit={handleFormSubmit} noValidate>
      <Grid gap={0}>
        <GridCol
          span={{ base: 12, md: isModal ? 8 : 12 }}
          bg={
            isModal
              ? 'light-dark(var(--mantine-color-gray-1), var(--mantine-color-dark-8))'
              : undefined
          }
        >
          {contentNode}
        </GridCol>

        <GridCol span={{ base: 12, md: 4 }}>{isModal ? propertiesNode : null}</GridCol>
      </Grid>
    </Box>
  );
}
