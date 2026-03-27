'use client';

import React from 'react';
import { useFormMass } from '@repo/hooks/form/mass';
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
import { MassGet } from '@repo/types/models/mass';
import { useMediaQuery } from '@mantine/hooks';
import { DateInput } from '@mantine/dates';
import { COLOR_CODES } from '@repo/constants/other';

export default function Mass({
  props,
}: {
  props?: {
    defaultValues?: Partial<MassGet>;
    close?: () => void;
  };
}) {
  const { form, submitted, handleSubmit } = useFormMass({
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
          <DateInput
            required
            label={mobile ? 'Day Measured' : undefined}
            aria-label="Day Measured"
            placeholder="Day Measured"
            leftSection={
              <Tooltip
                multiline
                maw={240}
                label="The day the weight measurement was taken."
              >
                <Group>
                  <IconCalendar size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
                </Group>
              </Tooltip>
            }
            {...form.getInputProps('created_at')}
          />
        </GridCol>

        <GridCol span={6}>
          <NumberInput
            required
            label={mobile ? 'Weight' : undefined}
            aria-label="Weight"
            placeholder="Weight"
            leftSection={
              <Tooltip multiline maw={240} label="Total weight of the body.">
                <Group>
                  <IconScaleOutline
                    size={ICON_SIZE}
                    stroke={ICON_STROKE_WIDTH}
                  />
                </Group>
              </Tooltip>
            }
            {...form.getInputProps('weight')}
          />
        </GridCol>

        <GridCol span={6}>
          <NumberInput
            required
            label={mobile ? 'Fat' : undefined}
            aria-label="Fat"
            placeholder="Fat"
            leftSection={
              <Tooltip
                multiline
                maw={240}
                label="Total weight of all fat in the body (including visceral fat)."
              >
                <Group c={`${COLOR_CODES.MASSES.FAT}.6`}>
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
            label={mobile ? 'Visceral Fat' : undefined}
            aria-label="Visceral Fat"
            placeholder="Visceral Fat"
            leftSection={
              <Tooltip
                multiline
                maw={240}
                label="Fat found in the abdominal cavity surrounding the organs."
              >
                <Group c={`${COLOR_CODES.MASSES.FAT}.6`}>
                  <IconDropletHeart
                    size={ICON_SIZE}
                    stroke={ICON_STROKE_WIDTH}
                  />
                </Group>
              </Tooltip>
            }
            {...form.getInputProps('visceral_fat')}
          />
        </GridCol>

        <GridCol span={6}>
          <NumberInput
            required
            label={mobile ? 'Lean Weight' : undefined}
            aria-label="Lean Weight"
            placeholder="Lean Weight"
            leftSection={
              <Tooltip
                multiline
                maw={240}
                label="Total weight of all body components excluding fat."
              >
                <Group>
                  <IconMan size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
                </Group>
              </Tooltip>
            }
            {...form.getInputProps('lean_weight')}
          />
        </GridCol>

        <GridCol span={6}>
          <NumberInput
            required
            label={mobile ? 'Muscle' : undefined}
            aria-label="Muscle"
            placeholder="Muscle"
            leftSection={
              <Tooltip
                multiline
                maw={240}
                label="Total weight of soft muscle tissue."
              >
                <Group c={`${COLOR_CODES.MASSES.MUSCLE}.6`}>
                  <IconBarbell size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
                </Group>
              </Tooltip>
            }
            {...form.getInputProps('muscle')}
          />
        </GridCol>

        <GridCol span={6}>
          <NumberInput
            required
            label={mobile ? 'Bone' : undefined}
            aria-label="Bone"
            placeholder="Bone"
            leftSection={
              <Tooltip
                multiline
                maw={240}
                label="Total amount of minerals in your bones."
              >
                <Group>
                  <IconBone size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
                </Group>
              </Tooltip>
            }
            {...form.getInputProps('bone')}
          />
        </GridCol>

        {/* <GridCol span={6}>
          <NumberInput
            required
            label={mobile ? 'Water' : undefined}
            aria-label="Water"
            placeholder="Water"
            leftSection={
              <Tooltip
                multiline
                maw={240}
                label="Total weight of water in your body."
              >
                <Group>
                  <IconDropletHalf2
                    size={ICON_SIZE}
                    stroke={ICON_STROKE_WIDTH}
                  />
                </Group>
              </Tooltip>
            }
            {...form.getInputProps('water')}
          />
        </GridCol> */}

        <GridCol span={6}>
          <NumberInput
            required
            label={mobile ? 'BMI' : undefined}
            aria-label="BMI"
            placeholder="BMI"
            leftSection={
              <Tooltip
                multiline
                maw={240}
                label="Body Mass Index (BMI) measures weight compared to height."
              >
                <Group c={`${COLOR_CODES.MASSES.BMI}.6`}>
                  <IconGauge size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
                </Group>
              </Tooltip>
            }
            {...form.getInputProps('bmi')}
          />
        </GridCol>

        <GridCol span={6}>
          <NumberInput
            required
            label={mobile ? 'BMR' : undefined}
            aria-label="BMR"
            placeholder="BMR"
            leftSection={
              <Tooltip
                multiline
                maw={240}
                label="Body Mass Index (BMI) measures energy required for your body to continue operating in a resting state."
              >
                <Group>
                  <IconAtom size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
                </Group>
              </Tooltip>
            }
            {...form.getInputProps('bmr')}
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
