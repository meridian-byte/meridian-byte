'use client';

import React from 'react';
import { useFormTask } from '@repo/hooks/form/task';
import {
  Button,
  Grid,
  GridCol,
  Group,
  NumberInput,
  Tooltip,
} from '@mantine/core';
import {
  IconAtom,
  IconBarbell,
  IconBone,
  IconCalendar,
  IconDroplet,
  IconDropletHeart,
  IconGauge,
  IconMan,
  IconScaleOutline,
} from '@tabler/icons-react';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@repo/constants/sizes';
import { TaskGet } from '@repo/types/models/task';
import { useMediaQuery } from '@mantine/hooks';
import { DateInput } from '@mantine/dates';
import { COLOR_CODES } from '@repo/constants/other';

export default function Task({
  props,
}: {
  props?: {
    defaultValues?: Partial<TaskGet>;
    close?: () => void;
  };
}) {
  const { form, submitted, handleSubmit } = useFormTask({
    defaultValues: props?.defaultValues,
  });

  const mobile = useMediaQuery('(max-width: 36em)');

  return (
    <form
      onSubmit={form.onSubmit(() => {
        handleSubmit();
        if (props?.close) props.close();
      })}
      noValidate
    >
      <Grid gutter={mobile ? 'xs' : undefined}>
        form task
        <GridCol span={12}>
          <Group justify="end" mt={mobile ? 'xs' : undefined}>
            <Button fullWidth type="submit" loading={submitted}>
              {submitted ? 'Saving' : 'Save'}
            </Button>
          </Group>
        </GridCol>
      </Grid>
    </form>
  );
}
