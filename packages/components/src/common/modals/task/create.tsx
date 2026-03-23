'use client';

import React from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Modal } from '@mantine/core';
import { TaskGet } from '@repo/types/models/task';
import PartialTaskCreate from '../../../partial/task/create';
import { useFormTask } from '@repo/hooks/form/task';

export default function Create({
  props,
  children,
}: {
  props?: Partial<TaskGet>;
  children: React.ReactNode;
}) {
  const [opened, { open, close }] = useDisclosure(false);

  const { form, submitted, handleSubmit } = useFormTask({
    defaultValues: props,
  });

  const handleClose = () => {
    form.reset();
    close();
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={handleClose}
        size={'lg'}
        styles={{ content: { overflow: 'visible' } }}
        keepMounted={false}
      >
        <PartialTaskCreate
          props={{ form, submitted, handleSubmit, handleClose }}
        />
      </Modal>

      <span onClick={open} style={{ cursor: 'pointer' }}>
        {children}
      </span>
    </>
  );
}
