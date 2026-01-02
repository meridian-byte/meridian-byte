'use client';

import React from 'react';
import { useFormServing } from '@/hooks/form/serving';
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
import { ServingGet } from '@repo/types/models/serving';
import { useMediaQuery } from '@mantine/hooks';
import { WeightUnitType } from '@repo/types/models/enums';
import { FormEat } from '@/hooks/form/eat';

export default function Serving({
  props,
}: {
  props?: {
    defaultValues?: Partial<ServingGet>;
    options?: { meal?: boolean };
    formEat?: FormEat;
    close?: () => void;
  };
}) {
  const { form, submitted, handleSubmit, foods } = useFormServing({
    defaultValues: props?.defaultValues,
    options: props?.options,
    formEat: props?.formEat,
  });

  const mobile = useMediaQuery('(max-width: 36em)');

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!form.isValid()) {
          form.validate();
        } else {
          handleSubmit();
          if (props?.close) props.close();
        }
      }}
      noValidate
    >
      <Grid gutter={mobile ? 'xs' : undefined}>
        <GridCol span={12}>
          <NativeSelect
            required
            label={mobile ? 'Food' : undefined}
            aria-label="Food"
            leftSection={
              <IconCarrot size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            }
            disabled={!foods || foods.length === 0}
            data={[
              { label: 'Select Food', value: '' },
              ...(foods || []).map((food) => {
                return {
                  label: `${food.description}, ${food.name}`,
                  value: food.id,
                };
              }),
            ]}
            {...form.getInputProps('food_id')}
          />
        </GridCol>

        <GridCol span={6}>
          <NumberInput
            required
            label={mobile ? 'Serving Size' : undefined}
            aria-label="Serving Size"
            placeholder="Serving Size"
            leftSection={
              <Tooltip label="Serving quantity (eg. 300g)">
                <Group>
                  <IconWeight size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
                </Group>
              </Tooltip>
            }
            {...form.getInputProps('serving_size')}
          />
        </GridCol>

        <GridCol span={6}>
          <NativeSelect
            required
            label={mobile ? 'Serving Unit' : undefined}
            aria-label="Serving Unit"
            leftSection={
              <Tooltip label="Serving unit (eg. grams)">
                <Group>
                  <IconRuler2 size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
                </Group>
              </Tooltip>
            }
            data={[
              {
                label: 'Select Type',
                value: '',
              },
              {
                label: capitalizeWords(WeightUnitType.GRAMS),
                value: WeightUnitType.GRAMS,
              },
              {
                label: capitalizeWords(WeightUnitType.GRAMS),
                value: WeightUnitType.GRAMS,
              },
            ]}
            {...form.getInputProps('serving_unit')}
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
