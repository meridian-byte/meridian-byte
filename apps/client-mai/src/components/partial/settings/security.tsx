import { Button, Divider, Group, Stack, Text } from '@mantine/core';
import React from 'react';

export default function Security() {
  return (
    <Stack fz={'sm'} gap={'lg'}>
      <Group justify="space-between" wrap="nowrap" align="start">
        <Stack gap={'xs'} w={'75%'}>
          <Text inherit>Multi-factor authentication</Text>

          <Text inherit fz={'xs'} c={'dimmed'}>
            Require an extra security challenge when logging in. If you are
            unable to pass this challenge, you will have the option to recover
            your account via email.
          </Text>
        </Stack>

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

      <Group justify="space-between" wrap="nowrap" align="start">
        <Stack gap={'xs'} w={'75%'}>
          <Text inherit>Log out of all devices</Text>

          <Text inherit fz={'xs'} c={'dimmed'}>
            Log out of all active sessions across all devices, including your
            current session. It may take up to 30 minutes for other devices to
            be logged out.
          </Text>
        </Stack>

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
      </Group>
    </Stack>
  );
}
