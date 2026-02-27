'use client';

import React from 'react';
import LayoutSection from '@repo/components/layout/section';
import { useStoreTransaction } from '@repo/libraries/zustand/stores/transaction';
import {
  Center,
  Divider,
  Loader,
  NumberFormatter,
  Stack,
  Text,
} from '@mantine/core';
import CardTransaction from '@repo/components/common/cards/transaction';
import { SECTION_SPACING } from '@repo/constants/sizes';
import { sortArray } from '@repo/utilities/array';
import { Order } from '@repo/types/enums';
import { ActionIcon, Group, Title, Tooltip } from '@mantine/core';
import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
} from '@repo/constants/sizes';
import {
  IconChevronLeft,
  IconChevronRight,
  IconPlus,
} from '@tabler/icons-react';
import ModalTransactionCrud from '@repo/components/common/modals/transaction/crud';
import IndicatorNetworkStatus from '@repo/components/common/indicators/network-status';
import { useStoreSyncStatus } from '@repo/libraries/zustand/stores/sync-status';
import { TransactionType } from '@repo/types/models/enums';
import { useEntryDate, EntryDateReturnType } from '@repo/hooks/entries';
import { areSameDay, isToday, isYesterday } from '@repo/utilities/date-time';
import { DateInput } from '@mantine/dates';

export default function Transactions() {
  const transactions = useStoreTransaction((s) => s.transactions);
  const entryDate = useEntryDate();

  const todaysTransactions = transactions?.filter((t) => {
    if (!entryDate.date) return false;
    return areSameDay(t.created_at, entryDate.date);
  });

  return (
    <>
      <TransactionsHeader props={{ entryDate }} />

      <OverviewTransactions props={{ entryDate }} />

      <LayoutSection id="app-home" containerized={'xs'} padded={'md'}>
        {transactions === undefined ? (
          <Center py={SECTION_SPACING}>
            <Loader />
          </Center>
        ) : !todaysTransactions?.length ? (
          <Center py={SECTION_SPACING}>
            <Text fz={'sm'} c={'dimmed'} ta={'center'}>
              No transactions found.
            </Text>
          </Center>
        ) : (
          <Stack gap={0}>
            {sortArray(
              todaysTransactions,
              (i) => new Date(i.created_at),
              Order.DESCENDING
            ).map((acc, i) => (
              <Stack gap={5} key={acc.id}>
                {i > 0 && <Divider mt={5} />}

                <CardTransaction props={acc} />
              </Stack>
            ))}
          </Stack>
        )}
      </LayoutSection>
    </>
  );
}

export function TransactionsHeader({
  props,
}: {
  props: { entryDate: EntryDateReturnType };
}) {
  const syncStatus = useStoreSyncStatus((s) => s.syncStatus);

  return (
    <LayoutSection
      id="layout-header-transactions"
      containerized={'xs'}
      padded={'xs'}
    >
      <Group justify="space-between">
        <Title order={1} fz={'md'} fw={500}>
          Transactions
        </Title>

        <Group justify="end" wrap="nowrap">
          <IndicatorNetworkStatus props={{ syncStatus }} />

          <ModalTransactionCrud
            props={{
              created_at: (props.entryDate.date ||
                new Date().toISOString()) as any,
            }}
          >
            <Group>
              <Tooltip label={'Create Transaction'}>
                <ActionIcon size={ICON_WRAPPER_SIZE} variant="light">
                  <IconPlus size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
                </ActionIcon>
              </Tooltip>
            </Group>
          </ModalTransactionCrud>
        </Group>
      </Group>
    </LayoutSection>
  );
}

export function OverviewTransactions({
  props,
}: {
  props?: { entryDate?: EntryDateReturnType };
}) {
  const transactions = useStoreTransaction((s) => s.transactions);

  const dayTransactions = transactions?.filter((t) => {
    return areSameDay(
      t.created_at,
      props?.entryDate?.date ? props.entryDate.date : new Date().toISOString()
    );
  });

  const assetTransactions =
    (dayTransactions || []).filter(
      (t) => !t.transfer && t.type === TransactionType.CREDIT
    ) || [];
  const liabilityTransactions =
    (dayTransactions || []).filter(
      (t) => !t.transfer && t.type === TransactionType.DEBIT
    ) || [];
  const transferTransactions =
    (dayTransactions || []).filter((t) => t.transfer) || [];

  const assetValue = assetTransactions.reduce(
    (sum, tran) => sum + Number(tran.amount),
    0
  );
  const liabilityValue = liabilityTransactions.reduce(
    (sum, tran) => sum + (Number(tran.amount) + Number(tran.fees)),
    0
  );
  const transferFeesValue = transferTransactions.reduce(
    (sum, tran) => sum + Number(tran.fees),
    0
  );

  const overview = [
    {
      value: assetValue.toFixed(2),
      label: 'Income',
      color: 'blue',
    },
    {
      value: (liabilityValue + transferFeesValue).toFixed(2),
      label: 'Expenses',
      color: 'red',
    },
    {
      value: (assetValue - (liabilityValue + transferFeesValue)).toFixed(2),
      label: 'Total',
    },
  ];

  return (
    <LayoutSection
      id="partial-overview-transactions"
      containerized={'xs'}
      padded={'xs'}
      bg={
        'light-dark(var(--mantine-color-dark-4), var(--mantine-color-dark-8))'
      }
    >
      {props?.entryDate && (
        <>
          <PartialDate props={props.entryDate} />
          <Divider mt={'xs'} variant="dashed" />
        </>
      )}

      <Group justify="center" grow mt={'xs'}>
        {overview.map((oi) => (
          <Stack key={oi.label} gap={0} align="center">
            <Text inherit ta={'center'} fz={'sm'} c={'dimmed'}>
              {oi.label}
            </Text>

            <Text
              component="span"
              inherit
              c={`${oi.color}.6`}
              ta={'center'}
              fw={500}
            >
              <NumberFormatter value={oi.value} decimalScale={2} />
            </Text>
          </Stack>
        ))}
      </Group>
    </LayoutSection>
  );
}

function PartialDate({ props }: { props: EntryDateReturnType }) {
  const { date, setDate, handlePrevious, handleNext } = props;

  const currentIsYesterday = props.date ? isYesterday(props.date) : false;
  const currentIsToday = props.date ? isToday(props.date) : false;

  return (
    <Group justify="space-between" wrap="nowrap" pt={'xs'}>
      <ActionIcon
        size={ICON_WRAPPER_SIZE}
        variant="subtle"
        onClick={handlePrevious}
      >
        <IconChevronLeft size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
      </ActionIcon>

      {props.date && (
        <Group justify="center" mih={30}>
          {currentIsYesterday ? (
            <Text inherit fz={'sm'}>
              Yesterday
            </Text>
          ) : currentIsToday ? (
            <Text inherit fz={'sm'}>
              Today
            </Text>
          ) : (
            <DateInput
              value={date}
              onChange={setDate}
              aria-label="Entry date"
              variant="unstyled"
              size="xs"
              styles={{
                input: {
                  textAlign: 'center',
                  fontSize: 'var(--mantine-font-size-sm)',
                },
              }}
            />
          )}
        </Group>
      )}

      <ActionIcon
        size={ICON_WRAPPER_SIZE}
        variant="subtle"
        onClick={handleNext}
        disabled={currentIsToday}
      >
        <IconChevronRight size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
      </ActionIcon>
    </Group>
  );
}
