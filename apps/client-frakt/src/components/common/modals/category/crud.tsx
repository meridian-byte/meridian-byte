'use client';

import React from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Modal } from '@mantine/core';
import FormCategory from '@/components/form/category';
import LayoutModal from '@/components/layout/modal';
import { CategoryGet } from '@repo/types/models/category';

export default function Crud({
  props,
  children,
}: {
  props?: CategoryGet;
  children: React.ReactNode;
}) {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal opened={opened} onClose={close}>
        <LayoutModal
          title={`${!props ? 'Create' : 'Edit'} Category`}
          close={close}
        >
          <FormCategory props={{ defaultValues: props, close }} />
        </LayoutModal>
      </Modal>

      <span onClick={open}>{children}</span>
    </>
  );
}
