'use client';

import React from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Box, Modal } from '@mantine/core';
import TabsUser from '../tabs/user';

export default function User({ children }: { children: React.ReactNode }) {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        withCloseButton={false}
        size={'lg'}
      >
        <TabsUser props={{ close }} />
      </Modal>

      <span onClick={open}>{children}</span>
    </>
  );
}
