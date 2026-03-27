'use client';

import React from 'react';
import { FormEat, useFormEat } from '@/hooks/form/eat';
import {
  Button,
  Grid,
  GridCol,
  Group,
  NativeSelect,
  NumberInput,
  Tooltip,
} from '@mantine/core';
import { IconCarrot, IconRuler2, IconWeight } from '@tabler/icons-react';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@repo/constants/sizes';
import { capitalizeWords } from '@repo/utilities/string';
import { EatGet } from '@repo/types/models/eat';
import { useMediaQuery } from '@mantine/hooks';
import { WeightUnitType } from '@repo/types/models/enums';
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
