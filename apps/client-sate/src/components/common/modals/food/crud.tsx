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
import FormFood from '@/components/form/food';
import LayoutModal from '@/components/layout/modal';
import { FoodGet } from '@repo/types/models/food';
import { IconTrash } from '@tabler/icons-react';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@repo/constants/sizes';
import { useFoodActions } from '@/hooks/actions/food';
import ModalConfirm from '@repo/components/common/modals/confirm';

export default function Crud({
  props,
  children,
}: {
  props?: FoodGet;
  children: React.ReactNode;
}) {
  const [opened, { open, close }] = useDisclosure(false);

  const { foodDelete } = useFoodActions();

  return (
    <>
      <Modal opened={opened} onClose={close}>
        <LayoutModal
          title={`${!props?.created_at ? 'Create' : 'Edit'} Food`}
          close={close}
          options={{ padding: null }}
        >
          <ScrollAreaAutosize mah={400} scrollbars={'y'}>
            <Box p={'sm'}>
              <FormFood props={{ defaultValues: props, close }} />
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
                      foodDelete(props);
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
