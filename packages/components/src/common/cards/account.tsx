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
import { AccountGet } from '@repo/types/models/account';
import { capitalizeWords } from '@repo/utilities/string';
import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
} from '@repo/constants/sizes';
import { IconChartDots, IconEdit, IconTrash } from '@tabler/icons-react';
import ModalAccountCrud from '../modals/account/crud';
import ModalConfirm from '@repo/components/common/modals/confirm';
import { useAccountActions } from '@repo/hooks/actions/account';

export default function Account({ props }: { props: AccountGet }) {
  const { accountDelete } = useAccountActions();

  return (
    <Card radius={0} bg={'transparent'} padding={0} py={5}>
      <Group justify="space-between">
        <Stack gap={2}>
          <Title order={3} fz={'md'} fw={'normal'}>
            {props.name}
          </Title>

          <Group gap={5} pl={4}>
            <ModalAccountCrud props={props}>
              <Group>
                <Tooltip label="Edit Account">
                  <ActionIcon size={ICON_WRAPPER_SIZE - 4} variant="subtle">
                    <IconEdit size={ICON_SIZE - 4} stroke={ICON_STROKE_WIDTH} />
                  </ActionIcon>
                </Tooltip>
              </Group>
            </ModalAccountCrud>

            <Tooltip label="Account Statements">
              <ActionIcon size={ICON_WRAPPER_SIZE - 4} variant="subtle">
                <IconChartDots
                  size={ICON_SIZE - 4}
                  stroke={ICON_STROKE_WIDTH}
                />
              </ActionIcon>
            </Tooltip>

            <Tooltip label="Delete Account">
              <ModalConfirm
                props={{
                  desc: `Account '${props.name}' and all transactions tied to it will be permanently deleted.`,
                  onConfirm: () => accountDelete(props),
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
          {props.currency_code && (
            <Text inherit fz={'sm'} c={'dimmed'}>
              {capitalizeWords(props.currency_code)}.
            </Text>
          )}

          <Text
            inherit
            fw={500}
            c={
              Number(props.balance) > 0
                ? 'blue.6'
                : Number(props.balance) < 0
                  ? 'red.6'
                  : undefined
            }
          >
            <NumberFormatter value={props.balance.toString()} />
          </Text>
        </Stack>
      </Group>
    </Card>
  );
}
