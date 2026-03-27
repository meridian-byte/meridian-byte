'use client';

import React from 'react';
import { useFormFood } from '@/hooks/form/food';
import {
  Button,
  Divider,
  Grid,
  GridCol,
  Group,
  NativeSelect,
  NumberInput,
  Textarea,
  TextInput,
} from '@mantine/core';
import {
  IconAlignJustified,
  IconAtom2,
  IconAtom2Filled,
  IconBolt,
  IconCoins,
  IconDropCircle,
  IconLetterCase,
  IconRuler2,
  IconSettingsQuestion,
  IconToolsKitchen,
  IconWeight,
} from '@tabler/icons-react';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@repo/constants/sizes';
import { capitalizeWords } from '@repo/utilities/string';
import { FoodGet } from '@repo/types/models/food';
import { useMediaQuery } from '@mantine/hooks';
import { WeightUnitType } from '@repo/types/models/enums';

export default function Food({
  props,
}: {
  props?: {
    defaultValues?: Partial<FoodGet>;
    close?: () => void;
  };
}) {
  const { form, submitted, handleSubmit } = useFormFood({
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
        <GridCol span={12}>
          <TextInput
            required
            label={mobile ? 'Name' : undefined}
            aria-label="Name"
            placeholder="Name"
            variant="filled"
            data-autofocus
            leftSection={
              <IconLetterCase size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            }
            {...form.getInputProps('name')}
          />
        </GridCol>

        <GridCol span={12}>
          <Textarea
            label={mobile ? 'Description' : undefined}
            aria-label="Descrption"
            placeholder="Descrption"
            leftSection={
              <IconAlignJustified size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            }
            autosize
            maxRows={5}
            {...form.getInputProps('description')}
          />
        </GridCol>

        <GridCol span={6}>
          <NumberInput
            required
            label={mobile ? 'Per' : undefined}
            aria-label="Per"
            placeholder="Per"
            leftSection={
              <IconWeight size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            }
            {...form.getInputProps('per')}
          />
        </GridCol>

        <GridCol span={6}>
          <NativeSelect
            required
            label={mobile ? 'Unit' : undefined}
            aria-label="Unit"
            leftSection={
              <IconRuler2 size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            }
            data={[
              {
                label: 'Select Unit',
                value: '',
              },
              {
                label: capitalizeWords(WeightUnitType.GRAMS),
                value: WeightUnitType.GRAMS,
              },
              {
                label: capitalizeWords(WeightUnitType.MILLIGRAMS),
                value: WeightUnitType.MILLIGRAMS,
              },
            ]}
            {...form.getInputProps('per_unit')}
          />
        </GridCol>

        <GridCol span={12}>
          <Divider my={{ base: 'xs', xs: 0 }} />
        </GridCol>

        <GridCol span={6}>
          <NumberInput
            required
            label={mobile ? 'Carbs' : undefined}
            aria-label="Carbs"
            placeholder="Carbs"
            leftSection={
              <IconAtom2Filled size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            }
            {...form.getInputProps('carbs')}
          />
        </GridCol>

        <GridCol span={6}>
          <NumberInput
            required
            label={mobile ? 'Protein' : undefined}
            aria-label="Protein"
            placeholder="Protein"
            leftSection={
              <IconAtom2 size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            }
            {...form.getInputProps('protein')}
          />
        </GridCol>

        <GridCol span={6}>
          <NumberInput
            required
            label={mobile ? 'Fat' : undefined}
            aria-label="Fat"
            placeholder="Fat"
            leftSection={
              <IconDropCircle size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            }
            {...form.getInputProps('fat')}
          />
        </GridCol>

        <GridCol span={6}>
          <NumberInput
            required
            label={mobile ? 'Kcal' : undefined}
            aria-label="Kcal"
            placeholder="Kcal"
            leftSection={
              <IconBolt size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            }
            {...form.getInputProps('kcal')}
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
