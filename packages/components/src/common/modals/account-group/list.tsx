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
    headerAccountGroups: React.ReactNode;
    partialAccountGroups: React.ReactNode;
  };
  children: React.ReactNode;
}) {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal opened={opened} onClose={close}>
        <LayoutModal props={{ title: ``, close }}>
          {props.headerAccountGroups}

          <Divider />

          <ScrollArea h={320}>{props.partialAccountGroups}</ScrollArea>
        </LayoutModal>
      </Modal>

      <span onClick={open}>{children}</span>
    </>
  );
}
