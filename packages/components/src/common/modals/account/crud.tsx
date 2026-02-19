'use client';

import React from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Box, Modal, ScrollAreaAutosize } from '@mantine/core';
import FormAccount from '../../../form/account';
import LayoutModal from '../../../layout/modal';
import { AccountGet } from '@repo/types/models/account';

export default function Crud({
  props,
  children,
}: {
  props?: AccountGet;
  children: React.ReactNode;
}) {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal opened={opened} onClose={close}>
        <LayoutModal
          props={{ title: `${!props ? 'Create' : 'Edit'} Account`, close }}
        >
          <ScrollAreaAutosize mah={400} scrollbars={'y'}>
            <Box p={'sm'}>
              <FormAccount props={{ defaultValues: props, close }} />
            </Box>
          </ScrollAreaAutosize>
        </LayoutModal>
      </Modal>

      <span onClick={open}>{children}</span>
    </>
  );
}
