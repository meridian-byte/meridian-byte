'use client';

import React from 'react';
import {
  Button,
  Divider,
  Group,
  Modal,
  Paper,
  TextInput,
  Title,
} from '@mantine/core';
import { useFormChat } from '@repo/hooks/form/chat';

export default function Edit({
  chatId,
  children,
  title,
  modalOpened,
  setModalOpened,
}: {
  chatId?: string;
  children: React.ReactNode;
  title: string;
  modalOpened: boolean;
  setModalOpened: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { form, handleSubmit, submitted } = useFormChat({
    defaultValues: { id: chatId },
  });

  return (
    <>
      <Modal
        opened={modalOpened}
        onClose={() => {
          setModalOpened(false);
          form.reset();
        }}
        shadow="none"
        padding={0}
      >
        <Paper>
          <Paper p={'lg'}>
            <Title order={1} fz={'lg'}>
              {title}
            </Title>
          </Paper>

          <Divider />

          <Paper p={'lg'} fz={'sm'}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
                if (form.isValid()) setModalOpened(false);
              }}
            >
              <TextInput
                placeholder="Chat title"
                key={form.key('title')}
                {...form.getInputProps('title')}
              />
            </form>
          </Paper>

          <Paper p={'lg'} pt={0}>
            <Group justify="end">
              <Button
                color="gray"
                variant="outline"
                c={'var(--mantine-color-text)'}
                radius={'xl'}
                onClick={() => {
                  if (form.isDirty()) form.reset();
                  setModalOpened(false);
                }}
              >
                Cancel
              </Button>

              <Button
                radius={'xl'}
                onClick={() => {
                  handleSubmit();
                  if (form.isValid()) setModalOpened(false);
                }}
                loading={submitted}
              >
                Done
              </Button>
            </Group>
          </Paper>
        </Paper>
      </Modal>

      <div onClick={() => setModalOpened(true)}>{children}</div>
    </>
  );
}
