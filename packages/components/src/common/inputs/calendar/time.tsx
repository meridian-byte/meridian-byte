'use client';

import { useState } from 'react';
import { DatePicker, TimeInput } from '@mantine/dates';
import { Button, Group, Stack } from '@mantine/core';
import { FormReminder } from '@repo/hooks/form/reminder';
import { prependZeros } from '@repo/utilities/number';
import { getRoundedFutureTime } from '@repo/services/logic/time';

export default function Time({
  props,
}: {
  props: {
    form: FormReminder;
    setMounted: (state: boolean) => void;
    setPopover: (state: boolean) => void;
  };
}) {
  const currentDate = new Date();
  const [value, setValue] = useState<string | null>(
    (props.form.values.remind_at || currentDate.toISOString()) as any
  );

  const futureTime = getRoundedFutureTime();
  const futureTimeHours = prependZeros(futureTime.getHours(), 2);
  const futureTimeMinutes = prependZeros(futureTime.getMinutes(), 2);
  const initialTime = `${futureTimeHours}:${futureTimeMinutes}`;
  const [timeState, setTimeState] = useState(initialTime);

  return (
    <Stack gap={'xs'}>
      <DatePicker
        size="xs"
        value={value}
        onChange={setValue}
        minDate={currentDate}
      />

      <TimeInput
        placeholder="Set time"
        value={timeState}
        onChange={(event) => setTimeState(event.currentTarget.value)}
      />

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
          onClick={() => {
            if (value) {
              const updatedTime = updateTime(timeState, new Date(value));
              props.form.setFieldValue(
                'properties.time',
                updatedTime.toISOString()
              );

              props.setMounted(false);
              props.setPopover(false);
            }
          }}
        >
          Save
        </Button>
      </Group>
    </Stack>
  );
}

const updateTime = (time: string, date: Date): Date => {
  const [hours, minutes] = time.split(':').map(Number);

  if (isNaN(hours) || isNaN(minutes)) {
    throw new Error("Invalid time format. Use 'HH:mm'.");
  }

  const updatedDate = new Date(date); // Create a new Date object to avoid mutating the original
  updatedDate.setHours(hours, minutes, 0, 0); // Set hours, minutes, seconds, and milliseconds
  return updatedDate;
};
