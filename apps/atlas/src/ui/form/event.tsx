'use client';

import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
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
  Tabs,
  TabsList,
  TabsPanel,
  TabsTab,
  Text,
  Textarea,
  TextInput,
  Tooltip,
} from '@mantine/core';
import { DateInput, DateTimePicker, TimePicker } from '@mantine/dates';
import { useBreakpointFlags, useFormEvent } from '@repo/hooks';
import dayjs from 'dayjs';
import {
  CalendarsValue,
  useEventActions,
  useRecurringRuleActions,
  useReminderActions,
  useStoreCalendar,
  useStoreEvent,
  useStoreRecurringRule,
  useStoreReminder,
  useViewModal,
} from '@repo/store';
import { CalendarGet, EventFormData, Frequency } from '@repo/types';
import { useAppshellChild } from '@repo/hooks';
import {
  IconAlignJustified,
  IconBell,
  IconCalendarCog,
  IconClock,
  IconCursorText,
  IconMapPin,
  IconPencilCog,
  IconPin,
  IconRepeat,
  IconSettings,
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

const TITLE_INPUT_STYLES = {
  input: { backgroundColor: 'transparent', padding: 0, fontWeight: 'bold' },
};

const DESCRIPTION_INPUT_STYLES = {
  input: { backgroundColor: 'transparent', padding: 0, fontWeight: 500 },
};

const LOCATION_INPUT_STYLES = {
  input: { backgroundColor: 'transparent', fontWeight: 500 },
};

const TABS_STYLES = {
  tab: {
    paddingTop: 'var(--mantine-spacing-md)',
    paddingBottom: 'var(--mantine-spacing-md)',
  },
  tabLabel: { fontWeight: 600 },
};

const getTimeFormat = (date: Date | string) => {
  const dateObject = new Date(date);
  return `${prependZeros(Number(dateObject.getHours()), 2)}:${prependZeros(Number(dateObject.getMinutes()), 2)}`;
};

function getDefaultReminderDate(dueDate: Date | string): Date {
  return dayjs(dueDate).hour(9).minute(0).second(0).millisecond(0).toDate();
}

function buildDatePresets() {
  return [
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
  ];
}

const InputCalendar = memo(function InputCalendar({
  form,
  calendars,
  isDesktop,
}: {
  form: ReturnType<typeof useFormEvent>['form'];
  calendars: CalendarsValue;
  isDesktop: boolean;
}) {
  const options = useMemo(
    () => (calendars || []).map((ci) => ({ label: ci.title, value: ci.id })),
    [calendars],
  );

  return (
    <Select
      label="Calendar"
      placeholder="Select calendar"
      disabled={!calendars}
      loading={calendars === undefined}
      size={isDesktop ? 'xs' : 'sm'}
      {...form.getInputProps('calendarId')}
      data={options}
    />
  );
});

const SectionReminder = memo(function SectionReminder({
  eventId,
  startValue,
  allDay,
  isDesktop,
}: {
  eventId?: string;
  startValue: Date | string | null | undefined;
  allDay: boolean;
  isDesktop: boolean;
}) {
  const reminder = useStoreReminder((s) => s.reminders?.find((ri) => ri.eventId === eventId));
  const { reminderCreate, reminderUpdate, reminderDelete } = useReminderActions();

  const [withReminder, setWithReminder] = useState<boolean>(Boolean(reminder));
  const [reminderState, setReminderState] = useState<string | null>(() =>
    reminder ? getTimeFormat(new Date(reminder.remindAt)) : null,
  );

  const currentStartDate = startValue || new Date();

  useEffect(() => {
    if (!reminderState) {
      setWithReminder(false);
    }
  }, [reminderState]);

  useEffect(() => {
    if (!withReminder) return;

    if (!reminderState) {
      setReminderState(getTimeFormat(getDefaultReminderDate(currentStartDate).toISOString()));
      return;
    }

    const dueDateEnd = dayjs(currentStartDate).endOf('day');
    if (reminder?.remindAt && dayjs(reminder.remindAt).isAfter(dueDateEnd)) {
      setReminderState(getTimeFormat(getDefaultReminderDate(currentStartDate).toISOString()));
    }
  }, [currentStartDate, withReminder, reminderState, reminder?.remindAt]);

  useEffect(() => {
    if (!eventId || !startValue) return;

    if (!reminder) {
      if (!reminderState) return;
      const [hours, minutes] = (getTimeFormat(currentStartDate) || '').split(':').map(Number);
      const base = new Date(currentStartDate);
      const newDate = new Date(base.getFullYear(), base.getMonth(), base.getDate(), hours, minutes);

      reminderCreate({
        id: generateUUID(),
        remindAt: getDefaultReminderDate(newDate.toISOString()).toISOString() as any,
        eventId,
      });
      return;
    }

    if (!reminderState) {
      reminderDelete(reminder);
      return;
    }

    const remindDate = new Date(reminder.remindAt);
    const startDate = new Date(currentStartDate);
    const dayMatches =
      remindDate.getDate() === startDate.getDate() &&
      remindDate.getMonth() === startDate.getMonth() &&
      remindDate.getFullYear() === startDate.getFullYear();
    const timeMatches = getTimeFormat(remindDate) === reminderState;

    if (timeMatches && dayMatches) return;

    const dateToUse = !dayMatches ? currentStartDate : reminder.remindAt;
    const [hours, minutes] = reminderState.split(':').map(Number);
    const base = new Date(dateToUse);
    const updatedDate = new Date(
      base.getFullYear(),
      base.getMonth(),
      base.getDate(),
      hours,
      minutes,
    );

    reminderUpdate({
      ...reminder,
      remindAt: updatedDate.toISOString() as any,
    });
  }, [
    eventId,
    startValue,
    currentStartDate,
    reminder,
    reminderState,
    reminderCreate,
    reminderUpdate,
    reminderDelete,
  ]);

  const handleToggleReminder = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const checked = event.currentTarget.checked;
      setWithReminder(checked);
      if (checked && !reminderState) {
        setReminderState(getTimeFormat(getDefaultReminderDate(currentStartDate).toISOString()));
      }
    },
    [currentStartDate, reminderState],
  );

  const maxTime = useMemo(() => {
    if (!startValue) return undefined;
    return allDay
      ? getTimeFormat(dayjs(startValue).endOf('day').toDate())
      : getTimeFormat(dayjs(startValue).toDate());
  }, [startValue, allDay]);

  return (
    <Stack gap={withReminder ? 'xs' : 0}>
      <Checkbox
        label="Remind"
        checked={withReminder}
        onChange={handleToggleReminder}
        disabled={withReminder && Boolean(reminderState)}
      />

      <Box
        style={{
          transition: 'height 100ms ease',
          height: withReminder ? (isDesktop ? 30 : 36) : 0,
          overflow: 'hidden',
        }}
      >
        <TimePicker
          aria-label="Reminder"
          size={isDesktop ? 'xs' : 'sm'}
          clearable
          leftSection={<IconClock size={ICON_SIZE - 4} stroke={ICON_STROKE_WIDTH} />}
          format="12h"
          max={maxTime}
          value={reminderState || undefined}
          onChange={setReminderState}
          withDropdown
        />
      </Box>
    </Stack>
  );
});

const SectionRecurring = memo(function SectionRecurring({ eventId }: { eventId?: string }) {
  const event = useStoreEvent((s) => s.events?.find((ti) => ti.id === eventId));
  const recurringRule = useStoreRecurringRule((s) =>
    s.recurringRules?.find((ri) => ri.id === event?.recurringRuleId),
  );
  const { recurringRuleCreate } = useRecurringRuleActions();
  const { eventUpdate } = useEventActions();

  const [withRecurringRule, setWithRecurringRule] = useState<boolean>(Boolean(recurringRule));
  const [frequencyState, setFrequencyState] = useState<string | null>(
    recurringRule?.frequency || null,
  );
  const [intervalState, setIntervalState] = useState<number | string>(
    recurringRule?.interval || '',
  );

  const handleToggleRecurring = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const checked = e.currentTarget.checked;
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
  }, []);

  useEffect(() => {
    if (!intervalState && !frequencyState) {
      setWithRecurringRule(false);
    }
  }, [intervalState, frequencyState]);

  useEffect(() => {
    if (!event || recurringRule || !frequencyState || !intervalState) return;
    const normalizedInterval = typeof intervalState === 'string' ? 1 : intervalState;
    const newRule = recurringRuleCreate({
      id: generateUUID(),
      frequency: frequencyState as Frequency,
      interval: normalizedInterval,
    });
    if (newRule) {
      eventUpdate({
        ...event,
        recurringRuleId: newRule.id,
      });
    }
  }, [event, recurringRule, frequencyState, intervalState, recurringRuleCreate, eventUpdate]);

  const frequencyOptions = useMemo(() => {
    const plural = Number(intervalState) > 1 ? 's' : '';
    return [
      { value: Frequency.DAILY, label: `Day${plural}` },
      { value: Frequency.WEEKLY, label: `Week${plural}` },
      { value: Frequency.MONTHLY, label: `Month${plural}` },
      { value: Frequency.ANNUALLY, label: `Year${plural}` },
    ];
  }, [intervalState]);

  const stackHeight = !event?.start ? 0 : withRecurringRule ? 16 + 10 + 18.6 + 2 + 30 : 16;

  return (
    <Stack
      gap={withRecurringRule ? 'xs' : 0}
      style={{
        transition: 'height 100ms ease',
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

export default function Event({ modal, initialData, onClose }: EventFormProps) {
  const { ready, isDesktop } = useBreakpointFlags();
  const [checked, setChecked] = useState(true);

  const { closeModalView } = useViewModal();
  const { handleToggleChildAside } = useAppshellChild();

  const targetEvent = useStoreEvent((s) => s.events?.find((e) => e.id === initialData?.id));
  const calendars = useStoreCalendar((s) => s.calendars);
  const { eventDelete } = useEventActions();

  const { form, submitted, handleSubmit } = useFormEvent({
    modal,
    defaultValues: targetEvent,
    options: { closeWhenDone: checked },
  });

  // Sync only when selected event/slot ID changes
  useEffect(() => {
    if (!initialData) return;
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
  }, [initialData?.id]);

  const presets = useMemo(() => buildDatePresets(), []);

  const handleDelete = useCallback(() => {
    if (!initialData?.id || !targetEvent) return;
    eventDelete(targetEvent);
    onClose?.();
  }, [initialData?.id, targetEvent, eventDelete, onClose]);

  const handleAllDayToggle = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
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
    },
    [form],
  );

  const handleDateInputChange = useCallback(
    (value: string | Date | null) => {
      const newStart = value;
      let newEnd: any = form.values.start;

      if (newStart) {
        if (!form.values.allDay) {
          newEnd = new Date(new Date(newStart).getTime() + 60 * 60 * 1000).toISOString();
        } else {
          newEnd = dayjs(newStart).add(1, 'day').startOf('day').toDate().toISOString();
        }
      }

      const startOfDay = newStart ? dayjs(newStart).startOf('day').toDate().toISOString() : null;

      form.setValues({
        ...form.values,
        start: (form.values.allDay ? startOfDay : newStart) as any,
        end: newEnd as any,
      });
    },
    [form],
  );

  const handleStartDateTimeChange = useCallback(
    (value: string | Date | null) => {
      const newStart = value;
      let newEnd: any = form.values.end;

      if (newStart && (!newEnd || new Date(newStart) >= new Date(newEnd))) {
        newEnd = new Date(new Date(newStart).getTime() + 60 * 60 * 1000);
      }

      form.setValues({
        ...form.values,
        start: newStart as any,
        end: newEnd,
      });
    },
    [form],
  );

  const handleEndDateTimeChange = useCallback(
    (value: string | Date | null) => {
      const newEnd = value;
      let newStart: any = form.values.start;

      if (newEnd && (!newStart || new Date(newEnd) <= new Date(newStart))) {
        newStart = new Date(new Date(newEnd).getTime() - 60 * 60 * 1000);
      }

      form.setValues({
        ...form.values,
        start: newStart,
        end: newEnd as any,
      });
    },
    [form],
  );

  const handleCloseAction = useCallback(() => {
    if (modal) {
      onClose?.();
    } else if (!initialData) {
      handleToggleChildAside();
    } else {
      closeModalView();
    }
  }, [modal, onClose, initialData, handleToggleChildAside, closeModalView]);

  const handleFormSubmit = useMemo(
    () =>
      form.onSubmit(() => {
        handleSubmit();
        onClose?.();
      }),
    [form, handleSubmit, onClose],
  );

  if (!ready) {
    return null;
  }

  const sharedPadding = 'md';
  const sharedHeight = modal ? 400 : undefined;
  const valueFormat = `DD MMM YYYY${form.values.allDay ? '' : ' HH:mm A'}`;
  const DateFieldComponent = form.values.allDay ? DateInput : DateTimePicker;

  const leftcolumn = (
    <ScrollAreaAutosize mah={sharedHeight}>
      <Stack
        gap={0}
        p={sharedPadding}
        py={modal ? undefined : 0}
        mih={!modal ? undefined : sharedHeight}
        bg={
          !modal
            ? undefined
            : 'light-dark(var(--mantine-color-gray-1), var(--mantine-color-dark-8))'
        }
      >
        <TextInput
          required
          aria-label="Title"
          placeholder="Title"
          variant="unstyled"
          data-autofocus
          styles={TITLE_INPUT_STYLES}
          {...form.getInputProps('title')}
          size="md"
        />

        <Textarea
          aria-label="Description"
          placeholder="Description"
          variant="unstyled"
          styles={DESCRIPTION_INPUT_STYLES}
          {...form.getInputProps('description')}
          autosize
          minRows={1}
          maxRows={5}
          size="sm"
        />

        {modal && (
          <Divider
            mt="xs"
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
          styles={LOCATION_INPUT_STYLES}
          {...form.getInputProps('location')}
        />
      </Stack>
    </ScrollAreaAutosize>
  );

  const rightColumn = (
    <Stack h={modal ? sharedHeight : undefined} gap={0}>
      <ScrollArea flex={1}>
        <Stack pt={modal ? undefined : 0} p={sharedPadding} py={modal ? undefined : 0} gap={0}>
          {modal && <InputCalendar form={form} calendars={calendars} isDesktop={isDesktop} />}

          <Divider my={16} />

          <Stack gap={5}>
            <Checkbox
              label="All day event"
              checked={Boolean(form.values.allDay)}
              onChange={handleAllDayToggle}
            />

            <div>
              <Box display={!form.values.allDay ? 'none' : undefined}>
                <DateInput
                  required
                  label="Start"
                  placeholder="Start"
                  valueFormat="DD MMM YYYY"
                  presets={presets}
                  value={form.values.start}
                  size={isDesktop ? 'xs' : 'sm'}
                  onChange={handleDateInputChange}
                />
              </Box>

              <Box display={form.values.allDay ? 'none' : undefined}>
                <DateTimePicker
                  required
                  label="Start"
                  placeholder="Start"
                  valueFormat={valueFormat}
                  presets={presets}
                  value={form.values.start}
                  size={isDesktop ? 'xs' : 'sm'}
                  onChange={handleStartDateTimeChange}
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
              transition: 'height 100ms ease',
              height: form.values.allDay ? 0 : isDesktop ? 54.8 : 60.8,
              overflow: 'hidden',
            }}
          >
            <DateTimePicker
              required
              label="End"
              placeholder="End"
              value={form.values.end}
              size={isDesktop ? 'xs' : 'sm'}
              onChange={handleEndDateTimeChange}
              valueFormat={valueFormat}
              disabled={Boolean(form.values.allDay)}
              timePickerProps={{
                withDropdown: true,
                popoverProps: { withinPortal: false },
                format: '12h',
              }}
              presets={presets}
            />
          </Box>

          {modal && initialData?.id && (
            <>
              <Divider my={16} />
              <SectionReminder
                eventId={initialData.id}
                startValue={form.values.start}
                allDay={Boolean(form.values.allDay)}
                isDesktop={isDesktop}
              />
              <Divider my={16} />
              <SectionRecurring eventId={initialData.id} />
            </>
          )}
        </Stack>
      </ScrollArea>

      <Box px={modal ? undefined : sharedPadding}>
        <Divider my={modal ? undefined : sharedPadding} />
      </Box>

      {modal && (
        <Group justify="end" gap="xs" p={sharedPadding}>
          <Group gap="xs">
            <Button
              disabled={submitted}
              variant="default"
              size={isDesktop ? 'xs' : undefined}
              onClick={handleCloseAction}
            >
              Close
            </Button>

            {!initialData?.id && (
              <Button type="submit" size={isDesktop ? 'xs' : undefined} loading={submitted}>
                {submitted ? 'Adding' : 'Add'}
              </Button>
            )}

            {initialData?.id && (
              <Tooltip label="Delete event">
                <ActionIcon
                  size={ICON_WRAPPER_SIZE * (isDesktop ? 1 : 1.25)}
                  color="red"
                  variant="light"
                  onClick={handleDelete}
                >
                  <IconTrash size={ICON_SIZE * (isDesktop ? 1 : 1.25)} stroke={ICON_STROKE_WIDTH} />
                </ActionIcon>
              </Tooltip>
            )}
          </Group>
        </Group>
      )}
    </Stack>
  );

  if (modal && !isDesktop) {
    return <TaskTab content={leftcolumn} properties={rightColumn} />;
  }

  return (
    <Box component="form" onSubmit={handleFormSubmit} noValidate>
      <Grid gap={0}>
        <GridCol span={{ base: 12, md: modal ? 8 : 12 }}>{leftcolumn}</GridCol>

        <GridCol span={{ base: 12, md: modal ? 4 : 12 }}>{rightColumn}</GridCol>

        {!modal && (
          <GridCol span={{ base: 12 }} px={sharedPadding}>
            <Stack>
              <Checkbox
                label="Close when done"
                checked={checked}
                onChange={(event) => setChecked(event.currentTarget.checked)}
              />

              <Group>
                <Button
                  disabled={submitted}
                  variant="default"
                  size="xs"
                  onClick={handleToggleChildAside}
                >
                  Close
                </Button>

                {!initialData?.id && (
                  <Button type="submit" size="xs" loading={submitted}>
                    {submitted ? 'Adding' : 'Add'}
                  </Button>
                )}
              </Group>
            </Stack>
          </GridCol>
        )}
      </Grid>
    </Box>
  );
}
