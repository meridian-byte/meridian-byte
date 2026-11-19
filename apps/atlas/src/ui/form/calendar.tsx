'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
import { ASIDE_VIEW_NAMES, colors } from '@repo/constants';
import { CalendarGet } from '@repo/types';
import { useViewAside, useViewModal } from '@repo/store';

export default function Calendar({ defaultValues }: { defaultValues?: Partial<CalendarGet> }) {
  const [checked, setChecked] = useState(true);

  const { form, submitted, handleSubmit } = useFormCalendar({
    options: { closeWhenDone: checked },
    defaultValues,
  });

  const { closeModalView } = useViewModal();
  const { asideViewValue } = useViewAside();
  const { handleToggleChildAside } = useAppshellChild();

  const isEditing = Boolean(defaultValues?.updatedAt);
  const showCloseWhenDone = !isEditing && asideViewValue === ASIDE_VIEW_NAMES.NEW.PAVE.CALENDAR;

  const colorOptions = useMemo(
    () => colors.map((ci) => ({ label: ci.label, value: ci.colorName })),
    [],
  );

  const handleCloseWhenDoneChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.currentTarget.checked);
  }, []);

  const handleClose = useCallback(() => {
    if (!isEditing) {
      handleToggleChildAside();
    } else {
      closeModalView();
    }
  }, [isEditing, handleToggleChildAside, closeModalView]);

  const handleFormSubmit = useMemo(
    () => form.onSubmit(() => handleSubmit()),
    [form, handleSubmit],
  );

  const submitLabel = submitted
    ? isEditing
      ? 'Saving'
      : 'Adding'
    : isEditing
      ? 'Save'
      : 'Add';

  return (
    <Box component="form" onSubmit={handleFormSubmit} noValidate p="xs">
      <Grid gap="xs">
        <GridCol span={{ base: 12 }}>
          <TextInput
            required
            label="Title"
            placeholder="Title"
            {...form.getInputProps('title')}
          />
        </GridCol>

        <GridCol span={{ base: 12 }}>
          <Textarea
            label="Description"
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
            data={colorOptions}
          />
        </GridCol>

        {showCloseWhenDone && (
          <GridCol span={{ base: 12 }}>
            <Checkbox
              label="Close when done"
              checked={checked}
              onChange={handleCloseWhenDoneChange}
              mt="xs"
            />
          </GridCol>
        )}

        <GridCol span={{ base: 12 }}>
          <Divider my="xs" />
        </GridCol>

        <GridCol span={{ base: 12 }}>
          <Group justify="end" gap="xs">
            <Button disabled={submitted} variant="default" onClick={handleClose}>
              Close
            </Button>

            <Button type="submit" loading={submitted}>
              {submitLabel}
            </Button>
          </Group>
        </GridCol>
      </Grid>
    </Box>
  );
}
