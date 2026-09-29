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
      ...form.getInputProps('start'),
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

    useEffect(() => {
      if (reminderState) return;
      setWithReminder(false);
    }, [reminderState]);

    useEffect(() => {
      if (reminders === undefined) return;
      if (reminders === null) return;
      if (!form.values.start) return;

      const [hours, minutes] = (reminderState || '').split(':').map(Number);

      const dateValue = form.values.start;

      const updatedDate = new Date(
        new Date(dateValue).getFullYear(),
        new Date(dateValue).getMonth(),
        new Date(dateValue).getDate(),
        hours,
        minutes,
      );

      if (!reminder) {
        if (!reminderState) {
          return;
        } else {
          // console.log('create reminder');
          if (initialData) {
            reminderCreate({
              id: generateUUID(),
              remindAt: updatedDate.toISOString() as any,
              eventId: initialData.id,
            });
          }
        }
      } else {
        if (!reminderState) {
          // console.log('delete reminder');
          reminderDelete(reminder);
        } else {
          if (getTimeFormat(new Date(reminder.remindAt)) == reminderState) {
            return;
          } else {
            // console.log('update reminder');
            reminderUpdate({
              ...reminder,
              remindAt: updatedDate as any,
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
            max={!form.values.start ? undefined : getTimeFormat(form.values.start)}
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
      // p={'xs'}
    >
      <Grid gap={0}>
        <GridCol span={{ base: 12, md: modal ? 8 : 12 }}>
          <ScrollAreaAutosize mah={sharedHeight}>
            <Grid
              gap={0}
              p={sharedPadding}
              mih={!modal ? undefined : sharedHeight}
              bg={
                !modal
                  ? undefined
                  : 'light-dark(var(--mantine-color-gray-1), var(--mantine-color-dark-7))'
              }
            >
              <GridCol span={{ base: 12 }}>
                <TextInput
                  required
                  aria-label={'Title'}
                  label={!modal ? 'Title' : undefined}
                  placeholder="Title"
                  variant="unstyled"
                  styles={{
                    input: { backgroundColor: 'transparent', padding: 0, fontWeight: 'bold' },
                  }}
                  {...form.getInputProps('title')}
                  size="md"
                />
              </GridCol>

              <GridCol span={{ base: 12 }}>
                <Textarea
                  aria-label="Description"
                  label={!modal ? 'Description' : undefined}
                  placeholder="Description"
                  variant="unstyled"
                  styles={{
                    input: { backgroundColor: 'transparent', padding: 0, fontWeight: 500 },
                  }}
                  {...form.getInputProps('description')}
                  autosize
                  minRows={2}
                  maxRows={5}
                  size="sm"
                />
              </GridCol>

              <GridCol span={12}>
                <Divider
                  mt={'xs'}
                  mb={5}
                  color="light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-6))"
                />
              </GridCol>

              <GridCol span={{ base: 12 }}>
                <Textarea
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
                  autosize
                  minRows={1}
                  maxRows={3}
                />
              </GridCol>

              {!modal && (
                <GridCol span={{ base: 12 }}>
                  <Divider mt={!modal ? 'xs' : SECTION_SPACING} mb={'xs'} />
                </GridCol>
              )}

              {!modal && (
                <GridCol span={{ base: 12 }}>
                  <Checkbox
                    label={'Close when done'}
                    checked={checked}
                    onChange={(event) => setChecked(event.currentTarget.checked)}
                  />
                </GridCol>
              )}
            </Grid>
          </ScrollAreaAutosize>
        </GridCol>

        <GridCol span={{ base: 12, md: 4 }}>
          <Stack h={sharedHeight} gap={0}>
            <ScrollArea flex={1}>
              <Flex
                align={modal ? undefined : 'center'}
                direction={modal ? 'column' : 'row'}
                p={modal ? sharedPadding : undefined}
                pb={sharedPadding}
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
                      <DateInput {...allDayProps.props} valueFormat={'DD MMM YYYY'} />
                    </Box>

                    <Box display={form.values.allDay ? 'none' : undefined}>
                      <DateTimePicker
                        {...allDayProps.props}
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
                    {...form.getInputProps('end')}
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
              </Flex>
            </ScrollArea>

            {modal && (
              <>
                <Divider my={modal ? undefined : 16} />

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
                        if (!initialData) {
                          handleToggleChildAside();
                        } else {
                          closeModalView();
                        }
                      }}
                    >
                      {'Close'}
                    </Button>

                    <Button type="submit" size="xs" loading={submitted}>
                      {initialData?.id ? 'Update' : 'Add'}
                    </Button>

                    <Divider orientation="vertical" h={16} my={'auto'} />

                    <Tooltip label={'Delete event'}>
                      <ActionIcon
                        size={ICON_WRAPPER_SIZE}
                        color="red"
                        variant="light"
                        onClick={() => {}}
                      >
                        <IconTrash size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
                      </ActionIcon>
                    </Tooltip>
                  </Group>
                </Group>
              </>
            )}
          </Stack>
        </GridCol>
      </Grid>
    </Box>
  );
}

const getTimeFormat = (date: Date | string) => {
  const dateObject = new Date(date);
  return `${prependZeros(Number(dateObject.getHours()), 2)}:${prependZeros(Number(dateObject.getMinutes()), 2)}`;
};
