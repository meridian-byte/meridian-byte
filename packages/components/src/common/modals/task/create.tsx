'use client';

import React from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Modal } from '@mantine/core';
import { TaskGet } from '@repo/types/models/task';
import PartialTaskCreate from '../../../partial/task/create';

export default function Create({
  props,
  children,
}: {
  props?: Partial<TaskGet>;
  children: React.ReactNode;
}) {
  const [opened, { open, close }] = useDisclosure(false);

  const handleClose = () => {
    close();
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={handleClose}
        size={'lg'}
        styles={{ content: { overflow: 'visible' } }}
      >
        <PartialTaskCreate props={{ defaultValues: props, handleClose }} />
      </Modal>

      <span onClick={open} style={{ cursor: 'pointer' }}>
        {children}
      </span>
    </>
  );
}
