'use client';

import React from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Button, Group, Modal, Text } from '@mantine/core';
import { LayoutModal } from '../layout/modal';
import { Alert, Variant } from '@repo/types';
import { useStoreActiveItems } from '@repo/store';
import { useNotification } from '@repo/hooks';

export type ConfirmProps = {
  title?: string;
  desc?: string;
  onCancel?: () => void;
  onConfirm?: () => void;
  variant?: Alert;
};

export function ModalConfirm({
  props,
  options,
  children,
}: {
  props?: ConfirmProps;
  options?: { global?: boolean };
  children: React.ReactNode;
}) {
  const [opened, { open, close }] = useDisclosure(false);

  const { showNotification } = useNotification();

  const activeConfirm: ConfirmProps | null = useStoreActiveItems((s) => s.activeItems?.confirm);
  const removeActiveConfirm = useStoreActiveItems((s) => s.removeActiveConfirm);

  const handleClose = () => {
    if (options?.global) {
      removeActiveConfirm();
    } else {
      close();
    }
  };

  const workingConfirm = options?.global && activeConfirm ? activeConfirm : props;

  return (
    <>
      <Modal
        opened={options?.global ? !!activeConfirm : opened}
        onClose={handleClose}
        pos={'relative'}
        withCloseButton={false}
      >
        <LayoutModal
          props={{
            title: workingConfirm?.title || 'Confirm Action',
            close: handleClose,
            variant: workingConfirm?.variant || Alert.WARNING,
          }}
        >
          <div>
            <Text>{workingConfirm?.desc || 'Are you sure you want to proceed?'}</Text>
          </div>

          <Group justify="end" mt={'md'}>
            <Button
              variant="default"
              onClick={() => {
                if (workingConfirm?.onCancel) workingConfirm.onCancel();
                showNotification({
                  title: 'Action Canceled',
                  desc: 'The action has beeen aborted.',
                  variant: Variant.WARNING,
                });
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
