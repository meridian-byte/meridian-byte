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
import { useAppshellChild, useFormTaskList } from '@repo/hooks';
import { ASIDE_VIEW_NAMES, colors } from '@repo/constants';
import { TaskListGet } from '@repo/types';
import { useViewAside, useViewModal } from '@repo/store';

export default function TaskList({ defaultValues }: { defaultValues?: Partial<TaskListGet> }) {
  const [checked, setChecked] = useState(true);

  const { form, submitted, handleSubmit } = useFormTaskList({
    options: { closeWhenDone: checked },
    defaultValues,
  });

  const { closeModalView } = useViewModal();
  const { asideViewValue } = useViewAside();
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
            placeholder="Select task list color"
            {...form.getInputProps('color')}
            data={colors.map((ci) => {
              return {
                label: ci.label,
                value: ci.colorName,
              };
            })}
          />
        </GridCol>

        {!defaultValues?.updatedAt && asideViewValue == ASIDE_VIEW_NAMES.NEW.STRIDE.TASK_LIST && (
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
              variant="default"
              onClick={() => {
                if (!defaultValues?.updatedAt) {
                  handleToggleChildAside();
                } else {
                  closeModalView();
                }
              }}
            >
              {'Close'}
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
