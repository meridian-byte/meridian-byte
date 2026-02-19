'use client';

import React from 'react';
import { useFormAccount } from '@repo/hooks/form/account';
import {
  Button,
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
  IconCoins,
  IconLabel,
  IconLetterCase,
  IconSettingsQuestion,
} from '@tabler/icons-react';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@repo/constants/sizes';
import { capitalizeWords } from '@repo/utilities/string';
import { AccountType } from '@repo/types/models/enums';
import { AccountGet } from '@repo/types/models/account';
import { useMediaQuery } from '@mantine/hooks';

export default function Account({
  props,
}: {
  props?: {
    defaultValues?: Partial<AccountGet>;
    close?: () => void;
  };
}) {
  const { form, submitted, handleSubmit, accountGroups } = useFormAccount({
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
        <GridCol span={{ base: 12, sm: 6 }}>
          <NativeSelect
            required
            label={mobile ? 'Group' : undefined}
            aria-label="Group"
            leftSection={
              <IconLabel size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            }
            disabled={!accountGroups || accountGroups.length === 0}
            data={[
              { label: 'Select Group', value: '' },
              ...(accountGroups || []).map((group) => {
                return { label: group.name, value: group.id };
              }),
            ]}
            {...form.getInputProps('group_id')}
          />
        </GridCol>

        <GridCol span={{ base: 12, sm: 6 }}>
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
                label: capitalizeWords(AccountType.ASSET),
                value: AccountType.ASSET,
              },
              {
                label: capitalizeWords(AccountType.LIABILITY),
                value: AccountType.LIABILITY,
              },
            ]}
            {...form.getInputProps('type')}
          />
        </GridCol>

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
          <NumberInput
            required
            label={mobile ? 'Amount' : undefined}
            aria-label="Amount"
            placeholder="Amount"
            leftSection={
              <IconCoins size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            }
            {...form.getInputProps('balance')}
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
