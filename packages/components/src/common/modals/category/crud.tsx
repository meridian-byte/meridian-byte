'use client';

import React from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Modal } from '@mantine/core';
import FormCategory from '../../../form/category';
import LayoutModal from '../../../layout/modal';
import { CategoryGet } from '@repo/types/models/category';

export default function Crud({
  props,
  source,
  children,
}: {
  props?: CategoryGet;
  source: string;
  children: React.ReactNode;
}) {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal opened={opened} onClose={close}>
        <LayoutModal
          props={{ title: `${!props ? 'Create' : 'Edit'} Project`, close }}
        >
          <FormCategory props={{ defaultValues: props, close, source }} />
        </LayoutModal>
      </Modal>

      <span onClick={open}>{children}</span>
    </>
  );
}
