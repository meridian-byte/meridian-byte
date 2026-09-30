'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  ActionIcon,
  Box,
  Button,
  Checkbox,
  Divider,
  Flex,
  Grid,
  GridCol,
  Group,
  NumberInput,
  ScrollArea,
  ScrollAreaAutosize,
  Select,
  Stack,
  Text,
  Textarea,
  TextInput,
  Tooltip,
} from '@mantine/core';
import { DateInput, DateTimePicker, TimePicker } from '@mantine/dates';
import { useFormEvent } from '@repo/hooks';
import dayjs from 'dayjs';
import {
  useEventActions,
  useRecurringRuleActions,
  useReminderActions,
  useStoreCalendar,
  useStoreEvent,
  useStoreRecurringRule,
  useStoreReminder,
  useViewModal,
} from '@repo/store';
import { EventFormData, Frequency } from '@repo/types';
import { useAppshellChild } from '@repo/hooks';
import {
  IconAlignJustified,
  IconBell,
  IconClock,
  IconCursorText,
  IconMapPin,
  IconPin,
  IconRepeat,
  IconTrash,
  IconX,
} from '@tabler/icons-react';
import { ICON_SIZE, ICON_STROKE_WIDTH, ICON_WRAPPER_SIZE, SECTION_SPACING } from '@repo/constants';
import { generateUUID, prependZeros } from '@repo/utils';

interface EventFormProps {
  modal?: boolean;
  initialData?: EventFormData | null;
  onClose?: () => void;
}

export default function Event({ modal, initialData, onClose }: EventFormProps) {
  const [checked, setChecked] = useState(true);

  const { closeModalView } = useViewModal();
  const { handleToggleChildAside } = useAppshellChild();

  const events = useStoreEvent((s) => s.events);
  const targetEvent = events?.find((e) => e.id === initialData?.id);

  const calendars = useStoreCalendar((s) => s.calendars);
  const { eventDelete } = useEventActions(); // Assuming you have a delete action in your store

  const { form, submitted, handleSubmit } = useFormEvent({
    modal,
    defaultValues: targetEvent,
    options: { closeWhenDone: checked },
  });

  // Keep form values synced with clicked calendar slots or selected events
  useEffect(() => {
    if (initialData) {
      form.setValues({
        id: initialData.id,
        title: initialData.title || '',
        description: initialData.description || '',
        location: initialData.location || '',
        calendarId: initialData.calendarId || '',
        allDay: initialData.allDay ?? false,
        start: initialData.start || new Date(),
        end: initialData.end || new Date(),
      });
    }
  }, [initialData]);

  const handleDelete = () => {
    if (!initialData?.id) return;

    if (targetEvent) {
      eventDelete(targetEvent);
      if (onClose) onClose();
    }
  };

  const allDayProps = {
    component: form.values.allDay ? DateInput : DateTimePicker,
    props: {
      required: true,
      label: 'Start',
      placeholder: 'Start',
      valueFormat: `DD MMM YYYY${form.values.allDay ? '' : ' HH:mm A'}`,
      presets: [
        {
          value: dayjs().subtract(1, 'day').format('YYYY-MM-DD HH:mm:ss'),
          label: 'Yesterday',
        },
        { value: dayjs().format('YYYY-MM-DD HH:mm:ss'), label: 'Today' },
        { value: dayjs().add(1, 'day').format('YYYY-MM-DD HH:mm:ss'), label: 'Tomorrow' },
        { value: dayjs().add(1, 'month').format('YYYY-MM-DD HH:mm:ss'), label: 'Next month' },
      ],
    },
  };

  const sharedPadding = 'md';
  const sharedHeight = modal ? 400 : undefined;

  function InputCalendar() {
    return (
      <Select
        label="Calendar"
        placeholder="Select calendar"
        disabled={!calendars}
        loading={calendars === undefined}
        {...form.getInputProps('calendarId')}
        data={(calendars || []).map((ci) => {
          return {
            label: ci.title,
            value: ci.id,
          };
        })}
      />
    );
  }

  function SectionReminder() {
    const reminders = useStoreReminder((s) => s.reminders);
    const reminder = reminders?.find((ri) => ri.eventId == initialData?.id);

    const [withReminder, setWithReminder] = useState<boolean>(!!reminder);

    const [reminderState, seReminderState] = useState<string | null>(
      !reminder ? null : getTimeFormat(new Date(reminder.remindAt)),
    );

    const { reminderCreate, reminderUpdate, reminderDelete } = useReminderActions();

    const currentStartDate = form.values.start || initialData?.start || new Date();

    useEffect(() => {
      if (reminderState) return;
      setWithReminder(false);
    }, [reminderState]);

    const getDefaultReminderTime = (dueDate: Date | string) => {
      // Always return 9:00 AM on the due date
      return dayjs(dueDate).hour(9).minute(0).second(0).millisecond(0).toDate();
    };

    useEffect(() => {
      if (withReminder) {
        // Case 1: Checkbox turned ON, but state is currently empty -> populate default
        if (!reminderState) {
          seReminderState(getTimeFormat(getDefaultReminderTime(currentStartDate).toISOString()));
          return;
        }

        // Case 2: Startdate shifted earlier than active reminder -> reset/clamp time
        const dueDateEnd = dayjs(currentStartDate).endOf('day');
        if (dayjs(reminder?.remindAt).isAfter(dueDateEnd)) {
          seReminderState(getTimeFormat(getDefaultReminderTime(currentStartDate).toISOString()));
        }
      }
    }, [currentStartDate, withReminder]);

    useEffect(() => {
      if (reminders === undefined) return;
      if (reminders === null) return;
      if (!form.values.start) return;

      if (!reminder) {
        if (!reminderState) {
          return;
        } else {
          // console.log('create reminder');
          const [hours, minutes] = (getTimeFormat(currentStartDate) || '').split(':').map(Number);

          const newDate = new Date(
            new Date(currentStartDate).getFullYear(),
            new Date(currentStartDate).getMonth(),
            new Date(currentStartDate).getDate(),
            hours,
            minutes,
          );

          if (initialData) {
            reminderCreate({
              id: generateUUID(),
              remindAt: getDefaultReminderTime(
                new Date(newDate).toISOString(),
              ).toISOString() as any,
              eventId: initialData.id,
            });
          }
        }
      } else {
        if (!reminderState) {
          // console.log('delete reminder');
          reminderDelete(reminder);
        } else {
          const timeMatches = getTimeFormat(new Date(reminder.remindAt)) == reminderState;
          const dayMatches =
            new Date(reminder.remindAt).getDay() == new Date(currentStartDate).getDay();

          if (timeMatches && dayMatches) {
            return;
          } else {
            // console.log('update reminder');

            const dateToUse =
              (!timeMatches && !dayMatches) || !dayMatches ? currentStartDate : reminder.remindAt;

            const [hours, minutes] = reminderState.split(':').map(Number);

            const updatedDate = new Date(
              new Date(dateToUse).getFullYear(),
              new Date(dateToUse).getMonth(),
              new Date(dateToUse).getDate(),
              hours,
              minutes,
            );

            reminderUpdate({
              ...reminder,
              remindAt: new Date(updatedDate).toISOString() as any,
            });
          }
        }
      }
    }, [reminderState]);

    return (
      <Stack gap={withReminder ? 'xs' : 0}>
        <Checkbox
          label={'Remind'}
          checked={withReminder}
          onChange={(event) => setWithReminder(event.currentTarget.checked)}
          disabled={!!withReminder && !!reminderState}
        />

        <Box
          style={{
            transition: '.1s all ease',
            height: withReminder ? 30 : 0,
            overflow: 'hidden',
          }}
        >
          <TimePicker
            aria-label={'Reminder'}
            size="xs"
            clearable
            leftSection={<IconClock size={ICON_SIZE - 4} stroke={ICON_STROKE_WIDTH} />}
            format="12h"
            max={
              !form.values?.start ? undefined : getTimeFormat(dayjs(form.values?.start).toDate())
            }
            value={reminderState || undefined}
            onChange={seReminderState}
            withDropdown
          />
        </Box>
      </Stack>
    );
  }

  function SectionRecurring() {
    const events = useStoreEvent((s) => s.events);
    const event = events?.find((ti) => ti.id == initialData?.id);

    const recurringRules = useStoreRecurringRule((s) => s.recurringRules);
    const recurringRule = recurringRules?.find((ri) => ri.id == event?.recurringRuleId);

    const [withRecurringRule, setWithRecurringRule] = useState<boolean>(!!recurringRule);
    const [frequencyState, setFrequencyState] = useState<string | null>(
      recurringRule?.frequency || null,
    );
    const [intervalState, setIntervalState] = useState<number | string>(
      recurringRule?.interval || '',
    );

    const { recurringRuleCreate, recurringRuleUpdate, recurringRuleDelete } =
      useRecurringRuleActions();
    const { eventUpdate } = useEventActions();

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
      if (recurringRules === undefined) return;
      if (recurringRules === null) return;

      if (!recurringRule) {
        if (!frequencyState && !intervalState) {
          return;
        } else {
          console.log('create recurringRule');

          if (event) {
            if (frequencyState && intervalState) {
              const newRule = recurringRuleCreate({
                id: generateUUID(),
                frequency: frequencyState as Frequency,
                interval: typeof intervalState == 'string' ? 1 : intervalState,
              });

              if (newRule) {
                eventUpdate({
                  ...event,
                  recurringRuleId: newRule.id,
                });
              }
            }
          }
        }
      } else {
        if (!frequencyState && !intervalState) {
          console.log('delete recurringRule');

          // recurringRuleDelete(recurringRule);

          // if (event) {
          //   eventUpdate({
          //     ...event,
          //     recurringRuleId: null,
          //   });
          // }
        } else {
          if (
            recurringRule.frequency == frequencyState &&
            recurringRule.interval == intervalState
          ) {
            return;
          } else {
            console.log('update recurringRule');

            // if (frequencyState && intervalState) {
            //   recurringRuleUpdate({
            //     ...recurringRule,
            //     frequency: frequencyState as Frequency,
            //     interval: typeof intervalState == 'string' ? 1 : intervalState,
            //   });
            // }
          }
        }
      }
    }, [intervalState, frequencyState]);

    return (
      <Stack
        gap={withRecurringRule ? 'xs' : 0}
        style={{
          transition: '.1s all ease',
          height: !event?.start ? 0 : withRecurringRule ? 16 + 10 + 18.6 + 2 + 30 : 16,
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

  return (
    <Box
      component="form"
      onSubmit={form.onSubmit(() => {
        handleSubmit();
        if (onClose) onClose();
      })}
      noValidate
    >
      <Grid gap={0}>
        <GridCol span={{ base: 12, md: modal ? 8 : 12 }}>
          <ScrollAreaAutosize mah={sharedHeight}>
            <Stack
              gap={0}
              p={sharedPadding}
              py={modal ? undefined : 0}
              mih={!modal ? undefined : sharedHeight}
              bg={
                !modal
                  ? undefined
                  : 'light-dark(var(--mantine-color-gray-1), var(--mantine-color-dark-7))'
              }
            >
              <TextInput
                required
                aria-label={'Title'}
                placeholder="Title"
                variant="unstyled"
                data-autofocus
                styles={{
                  input: { backgroundColor: 'transparent', padding: 0, fontWeight: 'bold' },
                }}
                {...form.getInputProps('title')}
                size={'md'}
              />

              <Textarea
                aria-label="Description"
                placeholder="Description"
                variant="unstyled"
                styles={{
                  input: { backgroundColor: 'transparent', padding: 0, fontWeight: 500 },
                }}
                {...form.getInputProps('description')}
                autosize
                minRows={1}
                maxRows={5}
                size={'sm'}
              />

              {modal && (
                <Divider
                  mt={'xs'}
                  mb={5}
                  color="light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-6))"
                />
              )}

              <TextInput
                aria-label="Location"
                label={!modal ? 'Location' : undefined}
                placeholder="Location"
                variant="unstyled"
                leftSection={<IconMapPin size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />}
                styles={{
                  input: {
                    backgroundColor: 'transparent',
                    fontWeight: 500,
                  },
                }}
                {...form.getInputProps('location')}
              />
            </Stack>
          </ScrollAreaAutosize>
        </GridCol>

        <GridCol span={{ base: 12, md: modal ? 4 : 12 }}>
          <Stack h={modal ? sharedHeight : undefined} gap={0}>
            <ScrollArea flex={1}>
              <Stack
                pt={modal ? undefined : 0}
                p={sharedPadding}
                py={modal ? undefined : 0}
                gap={0}
                // mih={'100vh'}
              >
                {modal && <InputCalendar />}

                <Divider my={16} />

                <Stack gap={5}>
                  <Checkbox
                    label={'All day event'}
                    checked={form.values.allDay}
                    onChange={(event) => {
                      const isChecked = event.currentTarget.checked;
                      form.setFieldValue('allDay', isChecked);

                      if (isChecked && form.values.start) {
                        const newStart = dayjs(form.values.start).format('YYYY-MM-DD 00:00:00');
                        const newEnd = dayjs(form.values.start)
                          .add(1, 'day')
                          .startOf('day')
                          .format('YYYY-MM-DD HH:mm:ss');

                        form.setFieldValue('start', newStart as any);
                        form.setFieldValue('end', newEnd as any);
                      }
                    }}
                  />

                  <div>
                    <Box display={!form.values.allDay ? 'none' : undefined}>
                      <DateInput
                        {...allDayProps.props}
                        {...form.getInputProps('start')}
                        valueFormat={'DD MMM YYYY'}
                      />
                    </Box>

                    <Box display={form.values.allDay ? 'none' : undefined}>
                      <DateTimePicker
                        {...allDayProps.props}
                        value={form.values.start}
                        onChange={(value) => {
                          const newStart = value;
                          let newEnd: any = form.values.end;

                          if (newStart) {
                            // If end date doesn't exist or new start is >= current end date
                            if (!newEnd || new Date(newStart) >= new Date(newEnd)) {
                              // Calculate a date 1 hour ahead of the new start time
                              const oneHourLater = new Date(
                                new Date(newStart).getTime() + 60 * 60 * 1000,
                              );

                              newEnd = oneHourLater;
                            }
                          }

                          form.setValues({
                            ...form.values,
                            start: newStart as any,
                            end: newEnd,
                          });
                        }}
                        timePickerProps={{
                          withDropdown: true,
                          popoverProps: { withinPortal: false },
                          format: '12h',
                        }}
                      />
                    </Box>
                  </div>
                </Stack>

                <Box
                  style={{
                    transition: '.1s all ease',
                    height: form.values.allDay ? 0 : 54.8,
                    overflow: 'hidden',
                  }}
                >
                  <DateTimePicker
                    required
                    label="End"
                    placeholder="End"
                    value={form.values.end}
                    onChange={(value) => {
                      const newEnd = value;
                      let newStart: any = form.values.start;

                      if (newEnd) {
                        // If start date doesn't exist or new end is <= current start date
                        if (!newStart || new Date(newEnd) <= new Date(newStart)) {
                          // Calculate a date 1 hour before the new end time
                          const oneHourEarlier = new Date(
                            new Date(newEnd).getTime() - 60 * 60 * 1000,
                          );

                          newStart = oneHourEarlier;
                        }
                      }

                      form.setValues({
                        ...form.values,
                        start: newStart,
                        end: newEnd as any,
                      });
                    }}
                    valueFormat={allDayProps.props.valueFormat}
                    disabled={form.values.allDay}

                    timePickerProps={{
                      withDropdown: true,
                      popoverProps: { withinPortal: false },
                      format: '12h',
                    }}

                    presets={[
                      {
                        value: dayjs().subtract(1, 'day').format('YYYY-MM-DD HH:mm:ss'),
                        label: 'Yesterday',
                      },
                      { value: dayjs().format('YYYY-MM-DD HH:mm:ss'), label: 'Today' },
                      {
                        value: dayjs().add(1, 'day').format('YYYY-MM-DD HH:mm:ss'),
                        label: 'Tomorrow',
                      },
                      {
                        value: dayjs().add(1, 'month').format('YYYY-MM-DD HH:mm:ss'),
                        label: 'Next month',
                      },
                    ]}
                  />
                </Box>

                {modal && (
                  <>
                    {initialData?.id && (
                      <>
                        <Divider my={16} />
                        <SectionReminder />
                      </>
                    )}

                    {initialData?.id && (
                      <>
                        <Divider my={16} />
                        <SectionRecurring />
                      </>
                    )}
                  </>
                )}
              </Stack>
            </ScrollArea>

            <Box px={modal ? undefined : sharedPadding}>
              <Divider my={modal ? undefined : sharedPadding} />
            </Box>

            {modal && (
              <>
                <Group
                  justify={modal ? 'end' : 'space-between'}
                  gap="xs"
                  p={modal ? sharedPadding : undefined}
                >
                  {!modal && <InputCalendar />}

                  <Group gap={'xs'}>
                    <Button
                      disabled={submitted}
                      variant="default"
                      size="xs"
                      onClick={() => {
                        if (modal) {
                          if (onClose) onClose();
                        } else {
                          if (!initialData) {
                            handleToggleChildAside();
                          } else {
                            closeModalView();
                          }
                        }
                      }}
                    >
                      {'Close'}
                    </Button>

                    {!initialData?.id && (
                      <Button
                        display={!initialData?.id ? undefined : 'none'}
                        type="submit"
                        size="xs"
                        loading={submitted}
                      >
                        {submitted ? 'Adding' : 'Add'}
                      </Button>
                    )}

                    {initialData?.id && (
                      <>
                        <Divider orientation="vertical" h={16} my={'auto'} />

                        <Tooltip label={'Delete event'}>
                          <ActionIcon
                            size={ICON_WRAPPER_SIZE}
                            color="red"
                            variant="light"
                            onClick={() => {
                              handleDelete();
                            }}
                          >
                            <IconTrash size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
                          </ActionIcon>
                        </Tooltip>
                      </>
                    )}
                  </Group>
                </Group>
              </>
            )}
          </Stack>
        </GridCol>

        {!modal && (
          <GridCol span={{ base: 12 }} px={sharedPadding}>
            <Stack>
              {!modal && (
                <Checkbox
                  label={'Close when done'}
                  checked={checked}
                  onChange={(event) => setChecked(event.currentTarget.checked)}
                />
              )}

              <Group>
                <Button
                  disabled={submitted}
                  variant="default"
                  size="xs"
                  onClick={() => {
                    handleToggleChildAside();
                  }}
                >
                  {'Close'}
                </Button>

                <Button
                  display={!initialData?.id ? undefined : 'none'}
                  type="submit"
                  size="xs"
                  loading={submitted}
                >
                  {submitted ? 'Adding' : 'Add'}
                </Button>
              </Group>
            </Stack>
          </GridCol>
        )}
      </Grid>
    </Box>
  );
}

const getTimeFormat = (date: Date | string) => {
  const dateObject = new Date(date);
  return `${prependZeros(Number(dateObject.getHours()), 2)}:${prependZeros(Number(dateObject.getMinutes()), 2)}`;
};
