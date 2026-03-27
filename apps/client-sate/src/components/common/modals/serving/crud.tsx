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
import FormServing from '@/components/form/serving';
import LayoutModal from '@/components/layout/modal';
import { ServingGet } from '@repo/types/models/serving';
import { IconTrash } from '@tabler/icons-react';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@repo/constants/sizes';
import { useServingActions } from '@/hooks/actions/serving';
import ModalConfirm from '@repo/components/common/modals/confirm';
import { FormEat } from '@/hooks/form/eat';

export default function Crud({
  props,
  options,
  formEat,
  children,
}: {
  props?: Partial<ServingGet>;
  options?: { meal?: boolean };
  formEat?: FormEat;
  children: React.ReactNode;
}) {
  const [opened, { open, close }] = useDisclosure(false);

  const { servingDelete } = useServingActions();

  return (
    <>
      <Modal opened={opened} onClose={close}>
        <LayoutModal
          title={`${!props?.created_at ? 'Create' : 'Edit'} Serving`}
          close={close}
          options={{ padding: null }}
        >
          <ScrollAreaAutosize mah={400} scrollbars={'y'}>
            <Box p={'sm'}>
              <FormServing
                props={{ defaultValues: props, options, close, formEat }}
              />
            </Box>
          </ScrollAreaAutosize>

          {props?.created_at && (
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
                      if (props.created_at) {
                        servingDelete(props as ServingGet);
                        close();
                      }
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
