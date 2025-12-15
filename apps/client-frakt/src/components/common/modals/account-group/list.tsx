'use client';

import React from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Divider, Modal, ScrollArea } from '@mantine/core';
import LayoutModal from '@/components/layout/modal';
import LayoutHeadersAccountGroups from '@/components/layout/headers/accounts-groups';
import PartialAccountGroup from '@/components/partial/page/app/account-groups';

export default function List({ children }: { children: React.ReactNode }) {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal opened={opened} onClose={close}>
        <LayoutModal title={``} close={close} options={{ padding: null }}>
          <LayoutHeadersAccountGroups />

          <Divider />

          <ScrollArea h={320}>
            <PartialAccountGroup />
          </ScrollArea>
        </LayoutModal>
      </Modal>

      <span onClick={open}>{children}</span>
    </>
  );
}
