'use client';

import React from 'react';
import {
  ActionIcon,
  Card,
  Group,
  NumberFormatter,
  Stack,
  Text,
  Title,
  Tooltip,
} from '@mantine/core';
import { CategoryGet } from '@repo/types/models/category';
import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
} from '@repo/constants/sizes';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import ModalCategoryCrud from '../modals/category/crud';
import ModalConfirm from '@repo/components/common/modals/confirm';
import { useCategoryActions } from '@repo/hooks/actions/category';
import { useStoreTransaction } from '@repo/libraries/zustand/stores/transaction';

export default function Category({ props }: { props: CategoryGet }) {
  const { categoryDelete } = useCategoryActions();

  const transactions = useStoreTransaction((s) => s.transactions);

  const groupAccounts = transactions?.filter((t) => t.category_id == props.id);

  let totalCategoryAmount = 0.0;

  groupAccounts?.map((ga) => {
    totalCategoryAmount += Number(ga.amount);
  });

  return (
    <Card radius={0} bg={'transparent'} padding={0} py={5}>
      <Group justify="space-between">
        <Stack gap={2}>
          <Title order={3} fz={'md'} fw={'normal'}>
            {props.title}
          </Title>

          <Group gap={5} pl={4}>
            <ModalCategoryCrud props={props}>
              <Group>
                <Tooltip label="Edit Category">
                  <ActionIcon size={ICON_WRAPPER_SIZE - 4} variant="subtle">
                    <IconEdit size={ICON_SIZE - 4} stroke={ICON_STROKE_WIDTH} />
                  </ActionIcon>
                </Tooltip>
              </Group>
            </ModalCategoryCrud>

            <Tooltip label="Delete Category">
              <ModalConfirm
                props={{
                  desc: `Category '${props.title}' and all transactions tied to it will be permanently deleted.`,
                  onConfirm: () => categoryDelete(props),
                }}
              >
                <Group>
                  <ActionIcon
                    size={ICON_WRAPPER_SIZE - 4}
                    variant="subtle"
                    color="red.6"
                  >
                    <IconTrash
                      size={ICON_SIZE - 4}
                      stroke={ICON_STROKE_WIDTH}
                    />
                  </ActionIcon>
                </Group>
              </ModalConfirm>
            </Tooltip>
          </Group>
        </Stack>

        <Stack gap={0} align="end" ta={'end'}>
          <Text inherit fz={'sm'} c={'dimmed'}>
            Accts:{' '}
            <Text
              component="span"
              inherit
              fz={'md'}
              c={'var(--mantine-color-text)'}
            >
              {groupAccounts?.length}
            </Text>
          </Text>

          <Text inherit fz={'sm'} c={'dimmed'}>
            Total:{' '}
            <Text
              component="span"
              inherit
              fz={'md'}
              c={
                totalCategoryAmount > 0
                  ? 'blue.6'
                  : totalCategoryAmount < 0
                    ? 'red.6'
                    : 'var(--mantine-color-text)'
              }
            >
              <NumberFormatter value={totalCategoryAmount.toFixed(2)} />
            </Text>
          </Text>
        </Stack>
      </Group>
    </Card>
  );
}
