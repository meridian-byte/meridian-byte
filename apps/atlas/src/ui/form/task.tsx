'use client';

import React, { useEffect, useState } from 'react';
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
  Text,
  Textarea,
  TextInput,
  Tooltip,
} from '@mantine/core';
import { useAppshellChild, useFormTask } from '@repo/hooks';
import { Frequency, Order, Priority, TaskGet } from '@repo/types';
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
  IconBell,
  IconCalendarEvent,
  IconCategory,
  IconClock,
  IconFlag,
  IconRepeat,
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

export default function Task({
  defaultValues,
  onUnmount,
  options,
}: {
  defaultValues?: Partial<TaskGet>;
  onUnmount?: React.Dispatch<React.SetStateAction<boolean>>;
  options?: { modal?: boolean; withoutCheck?: boolean };
}) {
  const [checked, setChecked] = useState(options?.withoutCheck);
  const { form, submitted, handleSubmit, views, taskListId } = useFormTask({
    options: { closeWhenDone: checked },
    defaultValues,
  });

  const { closeModalView } = useViewModal();
  const { asideViewValue } = useViewAside();
  const { handleToggleChildAside } = useAppshellChild();

  const taskLists = useStoreTaskList((s) => s.taskLists);

  const creatingTask = !defaultValues?.updatedAt;

  const sharedPadding = 'md';
  const sharedHeight = options?.modal ? 400 : undefined;

  function InputTaskList() {
    return (
      <div>
        {
          <Select
            aria-label={'Task list'}
            label={!options?.modal ? undefined : 'Task list'}
            placeholder={views.inboxView ? 'Inbox' : 'Task list'}
            size="xs"
            clearable
            clearSectionMode="clear"
            searchable
            // disabled={creatingTask && (views.inboxView || !!taskListId)}
            {...form.getInputProps('taskListId')}
            leftSection={<IconCategory size={ICON_SIZE - 4} stroke={ICON_STROKE_WIDTH} />}
            data={(taskLists || []).map((tli) => {
              return {
                value: tli.id,
                label: tli.title,
              };
            })}
          />
        }
      </div>
    );
  }

  function SectionReminder() {
    const tasks = useStoreTask((s) => s.tasks);
    const task = tasks?.find((ti) => ti.id == defaultValues?.id);

    const reminders = useStoreReminder((s) => s.reminders);
    const reminder = reminders?.find((ri) => ri.taskId == defaultValues?.id);

    const [withReminder, setWithReminder] = useState<boolean>(!!reminder);
    const [reminderState, seReminderState] = useState<string | null>(
      !reminder?.remindAt ? null : new Date(reminder?.remindAt).toISOString(),
    );

    const { reminderCreate, reminderUpdate, reminderDelete } = useReminderActions();

    const currentDueDate = form.values?.dueDate || defaultValues?.dueDate;

    useEffect(() => {
      if (reminderState) return;
      setWithReminder(false);
    }, [reminderState]);

    // Clamp or reset reminder when Due Date changes

    const getDefaultReminderTime = (dueDate: Date | string) => {
      // Always return 9:00 AM on the due date
      return dayjs(dueDate).hour(9).minute(0).second(0).millisecond(0).toDate();
    };

    useEffect(() => {
      // Case 1: Due date removed or checkbox unticked -> clear reminder state
      if (!currentDueDate || !withReminder) {
        if (reminderState !== null) {
          seReminderState(null);
        }
        return;
      }

      // Case 2: Checkbox turned ON, but state is currently empty -> populate default
      if (!reminderState) {
        seReminderState(getDefaultReminderTime(currentDueDate).toISOString());
        return;
      }

      // Case 3: Due date shifted earlier than active reminder -> reset/clamp time
      const dueDateEnd = dayjs(currentDueDate).endOf('day');
      if (dayjs(reminderState).isAfter(dueDateEnd)) {
        seReminderState(getDefaultReminderTime(currentDueDate).toISOString());
      }
    }, [currentDueDate, withReminder]);

    useEffect(() => {
      if (tasks === undefined) return;
      if (tasks === null) return;
      if (reminders === undefined) return;
      if (reminders === null) return;

      if (!task) return;
      if (task.dueDate) return;
      if (!reminder) return;

      // console.log('delete reminder (auto)');

      reminderDelete(reminder);
    }, [task?.dueDate]);

    useEffect(() => {
      if (reminders === undefined) return;
      if (reminders === null) return;

      const now = new Date();

      if (!reminder) {
        if (!reminderState) {
          return;
        } else {
          // console.log('create reminder');
          if (defaultValues?.updatedAt) {
            reminderCreate({
              id: generateUUID(),
              remindAt: getDefaultReminderTime(
                new Date(currentDueDate || now).toISOString(),
              ).toISOString() as any,
              taskId: defaultValues.id,
            });
          }
        }
      } else {
        if (!reminderState) {
          // console.log('delete reminder');
          reminderDelete(reminder);
        } else {
          if (new Date(reminder.remindAt).toISOString() == reminderState) {
            return;
          } else {
            // console.log('update reminder');
            reminderUpdate({
              ...reminder,
              remindAt: reminderState as any,
            });
          }
        }
      }
    }, [reminderState]);

    return (
      <Stack
        gap={withReminder ? 'xs' : 0}
        style={{
          transition: '.1s all ease',
          height:
            !defaultValues?.dueDate && !form.values?.dueDate ? 0 : withReminder ? 16 + 10 + 30 : 16,
          overflow: 'hidden',
        }}
      >
        <Checkbox
          label={'Remind'}
          checked={withReminder}
          onChange={(event) => setWithReminder(event.currentTarget.checked)}
          disabled={!!withReminder && !!reminderState}
        />

        <DateTimePicker
          aria-label={'Remind at'}
          placeholder="Remind at"
          size="xs"
          clearable
          leftSection={<IconClock size={ICON_SIZE - 4} stroke={ICON_STROKE_WIDTH} />}
          value={reminderState}
          onChange={seReminderState}
          maxDate={
            defaultValues?.dueDate || form.values?.dueDate
              ? dayjs(defaultValues?.dueDate || form.values?.dueDate)
                  .endOf('day')
                  .toDate()
              : undefined
          }
          timePickerProps={{
            withDropdown: true,
            popoverProps: { withinPortal: false },
            format: '12h',
          }}
        />
      </Stack>
    );
  }

  function SectionRecurring() {
    const tasks = useStoreTask((s) => s.tasks);
    const task = tasks?.find((ti) => ti.id == defaultValues?.id);

    const recurringRules = useStoreRecurringRule((s) => s.recurringRules);
    const recurringRule = recurringRules?.find((ri) => ri.id == defaultValues?.recurringRuleId);

    const [withRecurringRule, setWithRecurringRule] = useState<boolean>(!!recurringRule);
    const [frequencyState, setFrequencyState] = useState<string | null>(
      recurringRule?.frequency || null,
    );
    const [intervalState, setIntervalState] = useState<number | string>(
      recurringRule?.interval || '',
    );

    const { recurringRuleCreate, recurringRuleUpdate, recurringRuleDelete } =
      useRecurringRuleActions();
    const { taskUpdate } = useTaskActions();

    useEffect(() => {
      if (!withRecurringRule) return;
      setIntervalState(recurringRule?.interval || 1);
      setFrequencyState(recurringRule?.frequency || Frequency.WEEKLY);
    }, [withRecurringRule]);

    useEffect(() => {
      if (intervalState) return;
      if (frequencyState) return;

      setWithRecurringRule(false);
    }, [intervalState, frequencyState]);

    useEffect(() => {
      if (tasks === undefined) return;
      if (tasks === null) return;
      if (recurringRule === undefined) return;
      if (recurringRule === null) return;

      if (!task) return;
      if (task.dueDate) return;
      if (!recurringRule) return;

      // console.log('delete recurringRule (auto)');

      recurringRuleDelete(recurringRule);

      if (defaultValues?.updatedAt) {
        taskUpdate({
          ...(defaultValues as TaskGet),
          recurringRuleId: null,
        });
      }
    }, [task?.dueDate]);

    useEffect(() => {
      if (recurringRules === undefined) return;
      if (recurringRules === null) return;

      if (!recurringRule) {
        if (!frequencyState && !intervalState) {
          return;
        } else {
          // console.log('create recurringRule');

          if (defaultValues?.updatedAt) {
            if (frequencyState && intervalState) {
              const newRule = recurringRuleCreate({
                id: generateUUID(),
                frequency: frequencyState as Frequency,
                interval: typeof intervalState == 'string' ? 1 : intervalState,
              });

              if (newRule) {
                taskUpdate({
                  ...(defaultValues as TaskGet),
                  recurringRuleId: newRule.id,
                });
              }
            }
          }
        }
      } else {
        if (!frequencyState && !intervalState) {
          // console.log('delete recurringRule');

          recurringRuleDelete(recurringRule);

          if (defaultValues?.updatedAt) {
            taskUpdate({
              ...(defaultValues as TaskGet),
              recurringRuleId: null,
            });
          }
        } else {
          if (
            recurringRule.frequency == frequencyState &&
            recurringRule.interval == intervalState
          ) {
            return;
          } else {
            // console.log('update recurringRule');

            if (frequencyState && intervalState) {
              recurringRuleUpdate({
                ...recurringRule,
                frequency: frequencyState as Frequency,
                interval: typeof intervalState == 'string' ? 1 : intervalState,
              });
            }
          }
        }
      }
    }, [intervalState, frequencyState]);

    return (
      <Stack
        gap={withRecurringRule ? 'xs' : 0}
        style={{
          transition: '.1s all ease',
          height:
            !defaultValues?.dueDate && !form.values?.dueDate
              ? 0
              : withRecurringRule
                ? 16 + 10 + 18.6 + 2 + 30
                : 16,
          overflow: 'hidden',
        }}
      >
        <Checkbox
          label={'Repeat'}
          checked={withRecurringRule}
          onChange={(event) => setWithRecurringRule(event.currentTarget.checked)}
          disabled={!!intervalState || !!frequencyState}
        />

        <Stack gap={2}>
          <Text inherit fz={'xs'} fw={500}>
            Every
          </Text>

          <Group gap={5} wrap="nowrap">
            <NumberInput
              w={'30%'}
              aria-label={'Int.'}
              placeholder="Int."
              size="xs"
              value={intervalState}
              onChange={setIntervalState}
            />

            <Select
              w={'70%'}
              aria-label={'Frequency'}
              placeholder="Frequency"
              size="xs"
              clearable
              value={frequencyState}
              onChange={setFrequencyState}
              disabled={!intervalState}
              leftSection={<IconRepeat size={ICON_SIZE - 4} stroke={ICON_STROKE_WIDTH} />}
              data={[
                {
                  value: Frequency.DAILY,
                  label: `Day${Number(intervalState) > 1 ? 's' : ''}`,
                },
                {
                  value: Frequency.WEEKLY,
                  label: `Week${Number(intervalState) > 1 ? 's' : ''}`,
                },
                {
                  value: Frequency.MONTHLY,
                  label: `Month${Number(intervalState) > 1 ? 's' : ''}`,
                },
                {
                  value: Frequency.ANNUALLY,
                  label: `Year${Number(intervalState) > 1 ? 's' : ''}`,
                },
              ]}
            />

            <Tooltip label={'Delete rule'}>
              <ActionIcon
                size={ICON_WRAPPER_SIZE}
                color="red"
                variant="light"
                onClick={() => {
                  setIntervalState('');
                  setFrequencyState('');
                }}
              >
                <IconX size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
              </ActionIcon>
            </Tooltip>
          </Group>
        </Stack>
      </Stack>
    );
  }

  function TaskProperties() {
    return (
      <Stack h={sharedHeight} gap={0}>
        <ScrollArea flex={1}>
          <Flex
            align={options?.modal || options?.withoutCheck ? undefined : 'center'}
            direction={options?.modal || options?.withoutCheck ? 'column' : 'row'}
            pt={options?.modal ? sharedPadding : undefined}
            px={options?.modal ? sharedPadding : undefined}
            gap={options?.modal ? undefined : 5}
            pb={options?.modal ? sharedPadding : 0}
            // mih={'100vh'}
          >
            {(options?.modal || options?.withoutCheck) && <InputTaskList />}

            <div>
              <Select
                aria-label="Priority"
                label={!options?.modal ? undefined : 'Priority'}
                placeholder="Priority"
                size="xs"
                // clearable
                {...form.getInputProps('priority')}
                leftSection={
                  <Box
                    c={
                      !form.values.priority
                        ? undefined
                        : `${getPriorityDetails(form.values.priority as Priority).color}.6`
                    }
                  >
                    <IconFlag size={ICON_SIZE - 4} stroke={ICON_STROKE_WIDTH} />
                  </Box>
                }
                data={sortArray(
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
                )}
              />
            </div>

            <Divider mt={options?.modal ? 16 : 8} mb={8} />

            <div>
              <DateInput
                aria-label={'Due date'}
                label={!options?.modal ? undefined : 'Due date'}
                placeholder="Due date"
                size="xs"
                clearable
                disabled={creatingTask && views.todayView}
                minDate={
                  creatingTask && views.upcomingView
                    ? dayjs(getTomorrow()).format('YYYY-MM-DD')
                    : undefined
                }
                maxDate={
                  creatingTask && views.overdueView
                    ? dayjs(getYesterday()).format('YYYY-MM-DD')
                    : undefined
                }
                {...form.getInputProps('dueDate')}
                leftSection={<IconCalendarEvent size={ICON_SIZE - 4} stroke={ICON_STROKE_WIDTH} />}
              />
            </div>

            {options?.modal && (
              <>
                {defaultValues?.dueDate && <Divider my={16} />}
                <SectionReminder />
              </>
            )}

            {options?.modal && (
              <>
                {defaultValues?.dueDate && <Divider my={16} />}
                <SectionRecurring />
              </>
            )}
          </Flex>
        </ScrollArea>

        <Divider my={options?.modal ? undefined : sharedPadding} />

        {!defaultValues?.updatedAt &&
          asideViewValue == ASIDE_VIEW_NAMES.NEW.STRIDE.TASK &&
          options?.withoutCheck && (
            <div>
              <Checkbox
                label={'Close when done'}
                checked={checked}
                onChange={(event) => setChecked(event.currentTarget.checked)}
                mb={'xs'}
              />
            </div>
          )}

        <Group
          justify={options?.modal ? 'end' : 'space-between'}
          gap="xs"
          p={options?.modal ? sharedPadding : undefined}
        >
          {!(options?.modal || options?.withoutCheck) && <InputTaskList />}

          <Group gap={'xs'}>
            <Button
              disabled={submitted}
              variant="default"
              size="xs"
              onClick={() => {
                if (onUnmount && !options?.withoutCheck) {
                  onUnmount(false);
                } else {
                  if (!defaultValues?.updatedAt) {
                    handleToggleChildAside();
                  } else {
                    closeModalView();
                  }
                }
              }}
            >
              {'Close'}
            </Button>

            <Button
              display={!defaultValues?.updatedAt ? undefined : 'none'}
              type="submit"
              size="xs"
              loading={submitted}
            >
              {submitted ? 'Adding' : 'Add'}
            </Button>

            {options?.modal && (
              <>
                <Divider orientation="vertical" h={16} my={'auto'} />

                {
                  <Tooltip label={'Delete task'}>
                    <ActionIcon
                      size={ICON_WRAPPER_SIZE}
                      color="red"
                      variant="light"
                      onClick={() => {}}
                    >
                      <IconTrash size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
                    </ActionIcon>
                  </Tooltip>
                }
              </>
            )}
          </Group>
        </Group>
      </Stack>
    );
  }

  return (
    <Box
      component="form"
      onSubmit={form.onSubmit(() => {
        handleSubmit();
        if (onUnmount) onUnmount(false);
      })}
      noValidate
    >
      <Grid gap={0}>
        <GridCol
          span={{ base: 12, md: options?.modal ? 8 : 12 }}
          bg={
            options?.modal
              ? 'light-dark(var(--mantine-color-gray-1), var(--mantine-color-dark-8))'
              : undefined
          }
        >
          <ScrollArea
            h={sharedHeight}
            py={options?.modal ? undefined : 0}
            p={options?.withoutCheck ? 'xs' : sharedPadding}
          >
            <Grid gap={0}>
              {!options?.withoutCheck && (
                <GridCol span={options?.modal ? 1 : 0.5}>
                  <Group pl={options?.modal ? 5 : 0}>
                    <Checkbox
                      aria-label={'Complete'}
                      defaultChecked={form.values.complete}
                      {...form.getInputProps('complete')}
                      size="sm"
                      disabled={creatingTask && views.completeView}
                      radius={99}
                      mt={12}
                    />
                  </Group>
                </GridCol>
              )}

              <GridCol span={options?.modal ? 11 : options?.withoutCheck ? 12 : 11.5}>
                <Stack gap={'xs'}>
                  <div>
                    <TextInput
                      required
                      aria-label={'Title'}
                      placeholder="Title"
                      variant="unstyled"
                      styles={{
                        input: {
                          backgroundColor: 'transparent',
                          fontWeight: 'bold',
                        },
                      }}
                      {...form.getInputProps('title')}
                      size="md"
                    />

                    <div>
                      <Textarea
                        aria-label={'Description'}
                        placeholder="Description"
                        variant="unstyled"
                        styles={{
                          input: {
                            backgroundColor: 'transparent',
                            padding: 0,
                            fontWeight: 500,
                          },
                        }}
                        {...form.getInputProps('description')}
                        size="sm"
                        autosize
                        minRows={1}
                        maxRows={options?.modal ? undefined : 5}
                      />
                    </div>
                  </div>

                  {!options?.modal && <TaskProperties />}
                </Stack>
              </GridCol>
            </Grid>
          </ScrollArea>
        </GridCol>

        {options?.modal && (
          <GridCol span={{ base: 12, md: 4 }}>
            <TaskProperties />
          </GridCol>
        )}
      </Grid>
    </Box>
  );
}
