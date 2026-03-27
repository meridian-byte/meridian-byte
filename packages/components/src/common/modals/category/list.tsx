'use client';

import React from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Divider, Modal, ScrollArea } from '@mantine/core';
import LayoutModal from '../../../layout/modal';

export default function List({
  props,
  children,
}: {
  props: {
    headerCategory: React.ReactNode;
    partialCategory: React.ReactNode;
  };
  children: React.ReactNode;
}) {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal opened={opened} onClose={close}>
        <LayoutModal props={{ title: ``, close }}>
          {props.headerCategory}

          <Divider />

          <ScrollArea h={320}>{props.partialCategory}</ScrollArea>
        </LayoutModal>
      </Modal>

      <span onClick={open}>{children}</span>
    </>
  );
}
