'use client';

import React from 'react';
import { useDisclosure } from '@mantine/hooks';
import {
  Box,
  Button,
  Divider,
  Flex,
  Group,
  Modal,
  ScrollAreaAutosize,
} from '@mantine/core';
import FormTransaction from '@/components/form/transaction';
import LayoutModal from '@/components/layout/modal';
import { TransactionGet } from '@repo/types/models/transaction';
import { IconChevronDown, IconCopy, IconTrash } from '@tabler/icons-react';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@repo/constants/sizes';
import { useTransactionActions } from '@/hooks/actions/transaction';
import ModalConfirm from '@repo/components/common/modals/confirm';
import MenuCopy from '../../menus/copy';

export default function Crud({
  props,
  children,
}: {
  props?: TransactionGet;
  children: React.ReactNode;
}) {
  const [opened, { open, close }] = useDisclosure(false);

  const { transactionDelete, transactionCreate } = useTransactionActions();

  const copyTransaction = (params: {
    transaction: TransactionGet;
    currentDate?: boolean;
  }) => {
    const { currentDate } = params || {};
    const now = new Date();

    transactionCreate({
      ...params?.transaction,
      id: null as any,
      date: currentDate ? now.toISOString() : (params.transaction.date as any),
      created_at: currentDate
        ? now.toISOString()
        : (params.transaction.created_at as any),
      updated_at: currentDate
        ? now.toISOString()
        : (params.transaction.updated_at as any),
    });
  };

  return (
    <>
      <Modal opened={opened} onClose={close}>
        <LayoutModal
          title={`${!props ? 'Create' : 'Edit'} Transaction`}
          close={close}
          options={{ padding: null }}
        >
          <ScrollAreaAutosize mah={400} scrollbars={'y'}>
            <Box p={'sm'}>
              <FormTransaction props={{ defaultValues: props, close }} />
            </Box>
          </ScrollAreaAutosize>

          {props && (
            <Box px={'sm'} pb={'sm'}>
              <Divider mb={'md'} />

              <Flex
                gap={'md'}
                direction={{ base: 'column', xs: 'row' }}
                justify={{ xs: 'end' }}
              >
                <ModalConfirm
                  props={{
                    onConfirm: () => {
                      transactionDelete(props);
                      close();
                    },
                  }}
                >
                  <Button
                    variant="light"
                    color="red.6"
                    fullWidth
                    leftSection={
                      <IconTrash size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
                    }
                  >
                    Delete
                  </Button>
                </ModalConfirm>

                <Group gap={0} wrap="nowrap">
                  <Button
                    variant="light"
                    color="dark"
                    fullWidth
                    leftSection={
                      <IconCopy size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
                    }
                    style={{
                      borderTopRightRadius: 0,
                      borderBottomRightRadius: 0,
                    }}
                    onClick={() => {
                      copyTransaction({
                        transaction: props,
                        currentDate: true,
                      });
                      close();
                    }}
                  >
                    Copy
                  </Button>

                  <MenuCopy
                    props={{
                      transaction: props,
                      copyFunction: copyTransaction,
                      close,
                    }}
                  >
                    <Button
                      variant="light"
                      color="gray"
                      maw={'fit-content'}
                      style={{
                        borderTopLeftRadius: 0,
                        borderBottomLeftRadius: 0,
                      }}
                    >
                      <IconChevronDown
                        size={ICON_SIZE}
                        stroke={ICON_STROKE_WIDTH}
                      />
                    </Button>
                  </MenuCopy>
                </Group>
              </Flex>
            </Box>
          )}
        </LayoutModal>
      </Modal>

      <span onClick={open} style={{ width: '100%', height: '100%' }}>
        {children}
      </span>
    </>
  );
}
