'use client';

import { Button, Group, Modal, Stack, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import React from 'react';

export default function Prompt({
  props,
  children,
}: {
  props: {
    title?: string;
    color?: string;
    modalContent: React.ReactNode;
    parentModalstate?: { opened: boolean; close: () => void };
    actions?: { confirm?: () => void; cancel?: () => void };
    loading?: boolean;
    wrapperId?: string;
  };
  children: React.ReactNode;
}) {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal opened={opened} onClose={close} withCloseButton={false} centered>
        <Stack gap={'xl'}>
          <Stack gap={'xs'}>
            <Title order={1} fz={'md'}>
              {props.title}
            </Title>

            {props.modalContent}
          </Stack>

          <Group justify="end">
            <Button
              size="xs"
              color="gray"
              variant="light"
              disabled={props.loading}
              onClick={() => {
                if (props.actions?.cancel) {
                  props.actions?.cancel();
                }

                close();
              }}
            >
              Cancel
            </Button>

            <Button
              size="xs"
              color={props.color ?? undefined}
              loading={props.loading}
              onClick={() => {
                if (props.actions?.confirm) {
                  props.actions?.confirm();
                }

                close();
              }}
            >
              Confirm
            </Button>
          </Group>
        </Stack>
      </Modal>

      <div onClick={open} id={props.wrapperId || 'wrapperId'}>
        {children}
      </div>
    </>
  );
}
