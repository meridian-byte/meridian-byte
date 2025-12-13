'use client';

import React from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Button, Group, Modal, Text } from '@mantine/core';
import LayoutModal from '../../layout/modal';
import { Alert } from '@repo/types/enums';

export default function Confirm({
  props,
  children,
}: {
  props?: {
    title?: string;
    desc?: string;
    onCancel?: () => void;
    onConfirm?: () => void;
  };
  children: React.ReactNode;
}) {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal opened={opened} onClose={close} padding={'md'} pos={'relative'}>
        <LayoutModal
          props={{ title: props?.title || 'Confirm Action', close }}
          variant={Alert.WARNING}
        >
          <div>
            <Text>{props?.desc || 'Are you sure you want to proceed?'}</Text>
          </div>

          <Group justify="end" mt={'md'}>
            <Button color="red.6" variant="outline" onClick={props?.onCancel}>
              Cancel
            </Button>

            <Button onClick={props?.onConfirm}>Confirm</Button>
          </Group>
        </LayoutModal>
      </Modal>

      <span onClick={open}>{children}</span>
    </>
  );
}
