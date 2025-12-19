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
import FormMeal from '@/components/form/meal';
import LayoutModal from '@/components/layout/modal';
import { MealGet } from '@repo/types/models/meal';
import { IconTrash } from '@tabler/icons-react';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@repo/constants/sizes';
import { useMealActions } from '@/hooks/actions/meal';
import ModalConfirm from '@repo/components/common/modals/confirm';

export default function Crud({
  props,
  children,
}: {
  props?: MealGet;
  children: React.ReactNode;
}) {
  const [opened, { open, close }] = useDisclosure(false);

  const { mealDelete } = useMealActions();

  return (
    <>
      <Modal opened={opened} onClose={close}>
        <LayoutModal
          title={`${!props ? 'Create' : 'Edit'} Meal`}
          close={close}
          options={{ padding: null }}
        >
          <ScrollAreaAutosize mah={400} scrollbars={'y'}>
            <Box p={'sm'}>
              <FormMeal props={{ defaultValues: props, close }} />
            </Box>
          </ScrollAreaAutosize>

          {props && (
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
                      mealDelete(props);
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
