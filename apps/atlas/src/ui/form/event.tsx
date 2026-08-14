'use client';

/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Divider,
  Grid,
  GridCol,
  Group,
  Select,
  Textarea,
  TextInput,
} from '@mantine/core';
import { DateInput, DateTimePicker } from '@mantine/dates';
import { useFormEvent } from '@repo/hooks';
import dayjs from 'dayjs';
import { useEventActions, useStoreCalendar, useStoreEvent } from '@repo/store';
import { EventFormData } from '@repo/types';
import { useAppshellChild } from '@repo/hooks';

interface EventFormProps {
  initialData?: EventFormData | null;
  onClose?: () => void;
}

export default function Event({ initialData, onClose }: EventFormProps) {
  const [checked, setChecked] = useState(true);

  const { handleToggleChildAside } = useAppshellChild();

  const events = useStoreEvent((s) => s.events);
  const targetEvent = events?.find((e) => e.id === initialData?.id);

  const calendars = useStoreCalendar((s) => s.calendars);
  const { eventDelete } = useEventActions(); // Assuming you have a delete action in your store

  const { form, submitted, handleSubmit } = useFormEvent({
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
      valueFormat: 'DD MMM YYYY hh:mm A',
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

  return (
    <Box
      component="form"
      onSubmit={form.onSubmit(() => {
        handleSubmit();
        if (onClose) onClose();
      })}
      noValidate
      p={'xs'}
    >
      <Grid gap={'xs'}>
        <GridCol span={{ base: 12 }}>
          <TextInput
            required
            label={'Title'}
            placeholder="Title"
            {...form.getInputProps('title')}
          />
        </GridCol>

        <GridCol span={{ base: 12 }}>
          <Textarea
            label={'Description'}
            placeholder="Description"
            {...form.getInputProps('description')}
            autosize
            minRows={2}
            maxRows={5}
          />
        </GridCol>

        <GridCol span={{ base: 12 }}>
          <Checkbox
            label={'All day event'}
            {...form.getInputProps('allDay')}
            mt={'xs'}
            defaultChecked={initialData?.allDay}
          />
        </GridCol>

        <GridCol span={{ base: 12 }} display={!form.values.allDay ? 'none' : undefined}>
          <DateInput {...allDayProps.props} />
        </GridCol>

        <GridCol span={{ base: 12 }} display={form.values.allDay ? 'none' : undefined}>
          <DateTimePicker
            {...allDayProps.props}
            timePickerProps={{
              withDropdown: true,
              popoverProps: { withinPortal: false },
              format: '12h',
            }}
          />
        </GridCol>

        <GridCol span={{ base: 12 }}>
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
              { value: dayjs().add(1, 'day').format('YYYY-MM-DD HH:mm:ss'), label: 'Tomorrow' },
              { value: dayjs().add(1, 'month').format('YYYY-MM-DD HH:mm:ss'), label: 'Next month' },
            ]}
          />
        </GridCol>

        <GridCol span={{ base: 12 }}>
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
        </GridCol>

        <GridCol span={{ base: 12 }}>
          <Textarea
            label={'Location'}
            placeholder="Location"
            {...form.getInputProps('location')}
            autosize
            minRows={2}
            maxRows={5}
          />
        </GridCol>

        <GridCol span={{ base: 12 }}>
          <Divider my={'xs'} />
        </GridCol>

        <GridCol span={{ base: 12 }}>
          <Checkbox
            label={'Close when done'}
            checked={checked}
            onChange={(event) => setChecked(event.currentTarget.checked)}
          />
        </GridCol>

        <GridCol span={{ base: 12 }}>
          <Group justify="space-between">
            {initialData?.id && (
              <Button color="red" variant="light" onClick={handleDelete}>
                Delete
              </Button>
            )}

            <Group gap="xs" style={{ marginLeft: 'auto' }}>
              <Button
                color="gray"
                variant="light"
                onClick={() => {
                  if (onClose) {
                    onClose();
                  } else {
                    handleToggleChildAside();
                  }
                }}
              >
                Cancel
              </Button>

              <Button type="submit" loading={submitted}>
                {initialData?.id ? 'Update' : 'Add'}
              </Button>
            </Group>
          </Group>
        </GridCol>
      </Grid>
    </Box>
  );
}
