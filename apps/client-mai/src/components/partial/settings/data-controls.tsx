import { Button, Divider, Group, Stack, Text } from '@mantine/core';
import React from 'react';

export default function DataControls() {
  return (
    <Stack fz={'sm'} gap={'sm'}>
      <Group justify="space-between">
        <Text inherit>Shared links</Text>

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
      </Group>

      <Divider />

      <Group justify="space-between">
        <Text inherit>Export data</Text>

        <Button
          variant="outline"
          size="xs"
          radius={'xl'}
          color="gray"
          c={'var(--mantine-color-text)'}
          fw={'bold'}
        >
          Export
        </Button>
      </Group>

      <Divider />

      <Group justify="space-between">
        <Text inherit>Delete account</Text>

        <Button
          size="xs"
          radius={'xl'}
          color="red.6"
          c={'var(--mantine-color-body)'}
          fw={'bold'}
        >
          Delete
        </Button>
      </Group>
    </Stack>
  );
}
