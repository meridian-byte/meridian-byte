'use client';

import React from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Box, Modal } from '@mantine/core';
import TabsUser from '../tabs/user';
import { useStoreSession } from '@repo/store';

export default function User({ children }: { children: React.ReactNode }) {
  const session = useStoreSession((s) => s.session);
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal
        opened={!!session && !!session.accounts[0].email && opened}
        onClose={close}
        withCloseButton={false}
        size={'lg'}
        padding={0}
      >
        <TabsUser props={{ close }} />
      </Modal>

      <span onClick={open}>{children}</span>
    </>
  );
}
