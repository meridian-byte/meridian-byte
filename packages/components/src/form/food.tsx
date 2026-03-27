'use client';

import React from 'react';
import { useFormFood } from '@repo/hooks/form/food';
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
  Tooltip,
} from '@mantine/core';
import {
  IconAlignJustified,
  IconDroplet,
  IconEggs,
  IconFlame,
  IconLetterCase,
  IconRuler2,
  IconWeight,
  IconWheat,
} from '@tabler/icons-react';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@repo/constants/sizes';
import { capitalizeWords } from '@repo/utilities/string';
import { FoodGet } from '@repo/types/models/food';
import { useMediaQuery } from '@mantine/hooks';
import { WeightUnitType } from '@repo/types/models/enums';
import { COLOR_CODES } from '@repo/constants/other';

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
              <Tooltip label="Quantity mass (eg. per 100g)">
                <Group>
                  <IconWeight size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
                </Group>
              </Tooltip>
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
              <Tooltip label="Mass unit (eg. grams)">
                <Group>
                  <IconRuler2 size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
                </Group>
              </Tooltip>
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
              <Tooltip label="Carbs">
                <Group c={`${COLOR_CODES.FOOD.CARBS}.6`}>
                  <IconWheat size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
                </Group>
              </Tooltip>
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
              <Tooltip label="Protein">
                <Group c={`${COLOR_CODES.FOOD.PROTEINS}.6`}>
                  <IconEggs size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
                </Group>
              </Tooltip>
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
              <Tooltip label="Fat">
                <Group c={`${COLOR_CODES.FOOD.FATS}.6`}>
                  <IconDroplet size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
                </Group>
              </Tooltip>
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
              <Tooltip label="Calories (Kcal)">
                <Group c={`${COLOR_CODES.FOOD.KCAL}.6`}>
                  <IconFlame size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
                </Group>
              </Tooltip>
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
