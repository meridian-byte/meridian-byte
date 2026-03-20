'use client';

import { capitalizeWord } from '@repo/utilities/string';
import {
  Button,
  Chip,
  ChipGroup,
  Group,
  NumberInput,
  Select,
  Stack,
} from '@mantine/core';
import { useState } from 'react';
import {
  getNextWeekdayDate,
  getWeekday,
  sortWeekdaysInOrder,
} from '@repo/services/logic/time';
import { Frequency } from '@repo/types/models/enums';
import { Weekdays } from '@repo/types/enums';
import { FormTask } from '@repo/hooks/form/task';
import { FormRecurringRule } from '@repo/hooks/form/recurring-rule';
import { FormReminder } from '@repo/hooks/form/reminder';

export default function Repeat({
  props,
}: {
  props: {
    form: {
      task: FormTask;
      recurringRule: FormRecurringRule;
      reminder: FormReminder;
    };
    setMounted: (state: boolean) => void;
    setPopover: (state: boolean) => void;
  };
}) {
  const [intervalState, setInterval] = useState<string | number>(
    props.form.recurringRule.values.interval || 1
  );
  const [frequencyState, setFrequency] = useState<string | null>(
    props.form.recurringRule.values.frequency || Frequency.DAILY
  );
  const [weekdaysState, setWeekdays] = useState<string[]>(
    props.form.recurringRule.values.weekdays?.length
      ? props.form.recurringRule.values.weekdays
      : [getWeekday(new Date(props.form.task.values.due_date || new Date()))]
  );

  return (
    <Stack gap={'xs'}>
      <Group grow gap={'xs'}>
        <NumberInput
          size="xs"
          radius="md"
          placeholder="Repeat interval"
          min={1}
          max={100}
          value={intervalState}
          onChange={setInterval}
        />

        <Select
          size="xs"
          data={frequencyArray.map((frequency) => ({
            value: frequency,
            label: capitalizeWord(frequency),
          }))}
          value={frequencyState}
          onChange={setFrequency}
          allowDeselect={false}
          withCheckIcon={false}
        />
      </Group>

      {frequencyState == Frequency.WEEKLY && (
        <ChipGroup multiple value={weekdaysState} onChange={setWeekdays}>
          <Group gap={0} justify="space-between">
            {weekdayArray.map((day) => (
              <Chip key={day} value={day.toUpperCase()} size={'xs'} radius={0}>
                {capitalizeWord(day)}
              </Chip>
            ))}
          </Group>
        </ChipGroup>
      )}

      <Group gap={'xs'} grow>
        <Button
          size="xs"
          variant="outline"
          onClick={() => {
            props.setMounted(false);
            props.setPopover(false);
          }}
        >
          Close
        </Button>
        <Button
          size="xs"
          disabled={frequencyState == Frequency.WEEKLY && !weekdaysState.length}
          onClick={() => {
            const newInterval =
              weekdaysState.length == 7 || !intervalState
                ? 1
                : Number(intervalState);

            const newFrequency =
              weekdaysState.length == 7
                ? Frequency.DAILY
                : (frequencyState as Frequency);

            let newWeekdays: Weekdays[] = [];
            let newDueDate: Date;

            if (newFrequency == Frequency.WEEKLY) {
              const orderedWeekdays = sortWeekdaysInOrder(
                weekdaysState
              ) as Weekdays[];

              newWeekdays = orderedWeekdays;

              newDueDate = getNextWeekdayDate(orderedWeekdays, true);
            } else {
              if (!props.form.task.values.due_date) {
                newDueDate = now;
              } else {
                newDueDate = props.form.task.values.due_date;
              }
            }

            props.form.recurringRule.setFieldValue('interval', newInterval);
            props.form.recurringRule.setFieldValue('frequency', newFrequency);
            props.form.recurringRule.setFieldValue('weekdays', newWeekdays);
            props.form.recurringRule.setFieldValue('due_date', newDueDate);

            if (props.form.reminder.values.remind_at) {
              props.form.reminder.setFieldValue('remind_at', newDueDate);
            }

            props.setMounted(false);
            props.setPopover(false);
          }}
        >
          Save
        </Button>
      </Group>
    </Stack>
  );
}

const now = new Date();
const weekdayArray = Object.values(Weekdays).slice(0, 7) as Weekdays[];
const frequencyArray = Object.values(Frequency);
