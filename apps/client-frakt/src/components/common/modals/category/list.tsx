'use client';

import React from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Divider, Modal, ScrollArea } from '@mantine/core';
import LayoutModal from '@/components/layout/modal';
import LayoutHeadersCategories from '@/components/layout/headers/categories';
import PartialCategory from '@/components/partial/page/app/categories';

export default function List({ children }: { children: React.ReactNode }) {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal opened={opened} onClose={close}>
        <LayoutModal title={``} close={close} options={{ padding: null }}>
          <LayoutHeadersCategories />

          <Divider />

          <ScrollArea h={320}>
            <PartialCategory />
          </ScrollArea>
        </LayoutModal>
      </Modal>

      <span onClick={open}>{children}</span>
    </>
  );
}
