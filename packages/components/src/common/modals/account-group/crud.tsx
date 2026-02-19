'use client';

import React from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Modal } from '@mantine/core';
import FormAccountGroup from '../../../form/account-group';
import LayoutModal from '../../../layout/modal';
import { AccountGroupGet } from '@repo/types/models/account-group';

export default function Crud({
  props,
  children,
}: {
  props?: AccountGroupGet;
  children: React.ReactNode;
}) {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal opened={opened} onClose={close}>
        <LayoutModal
          props={{
            title: `${!props ? 'Create' : 'Edit'} Account Group`,
            close,
          }}
        >
          <FormAccountGroup props={{ defaultValues: props, close }} />
        </LayoutModal>
      </Modal>

      <span onClick={open}>{children}</span>
    </>
  );
}
