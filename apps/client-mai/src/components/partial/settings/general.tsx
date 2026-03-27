'use client';

import { Button, Divider, Group, Stack, Text } from '@mantine/core';
import React from 'react';
import SelectColorScheme from '@/components/common/selects/color-scheme';
import ModalSignOut from '@/components/common/modals/sign-out';
import ModalArchived from '@/components/common/modals/archived';
import { useAppSelector } from '@/hooks/redux';
import ModalConfirm from '@/components/common/modals/confirm';
import { useDisclosure } from '@mantine/hooks';
import { useFormChatArchive, useFormChatDelete } from '@/hooks/form/chat';

export default function General() {
  const chats = useAppSelector((state) => state.chats.value);
  const [archiveOpened, { open: archiveOpen, close: archiveClose }] =
    useDisclosure(false);
  const { submitted: archiveSubmitted, handleArchive } = useFormChatArchive();
  const [deleteOpened, { open: deleteOpen, close: deleteClose }] =
    useDisclosure(false);
  const { submitted: deleteSubmitted, handleDelete } = useFormChatDelete();

  if (!chats) return null;

  return (
    <Stack fz={'sm'} gap={'sm'}>
      <Group justify="space-between">
        <Text inherit>Theme</Text>

        <SelectColorScheme />
      </Group>

      <Divider />

      <Group justify="space-between">
        <Text inherit>Archived chats</Text>

        <ModalArchived>
          <Button
            variant="outline"
            size="xs"
            radius={'xl'}
            color="gray"
            c={'var(--mantine-color-text)'}
            fw={'bold'}
          >
            Manage
          </Button>
        </ModalArchived>
      </Group>

      <Divider />

      <Group justify="space-between">
        <Text inherit>Archive all chats</Text>

        <ModalConfirm
          opened={archiveOpened}
          open={archiveOpen}
          close={archiveClose}
          title="Archive chat history?"
          submitted={archiveSubmitted}
          onConfirm={async () => await handleArchive('archive', true)}
          target={
            <Button
              variant="outline"
              size="xs"
              radius={'xl'}
              color="gray"
              c={'var(--mantine-color-text)'}
              fw={'bold'}
            >
              Archive all
            </Button>
          }
        >
          <Text inherit>This will archive all your chats.</Text>
        </ModalConfirm>
      </Group>

      <Divider />

      <Group justify="space-between">
        <Text inherit>Delete all chats</Text>

        <ModalConfirm
          opened={deleteOpened}
          open={deleteOpen}
          close={deleteClose}
          title="Clear your chat history?"
          submitted={deleteSubmitted}
          onConfirm={async () => await handleDelete(true)}
          target={
            <Button
              size="xs"
              radius={'xl'}
              color="red.6"
              c={'var(--mantine-color-body)'}
              fw={'bold'}
            >
              Delete all
            </Button>
          }
        >
          <Text inherit>This will delete all your chats.</Text>
        </ModalConfirm>
      </Group>

      <Divider />

      <Group justify="space-between">
        <Text inherit>Log out of this device</Text>

        <ModalSignOut>
          <Button
            variant="outline"
            size="xs"
            radius={'xl'}
            color="gray"
            c={'var(--mantine-color-text)'}
            fw={'bold'}
          >
            Log out
          </Button>
        </ModalSignOut>
      </Group>
    </Stack>
  );
}
