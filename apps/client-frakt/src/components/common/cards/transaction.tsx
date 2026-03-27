'use client';

import React from 'react';
import {
  Card,
  Center,
  Divider,
  Grid,
  GridCol,
  Group,
  NumberFormatter,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { TransactionGet } from '@repo/types/models/transaction';
import { TransactionType } from '@repo/types/models/enums';
import ModalTransactionCrud from '../modals/transaction/crud';
import { useStoreCategory } from '@/libraries/zustand/stores/category';
import { useStoreAccount } from '@/libraries/zustand/stores/account';
import classes from './transaction.module.scss';

export default function Transaction({ props }: { props: TransactionGet }) {
  const { categories } = useStoreCategory();
  const { accounts } = useStoreAccount();

  const transactionCategory = categories?.find(
    (c) => c.id == props.category_id
  );
  const transactionAccount = accounts?.find((a) => a.id == props.account_id);

  return (
    <Card
      radius={0}
      bg={'transparent'}
      padding={'xs'}
      style={{ cursor: 'pointer' }}
      className={classes.card}
    >
      <ModalTransactionCrud props={props}>
        <Grid gutter={0}>
          <GridCol span={9}>
            <Grid gutter={0}>
              <GridCol span={4}>
                <Text lineClamp={1} fz={'sm'}>
                  {transactionCategory
                    ? transactionCategory.title
                    : `Transfer ${
                        props.type == TransactionType.CREDIT ? 'In' : 'Out'
                      }`}
                </Text>
              </GridCol>

              <GridCol span={1}>
                <Center h={'100%'}>
                  <Divider orientation="vertical" />
                </Center>
              </GridCol>

              <GridCol span={7}>
                <Stack gap={0}>
                  <Text lineClamp={1} fz={'sm'}>
                    {transactionAccount?.name}
                  </Text>

                  {Number(props.fees) > 0 && (
                    <Text lineClamp={1} c="dimmed" fz="xs">
                      Fees:{' '}
                      <Text component="span" inherit fw={500} c={'red.6'}>
                        <NumberFormatter value={props.fees.toString()} />
                      </Text>
                    </Text>
                  )}
                </Stack>
              </GridCol>
            </Grid>
          </GridCol>

          <GridCol span={3}>
            <Group justify="end">
              <Title
                order={3}
                ta={'end'}
                fz={'md'}
                fw={500}
                c={props.type === TransactionType.CREDIT ? 'blue.6' : 'red.6'}
              >
                <NumberFormatter value={props.amount.toString()} />
              </Title>
            </Group>
          </GridCol>
        </Grid>
      </ModalTransactionCrud>
    </Card>
  );
}
