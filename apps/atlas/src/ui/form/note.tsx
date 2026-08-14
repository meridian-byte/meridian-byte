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
import { useAppshellChild, useFormNote } from '@repo/hooks';
import { colors } from '@repo/constants';
import { NoteGet } from '@repo/types';
import { useViewModal } from '@repo/store';

export default function Note({ defaultValues }: { defaultValues?: Partial<NoteGet> }) {
  const [checked, setChecked] = useState(true);

  const { form, submitted, handleSubmit } = useFormNote({
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
          <Divider my={'xs'} />
        </GridCol>

        <GridCol span={{ base: 12 }}>
          <Group justify="end" gap="xs">
            <Button
              disabled={submitted}
              variant="default"
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
