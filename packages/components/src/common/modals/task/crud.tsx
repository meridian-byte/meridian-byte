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
import FormTask from '../../../form/task';
import LayoutModal from '../../../layout/modal';
import { TaskGet } from '@repo/types/models/task';
import { IconTrash } from '@tabler/icons-react';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@repo/constants/sizes';
import { useTaskActions } from '@repo/hooks/actions/task';
import ModalConfirm from '@repo/components/common/modals/confirm';

export default function Crud({
  props,
  children,
}: {
  props?: Partial<TaskGet>;
  children: React.ReactNode;
}) {
  const [opened, { open, close }] = useDisclosure(false);

  const { taskDelete } = useTaskActions();

  return (
    <>
      <Modal opened={opened} onClose={close}>
        <LayoutModal
          props={{
            title: `${!props?.updated_at ? 'Add' : 'Edit'} Task`,
            close,
          }}
        >
          <ScrollAreaAutosize mah={400} scrollbars={'y'}>
            <Box p={'sm'}>
              <FormTask props={{ defaultValues: props, close }} />
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
                      if (props) taskDelete(props as TaskGet);
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
