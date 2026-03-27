'use client';

import React from 'react';
import { FormEat } from '@/hooks/form/eat';
import { Button, Grid, GridCol, Group } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import TabsEat from '../common/tabs/eat';

export default function Eat({
  props,
}: {
  props: {
    form: FormEat;
    submitted: boolean;
    handleSubmit: () => void;
    close?: () => void;
  };
}) {
  const mobile = useMediaQuery('(max-width: 36em)');

  return (
    <form
      onSubmit={props.form.onSubmit(() => {
        props.handleSubmit();
        if (props.close) props.close();
      })}
      noValidate
    >
      <Grid gutter={mobile ? 'xs' : undefined}>
        <GridCol span={12}>
          <TabsEat props={{ form: props.form }} />
        </GridCol>

        <GridCol span={12}>
          <Group justify="end" mt={mobile ? 'xs' : undefined}>
            <Button fullWidth type="submit" loading={props.submitted}>
              {props.submitted ? 'Saving' : 'Save'}
            </Button>
          </Group>
        </GridCol>
      </Grid>
    </form>
  );
}
