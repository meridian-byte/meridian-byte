'use client';

import React from 'react';
import { useFormNote } from '@repo/hooks/form/note';
import {
  Button,
  Grid,
  GridCol,
  Group,
  NativeSelect,
  TextInput,
} from '@mantine/core';
import { IconLetterCase, IconSettingsQuestion } from '@tabler/icons-react';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@repo/constants/sizes';
import { NoteGet } from '@repo/types/models/note';
import { capitalizeWords } from '@repo/utilities/string';
import { useMediaQuery } from '@mantine/hooks';
import { APP_NAME } from '@repo/constants/app';

export default function Note({
  props,
}: {
  props?: {
    defaultValues?: Partial<NoteGet>;
    close?: () => void;
  };
}) {
  const { form, submitted, handleSubmit } = useFormNote({
    defaultValues: props?.defaultValues,
    close: props?.close,
  });

  const mobile = useMediaQuery('(max-width: 36em)');

  return (
    <form onSubmit={form.onSubmit(() => handleSubmit())} noValidate>
      <Grid gutter={mobile ? 5 : undefined}>
        <GridCol span={12}>
          <TextInput
            required
            label={mobile ? 'Name' : undefined}
            aria-label="Name"
            placeholder="Name"
            data-autofocus
            leftSection={
              <IconLetterCase size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            }
            {...form.getInputProps('title')}
          />
        </GridCol>

        <GridCol span={12}>
          <Group grow mt={mobile ? 'xs' : undefined}>
            <Button
              disabled={submitted}
              color="dark"
              variant="light"
              onClick={() => {
                if (props?.close) props.close();
              }}
            >
              {'Cancel'}
            </Button>

            <Button type="submit" loading={submitted}>
              {submitted ? 'Saving' : 'Save'}
            </Button>
          </Group>
        </GridCol>
      </Grid>
    </form>
  );
}
