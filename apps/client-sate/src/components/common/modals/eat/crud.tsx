'use client';

import React, { useRef } from 'react';
import { useDisclosure } from '@mantine/hooks';
import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Loader,
  Modal,
  ScrollAreaAutosize,
  Stack,
  Text,
} from '@mantine/core';
import FormEat from '@/components/form/eat';
import LayoutModal from '@/components/layout/modal';
import { EatGet } from '@repo/types/models/eat';
import { IconTrash } from '@tabler/icons-react';
import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  SECTION_SPACING,
} from '@repo/constants/sizes';
import { useEatActions } from '@/hooks/actions/eat';
import ModalConfirm from '@repo/components/common/modals/confirm';
import { useStoreServing } from '@/libraries/zustand/stores/serving';
import { Order } from '@repo/types/enums';
import { sortArray } from '@repo/utilities/array';
import CardServing from '../../cards/serving';
import { useFormEat } from '@/hooks/form/eat';
import { generateUUID } from '@repo/utilities/generators';

export default function Crud({
  props,
  children,
}: {
  props?: Partial<EatGet>;
  children: React.ReactNode;
}) {
  const { servings } = useStoreServing();

  const [opened, { open, close }] = useDisclosure(false);

  const { eatDelete } = useEatActions();

  const eatId = useRef<string>(generateUUID());

  const { form, submitted, handleSubmit } = useFormEat({
    defaultValues: { ...props, id: eatId.current },
  });

  const eatenServings = form.values.servings;

  const handleClose = () => {
    eatId.current = generateUUID();
    form.setFieldValue('servings', []);
    form.reset();
    close();
  };

  return (
    <>
      <Modal opened={opened} onClose={handleClose}>
        <LayoutModal
          title={`${!props?.created_at ? 'Create' : 'Edit'} Entry`}
          close={handleClose}
          options={{ padding: 'xs' }}
        >
          <ScrollAreaAutosize h={160} scrollbars={'y'}>
            <Box>
              {servings === undefined ? (
                <Center py={SECTION_SPACING / 2}>
                  <Loader />
                </Center>
              ) : !eatenServings?.length ? (
                <Center py={SECTION_SPACING / 2}>
                  <Text fz={'sm'} c={'dimmed'} ta={'center'}>
                    No foods added yet.
                  </Text>
                </Center>
              ) : (
                <Stack gap={0}>
                  {sortArray(
                    eatenServings,
                    (i) => new Date(i.updated_at),
                    Order.DESCENDING
                  ).map((s, i) => (
                    <Stack gap={0} key={s.id}>
                      {i > 0 && <Divider />}

                      {/* <ModalServingCrud props={s} options={{ meal: true }}> */}
                      <CardServing props={s} />
                      {/* </ModalServingCrud> */}
                    </Stack>
                  ))}
                </Stack>
              )}
            </Box>
          </ScrollAreaAutosize>

          <Divider mb={'xs'} />

          <FormEat
            props={{
              form,
              submitted,
              handleSubmit,
              close: handleClose,
              diaryDate: props?.created_at as any,
            }}
          />

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
                        eatDelete(props as EatGet);
                        handleClose();
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
