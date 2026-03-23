'use client';

import React from 'react';
import { useFormCategory } from '@repo/hooks/form/category';
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
import { CategoryGet } from '@repo/types/models/category';
import { capitalizeWords } from '@repo/utilities/string';
import { CategoryType } from '@repo/types/models/enums';
import { useMediaQuery } from '@mantine/hooks';
import { APP_NAME } from '@repo/constants/app';

export default function Category({
  props,
}: {
  props?: {
    defaultValues?: Partial<CategoryGet>;
    source: string;
    close?: () => void;
  };
}) {
  const { form, submitted, handleSubmit } = useFormCategory({
    defaultValues: props?.defaultValues,
  });

  const mobile = useMediaQuery('(max-width: 36em)');

  return (
    <form
      // onSubmit={form.onSubmit(async () => {
      //   await handleSubmit();
      //   if (props?.close) props.close();
      // })}
      noValidate
    >
      <Grid gutter={mobile ? 5 : undefined}>
        {props?.source == APP_NAME.SATE && (
          <GridCol span={12}>
            <NativeSelect
              required
              label={mobile ? 'Type' : undefined}
              aria-label="Type"
              leftSection={
                <IconSettingsQuestion
                  size={ICON_SIZE}
                  stroke={ICON_STROKE_WIDTH}
                />
              }
              data={[
                {
                  label: 'Select Type',
                  value: '',
                },
                {
                  label: capitalizeWords(CategoryType.CREDIT),
                  value: CategoryType.CREDIT,
                },
                {
                  label: capitalizeWords(CategoryType.DEBIT),
                  value: CategoryType.DEBIT,
                },
              ]}
              {...form.getInputProps('type')}
            />
          </GridCol>
        )}

        <GridCol span={12}>
          <TextInput
            required
            label={mobile ? 'Name' : undefined}
            aria-label="Name"
            placeholder="Name"
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

            <Button
              type="submit"
              loading={submitted}
              onClick={async () => {
                await handleSubmit();
                if (props?.close) props.close();
              }}
            >
              {submitted ? 'Saving' : 'Save'}
            </Button>
          </Group>
        </GridCol>
      </Grid>
    </form>
  );
}
