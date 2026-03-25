'use client';

import React from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Button, Group, Modal, Text } from '@mantine/core';
import LayoutModal from '../../layout/modal';
import { Alert } from '@repo/types/enums';
import { useStoreActiveItems } from '@repo/libraries/zustand/stores/active-items';

export type ConfirmProps = {
  title?: string;
  desc?: string;
  onCancel?: () => void;
  onConfirm?: () => void;
  variant?: Alert;
};

export default function Confirm({
  props,
  options,
  children,
}: {
  props?: ConfirmProps;
  options?: { global?: boolean };
  children: React.ReactNode;
}) {
  const [opened, { open, close }] = useDisclosure(false);

  const activeConfirm: ConfirmProps | null = useStoreActiveItems(
    (s) => s.activeItems?.confirm
  );
  const removeActiveConfirm = useStoreActiveItems((s) => s.removeActiveConfirm);

  const handleClose = () => {
    if (options?.global) {
      removeActiveConfirm();
    } else {
      close();
    }
  };

  const workingConfirm =
    options?.global && activeConfirm ? activeConfirm : props;

  return (
    <>
      <Modal
        opened={options?.global ? !!activeConfirm : opened}
        onClose={handleClose}
        pos={'relative'}
      >
        <LayoutModal
          props={{
            title: workingConfirm?.title || 'Confirm Action',
            close: handleClose,
          }}
          variant={workingConfirm?.variant || Alert.WARNING}
        >
          <div>
            <Text>
              {workingConfirm?.desc || 'Are you sure you want to proceed?'}
            </Text>
          </div>

          <Group justify="end" mt={'md'}>
            <Button
              color="dark"
              variant="light"
              onClick={() => {
                if (workingConfirm?.onCancel) workingConfirm.onCancel();
                handleClose();
              }}
            >
              Cancel
            </Button>

            <Button
              onClick={() => {
                if (workingConfirm?.onConfirm) workingConfirm.onConfirm();
                handleClose();
              }}
            >
              Confirm
            </Button>
          </Group>
        </LayoutModal>
      </Modal>

      <span onClick={open}>{children}</span>
    </>
  );
}
