'use client';

import { Button, Group } from '@mantine/core';

export function ButtonConfirmCancel({
  options,
}: {
  options: { onConfirm: () => void; onCancel: () => void };
}) {
  return (
    <Group>
      <Button color="gray" variant="light" onClick={options.onCancel}>
        Cancel
      </Button>

      <Button onClick={options.onConfirm}>Confirm</Button>
    </Group>
  );
}
