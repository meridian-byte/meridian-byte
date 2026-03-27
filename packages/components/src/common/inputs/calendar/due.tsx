'use client';

import { useState } from 'react';
import { DatePicker } from '@mantine/dates';
import { Button, Group, Stack } from '@mantine/core';
import { FormTask } from '@repo/hooks/form/task';

export default function Due({
  props,
}: {
  props: {
    form: FormTask;
    setMounted: (state: boolean) => void;
    setPopover: (state: boolean) => void;
  };
}) {
  const currentDate = new Date();
  const [value, setValue] = useState<string | null>(
    (props.form.values.due_date || currentDate.toISOString()) as any
  );

  return (
    <Stack gap={'xs'}>
      <DatePicker
        size="xs"
        value={value}
        onChange={setValue}
        minDate={currentDate}
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
              props.setMounted(false);
              props.setPopover(false);
              props.form.setFieldValue('properties.due_date', value);
            }
          }}
        >
          Save
        </Button>
      </Group>
    </Stack>
  );
}
