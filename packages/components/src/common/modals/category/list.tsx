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
    headerCategories: React.ReactNode;
    partialCategories: React.ReactNode;
  };
  children: React.ReactNode;
}) {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal opened={opened} onClose={close}>
        <LayoutModal props={{ title: ``, close }}>
          {props.headerCategories}

          <Divider />

          <ScrollArea h={320}>{props.partialCategories}</ScrollArea>
        </LayoutModal>
      </Modal>

      <span onClick={open}>{children}</span>
    </>
  );
}
