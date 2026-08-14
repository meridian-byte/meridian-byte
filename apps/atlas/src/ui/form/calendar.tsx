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
  Select,
  Textarea,
  TextInput,
} from '@mantine/core';
import { useFormCalendar } from '@atlas/hooks/form/calendar';
import { colors } from '@repo/constants';

export default function Calendar() {
  const [checked, setChecked] = useState(true);

  const { form, submitted, handleSubmit } = useFormCalendar({
    options: { closeWhenDone: checked },
  });

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

        <GridCol span={{ base: 12 }}>
          <Checkbox
            label={'Close when done'}
            checked={checked}
            onChange={(event) => setChecked(event.currentTarget.checked)}
            mt={'xs'}
          />
        </GridCol>

        <GridCol span={{ base: 12 }}>
          <Divider my={'xs'} />
        </GridCol>

        <GridCol span={{ base: 12 }}>
          <Button type="submit" loading={submitted}>
            {submitted ? 'Adding' : 'Add'}
          </Button>
        </GridCol>
      </Grid>
    </Box>
  );
}
