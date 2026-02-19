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
import FormServing from '../../../form/serving';
import LayoutModal from '../../../layout/modal';
import { ServingGet } from '@repo/types/models/serving';
import { IconTrash } from '@tabler/icons-react';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@repo/constants/sizes';
import { useServingActions } from '@repo/hooks/actions/serving';
import { FormEat } from '@repo/hooks/form/eat';
import ModalConfirm from '@repo/components/common/modals/confirm';

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

  const now = new Date();
  const inputDate = new Date(props?.created_at || now);

  // retain day and date but update to current time
  const computedDate = new Date(
    inputDate.getFullYear(),
    inputDate.getMonth(),
    inputDate.getDate(),
    now.getHours(),
    now.getMinutes(),
    now.getSeconds()
  );

  return (
    <>
      <Modal opened={opened} onClose={close}>
        <LayoutModal
          props={{
            title: `${!props?.updated_at ? 'Add' : 'Edit'} Serving`,
            close,
          }}
        >
          <ScrollAreaAutosize mah={400} scrollbars={'y'}>
            <Box p={'sm'}>
              <FormServing
                props={{
                  defaultValues: {
                    ...props,
                    created_at: props?.updated_at
                      ? props.created_at
                      : computedDate,
                  },
                  options,
                  close,
                  formEat,
                }}
              />
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
                      if (props.updated_at) {
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
