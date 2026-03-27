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
import { AccountGroupGet } from '@repo/types/models/account-group';
import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
} from '@repo/constants/sizes';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import ModalAccountGroupCrud from '../modals/account-group/crud';
import ModalConfirm from '@repo/components/common/modals/confirm';
import { useAccountGroupActions } from '@/hooks/actions/account-group';
import { useStoreAccount } from '@repo/libraries/zustand/stores/account';

export default function AccountGroup({ props }: { props: AccountGroupGet }) {
  const { accountGroupDelete } = useAccountGroupActions();

  const { accounts } = useStoreAccount();

  const groupAccounts = accounts?.filter((acc) => acc.group_id == props.id);

  let groupAccountsTotal = 0.0;

  groupAccounts?.map((ga) => {
    groupAccountsTotal += Number(ga.balance);
  });

  return (
    <Card radius={0} bg={'transparent'} padding={0} py={5}>
      <Group justify="space-between">
        <Stack gap={2}>
          <Title order={3} fz={'md'} fw={'normal'}>
            {props.name}
          </Title>

          <Group gap={5} pl={4}>
            <ModalAccountGroupCrud props={props}>
              <Group>
                <Tooltip label="Edit Account Group">
                  <ActionIcon size={ICON_WRAPPER_SIZE - 4} variant="subtle">
                    <IconEdit size={ICON_SIZE - 4} stroke={ICON_STROKE_WIDTH} />
                  </ActionIcon>
                </Tooltip>
              </Group>
            </ModalAccountGroupCrud>

            <Tooltip label="Delete Account Group">
              <ModalConfirm
                props={{
                  desc: `Account group '${props.name}' and all accounts tied to it will be permanently deleted.`,
                  onConfirm: () => accountGroupDelete(props),
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
                groupAccountsTotal > 0
                  ? 'blue.6'
                  : groupAccountsTotal < 0
                    ? 'red.6'
                    : 'var(--mantine-color-text)'
              }
            >
              <NumberFormatter value={groupAccountsTotal.toFixed(2)} />
            </Text>
          </Text>
        </Stack>
      </Group>
    </Card>
  );
}
