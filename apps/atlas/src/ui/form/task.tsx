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
  ScrollArea,
  Select,
  Stack,
  Text,
  Textarea,
  TextInput,
  Tooltip,
} from '@mantine/core';
import { useAppshellChild, useFormTask } from '@repo/hooks';
import { Order, Priority, TaskGet } from '@repo/types';
import {
  useReminderActions,
  useStoreReminder,
  useStoreTaskList,
  useSubView,
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
  IconTrash,
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
            label={!options?.modal ? undefined : 'Task List'}
            placeholder={views.inboxView ? 'Inbox' : 'Task list'}
            size="xs"
            clearable
            clearSectionMode="clear"
            searchable
            disabled={creatingTask && (views.inboxView || !!taskListId)}
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
    const reminders = useStoreReminder((s) => s.reminders);
    const reminder = reminders?.find((ri) => ri.taskId == defaultValues?.id);

    const [withReminder, setWithReminder] = useState<boolean>(!!reminder);
    const [reminderState, seReminderState] = useState<string | null>(
      !reminder?.remindAt ? null : new Date(reminder?.remindAt).toISOString(),
    );

    const { reminderCreate, reminderUpdate, reminderDelete } = useReminderActions();

    useEffect(() => {
      if (reminderState) return;
      setWithReminder(false);
    }, [reminderState]);

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
              remindAt: now.toISOString() as any,
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
        gap={5}
        style={{
          transition: '.1s all ease',
          height:
            !defaultValues?.dueDate && !form.values?.dueDate
              ? 0
              : withReminder
                ? options?.modal
                  ? 16 + 5 + 54.8
                  : 16 + 5 + 30
                : 16,
          overflow: 'hidden',
        }}
      >
        <Checkbox
          label={'With reminder'}
          // defaultChecked={withReminder}
          checked={withReminder}
          onChange={(event) => setWithReminder(event.currentTarget.checked)}
          disabled={!!withReminder && !!reminderState}
        />

        <Box
          style={{
            transition: '.1s all ease',
            height: withReminder ? (options?.modal ? 54.8 : 30) : 0,
            overflow: 'hidden',
          }}
        >
          <DateTimePicker
            aria-label={'Reminder'}
            label={!options?.modal ? undefined : 'Reminder'}
            placeholder="Reminder"
            size="xs"
            clearable
            leftSection={<IconClock size={ICON_SIZE - 4} stroke={ICON_STROKE_WIDTH} />}
            value={reminderState}
            onChange={seReminderState}
            minDate={dayjs(defaultValues?.dueDate || form.values?.dueDate).format('YYYY-MM-DD')}
            timePickerProps={{
              withDropdown: true,
              popoverProps: { withinPortal: false },
              format: '12h',
            }}
          />
        </Box>
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

            <Divider mt={16} mb={8} />

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

            <Divider my={16} />

            {options?.modal && <SectionReminder />}
          </Flex>
        </ScrollArea>

        <Divider my={options?.modal ? undefined : sharedPadding} />

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
          <ScrollArea h={sharedHeight} p={options?.withoutCheck ? 'xs' : sharedPadding}>
            <Grid gap={0}>
              {!options?.withoutCheck && (
                <GridCol span={options?.modal ? 1 : 0.5}>
                  <Group pl={options?.modal ? 5 : 0}>
                    <Checkbox
                      aria-label={'Complete'}
                      defaultChecked={form.values.complete}
                      {...form.getInputProps('complete')}
                      disabled={creatingTask && views.completeView}
                      size="sm"
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
                      size="md"
                      variant="unstyled"
                      styles={{
                        input: {
                          backgroundColor: 'transparent',
                          fontWeight: 'bold',
                        },
                      }}
                      {...form.getInputProps('title')}
                    />

                    <div>
                      <Textarea
                        aria-label={'Description'}
                        placeholder="Description"
                        size="sm"
                        variant="unstyled"
                        styles={{
                          input: {
                            backgroundColor: 'transparent',
                            fontWeight: 500,
                          },
                        }}
                        {...form.getInputProps('description')}
                        autosize
                        minRows={1}
                        maxRows={options?.modal ? undefined : 5}
                      />
                    </div>
                  </div>

                  {!options?.modal && <TaskProperties />}

                  {!defaultValues?.updatedAt &&
                    asideViewValue == ASIDE_VIEW_NAMES.NEW.STRIDE.TASK &&
                    options?.withoutCheck && (
                      <div>
                        <Checkbox
                          label={'Close when done'}
                          checked={checked}
                          onChange={(event) => setChecked(event.currentTarget.checked)}
                          mt={'xs'}
                        />
                      </div>
                    )}
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
