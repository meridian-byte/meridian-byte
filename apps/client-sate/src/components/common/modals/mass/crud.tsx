'use client';

import React from 'react';
import { useDisclosure } from '@mantine/hooks';
import {
  Box,
  Button,
  Divider,
  Flex,
  Modal,
  ScrollAreaAutosize,
} from '@mantine/core';
import FormMass from '@/components/form/mass';
import LayoutModal from '@/components/layout/modal';
import { MassGet } from '@repo/types/models/mass';
import { IconTrash } from '@tabler/icons-react';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@repo/constants/sizes';
import { useMassActions } from '@/hooks/actions/mass';
import ModalConfirm from '@repo/components/common/modals/confirm';

export default function Crud({
  props,
  children,
}: {
  props?: MassGet;
  children: React.ReactNode;
}) {
  const [opened, { open, close }] = useDisclosure(false);

  const { massDelete } = useMassActions();

  return (
    <>
      <Modal opened={opened} onClose={close}>
        <LayoutModal
          title={`${!props?.created_at ? 'Create' : 'Edit'} Mass`}
          close={close}
          options={{ padding: null }}
        >
          <ScrollAreaAutosize mah={400} scrollbars={'y'}>
            <Box p={'sm'}>
              <FormMass props={{ defaultValues: props, close }} />
            </Box>
          </ScrollAreaAutosize>

          {props?.updated_at && (
            <Box px={'sm'} pb={'sm'}>
              <Divider mb={'md'} />

              <Flex
                gap={'md'}
                direction={{ base: 'column', xs: 'row' }}
                justify={{ xs: 'end' }}
              >
                <ModalConfirm
                  props={{
                    onConfirm: () => {
                      massDelete(props);
                      close();
                    },
                  }}
                >
                  <Button
                    variant="light"
                    color="red.6"
                    fullWidth
                    leftSection={
                      <IconTrash size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
                    }
                  >
                    Delete
                  </Button>
                </ModalConfirm>
              </Flex>
            </Box>
          )}
        </LayoutModal>
      </Modal>

      <span onClick={open} style={{ cursor: 'pointer' }}>
        {children}
      </span>
    </>
  );
}
