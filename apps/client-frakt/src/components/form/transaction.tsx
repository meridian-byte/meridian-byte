'use client';

import React from 'react';
import { useFormTransaction } from '@/hooks/form/transaction';
import {
  Button,
  Grid,
  GridCol,
  Group,
  NativeSelect,
  NumberInput,
  Textarea,
} from '@mantine/core';
import {
  IconArrowsTransferUpDown,
  IconCalendarClock,
  IconCashBanknote,
  IconCoins,
  IconLabel,
  IconReceipt,
  IconTransfer,
} from '@tabler/icons-react';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@repo/constants/sizes';
import { capitalizeWords } from '@repo/utilities/string';
import { TransactionType } from '@repo/types/models/enums';
import { TransactionGet } from '@repo/types/models/transaction';
import { DateTimePicker } from '@mantine/dates';
import { useMediaQuery } from '@mantine/hooks';

export default function Transaction({
  props,
}: {
  props?: {
    defaultValues?: Partial<TransactionGet>;
    close?: () => void;
  };
}) {
  const {
    form,
    submitted,
    handleSubmit,
    categories,
    accounts,
    accountId2,
    setaccountId2,
  } = useFormTransaction({
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
            label={mobile ? 'Type' : undefined}
            aria-label="Type"
            leftSection={
              <IconArrowsTransferUpDown
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
                label: capitalizeWords(TransactionType.CREDIT),
                value: TransactionType.CREDIT,
              },
              {
                label: capitalizeWords(TransactionType.DEBIT),
                value: TransactionType.DEBIT,
              },
              {
                label: capitalizeWords(TransactionType.TRANSFER),
                value: TransactionType.TRANSFER,
              },
            ]}
            {...form.getInputProps('type')}
          />
        </GridCol>

        <GridCol span={{ base: 12, sm: 6 }}>
          <DateTimePicker
            required
            label={mobile ? 'Date' : undefined}
            aria-label="Date"
            placeholder="Date"
            leftSection={
              <IconCalendarClock size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            }
            {...form.getInputProps('date')}
          />
        </GridCol>

        <GridCol
          span={{
            base: 12,
            xs: form.values.type !== TransactionType.CREDIT ? 8 : 12,
          }}
        >
          <NumberInput
            required
            label={mobile ? 'Amount' : undefined}
            aria-label="Amount"
            placeholder="Amount"
            data-autofocus
            min={0}
            leftSection={
              <IconCoins size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            }
            {...form.getInputProps('amount')}
          />
        </GridCol>

        {form.values.type !== TransactionType.CREDIT && (
          <GridCol span={{ base: 12, xs: 4 }}>
            <NumberInput
              label={mobile ? 'Fees' : undefined}
              aria-label="Fees"
              placeholder="Fees"
              min={0}
              leftSection={
                <IconTransfer size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
              }
              {...form.getInputProps('fees')}
            />
          </GridCol>
        )}

        {form.values.type == TransactionType.DEBIT && (
          <GridCol span={12}>
            <NativeSelect
              required
              label={mobile ? 'Category' : undefined}
              aria-label="Category"
              leftSection={
                <IconLabel size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
              }
              disabled={!categories || categories.length === 0}
              data={[
                { label: 'Select Category', value: '' },
                ...(categories || []).map((c) => {
                  return { label: c.title, value: c.id };
                }),
              ]}
              {...form.getInputProps('category_id')}
            />
          </GridCol>
        )}

        <GridCol
          span={{
            base: 12,
            xs: form.values.type === TransactionType.TRANSFER ? 6 : 12,
          }}
        >
          <NativeSelect
            required
            label={
              mobile
                ? `${form.values.type === TransactionType.TRANSFER ? 'From' : 'Account'}`
                : undefined
            }
            aria-label={`${form.values.type === TransactionType.TRANSFER ? 'From' : 'Account'}`}
            leftSection={
              <IconCashBanknote size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            }
            disabled={!accounts || accounts.length === 0}
            data={[
              {
                label:
                  form.values.type === TransactionType.TRANSFER
                    ? 'From'
                    : 'Select Account',
                value: '',
              },
              ...(accounts || []).map((c) => {
                return { label: c.name, value: c.id };
              }),
            ]}
            {...form.getInputProps('account_id')}
          />
        </GridCol>

        {form.values.type === TransactionType.TRANSFER && (
          <GridCol span={{ base: 12, xs: 6 }}>
            <NativeSelect
              required
              label={mobile ? 'To' : undefined}
              aria-label={`To`}
              leftSection={
                <IconCashBanknote size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
              }
              disabled={!accounts || accounts.length === 0}
              data={[
                { label: 'To', value: '' },
                ...(accounts || []).map((c) => {
                  return { label: c.name, value: c.id };
                }),
              ]}
              value={accountId2}
              onChange={(event) => setaccountId2(event.currentTarget.value)}
            />
          </GridCol>
        )}

        <GridCol span={12}>
          <Textarea
            label={mobile ? 'Description' : undefined}
            aria-label="Descrption"
            placeholder="Descrption"
            leftSection={
              <IconReceipt size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
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
