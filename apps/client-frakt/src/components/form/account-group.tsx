'use client';

import React from 'react';
import { useFormAccountGroup } from '@/hooks/form/account-group';
import { Button, Grid, GridCol, Group, TextInput } from '@mantine/core';
import { IconLetterCase } from '@tabler/icons-react';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@repo/constants/sizes';
import { AccountGroupGet } from '@repo/types/models/account-group';
import { useMediaQuery } from '@mantine/hooks';

export default function AccountGroup({
  props,
}: {
  props?: {
    defaultValues?: Partial<AccountGroupGet>;
    close?: () => void;
  };
}) {
  const { form, submitted, handleSubmit } = useFormAccountGroup({
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
      <Grid gutter={mobile ? 5 : undefined}>
        <GridCol span={12}>
          <TextInput
            required
            label={mobile ? 'Name' : undefined}
            aria-label="Name"
            placeholder="Name"
            leftSection={
              <IconLetterCase size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            }
            {...form.getInputProps('name')}
          />
        </GridCol>

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
