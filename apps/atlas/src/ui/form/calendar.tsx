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
import { useAppshellChild, useFormCalendar } from '@repo/hooks';
import { colors } from '@repo/constants';
import { CalendarGet } from '@repo/types';
import { useViewModal } from '@repo/store';

export default function Calendar({ defaultValues }: { defaultValues?: Partial<CalendarGet> }) {
  const [checked, setChecked] = useState(true);

  const { form, submitted, handleSubmit } = useFormCalendar({
    options: { closeWhenDone: checked },
    defaultValues,
  });

  const { closeModalView } = useViewModal();
  const { handleToggleChildAside } = useAppshellChild();

  return (
    <Box component="form" onSubmit={form.onSubmit(() => handleSubmit())} noValidate p={'xs'}>
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
          <Select
            label="Color"
            placeholder="Select calendar color"
            {...form.getInputProps('color')}
            data={colors.map((ci) => {
              return {
                label: ci.label,
                value: ci.colorName,
              };
            })}
          />
        </GridCol>

        {!defaultValues?.updatedAt && (
          <GridCol span={{ base: 12 }}>
            <Checkbox
              label={'Close when done'}
              checked={checked}
              onChange={(event) => setChecked(event.currentTarget.checked)}
              mt={'xs'}
            />
          </GridCol>
        )}

        <GridCol span={{ base: 12 }}>
          <Divider my={'xs'} />
        </GridCol>

        <GridCol span={{ base: 12 }}>
          <Group justify="end" gap="xs">
            <Button
              disabled={submitted}
              color="gray"
              variant="light"
              onClick={() => {
                if (!defaultValues?.updatedAt) {
                  handleToggleChildAside();
                } else {
                  closeModalView();
                }
              }}
            >
              {'Cancel'}
            </Button>

            <Button type="submit" loading={submitted}>
              {submitted
                ? defaultValues?.updatedAt
                  ? 'Saving'
                  : 'Adding'
                : defaultValues?.updatedAt
                  ? 'Save'
                  : 'Add'}
            </Button>
          </Group>
        </GridCol>
      </Grid>
    </Box>
  );
}
