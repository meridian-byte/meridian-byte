'use client';

import React from 'react';
import { useFormMeal } from '@/hooks/form/meal';
import {
  Box,
  Button,
  Center,
  Divider,
  Grid,
  GridCol,
  Group,
  Loader,
  ScrollAreaAutosize,
  Stack,
  Text,
  Textarea,
  TextInput,
} from '@mantine/core';
import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  SECTION_SPACING,
} from '@repo/constants/sizes';
import { MealGet } from '@repo/types/models/meal';
import { useMediaQuery } from '@mantine/hooks';
import { IconAlignJustified, IconLetterCase } from '@tabler/icons-react';
import { useStoreServing } from '@/libraries/zustand/stores/serving';
import { sortArray } from '@repo/utilities/array';
import { Order } from '@repo/types/enums';
import ModalServingCrud from '../common/modals/serving/crud';
import CardServing from '../common/cards/serving';

export default function Meal({
  props,
}: {
  props?: {
    defaultValues?: Partial<MealGet>;
    close?: () => void;
  };
}) {
  const { servings } = useStoreServing();
  const mealServings = servings?.filter(
    (s) => s.meal_id == props?.defaultValues?.id
  );

  const { form, submitted, handleSubmit } = useFormMeal({
    defaultValues: props?.defaultValues,
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
          <TextInput
            required
            label={mobile ? 'Name' : undefined}
            aria-label="Name"
            placeholder="Name"
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

        {props?.defaultValues && (
          <GridCol span={12}>
            <ScrollAreaAutosize h={120}>
              <Box px={'xs'}>
                {servings === undefined ? (
                  <Center py={SECTION_SPACING / 2}>
                    <Loader />
                  </Center>
                ) : !mealServings?.length ? (
                  <Center py={SECTION_SPACING / 2}>
                    <Text fz={'sm'} c={'dimmed'} ta={'center'}>
                      No servings found.
                    </Text>
                  </Center>
                ) : (
                  <Stack gap={0}>
                    {sortArray(
                      mealServings,
                      (i) => new Date(i.updated_at),
                      Order.DESCENDING
                    ).map((s, i) => (
                      <Stack gap={0} key={s.id}>
                        {i > 0 && <Divider />}

                        <ModalServingCrud props={s} options={{ meal: true }}>
                          <CardServing props={s} />
                        </ModalServingCrud>
                      </Stack>
                    ))}
                  </Stack>
                )}
              </Box>
            </ScrollAreaAutosize>
          </GridCol>
        )}

        <GridCol span={12}>
          <Group grow mt={mobile ? 'xs' : undefined}>
            {props?.defaultValues && (
              <ModalServingCrud
                props={{ meal_id: props.defaultValues.id || '' }}
              >
                <Group justify="end">
                  <Button fullWidth variant="light" size="xs">
                    Add Servings
                  </Button>
                </Group>
              </ModalServingCrud>
            )}

            <Button fullWidth type="submit" loading={submitted} size="xs">
              {submitted ? 'Saving' : 'Save'}
            </Button>
          </Group>
        </GridCol>
      </Grid>
    </form>
  );
}
