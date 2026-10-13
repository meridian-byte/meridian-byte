'use client';

import React, { useState } from 'react';
import { Button, Group, PinInput, Stack } from '@mantine/core';
import { getFromLocalStorage, saveToLocalStorage } from '@repo/utils';
import { STORAGE_NAME } from '@repo/constants';
import { useNotification } from '@repo/hooks';
import { SessionCookie, Variant } from '@repo/types';

export default function AuthPin({
  authPin,
  serverSession,
  children,
}: {
  authPin: string;
  serverSession: SessionCookie | null;
  children: React.ReactNode;
}) {
  const { showNotification } = useNotification();

  const [pin, setPin] = useState('');

  const handleSave = () => {
    const isMatch = pin == authPin;

    if (isMatch) {
      saveToLocalStorage(STORAGE_NAME.AUTH.LOCAL_PIN, authPin);
    } else {
      showNotification({
        variant: Variant.FAILED,
        title: 'Authentication Failure',
        desc: 'You have entered an incorrect pin.',
      });
    }

    setPin('');
  };

  if (!serverSession) {
    const localPin = getFromLocalStorage(STORAGE_NAME.AUTH.LOCAL_PIN);

    if (!localPin) {
      return (
        <Stack mih={'100vh'} justify="center">
          <Group justify="center">
            <PinInput value={pin} onChange={setPin} />
          </Group>

          <Group justify="center">
            <Button onClick={handleSave}>Verify</Button>
          </Group>
        </Stack>
      );
    } else {
      return children;
    }
  } else {
    return children;
  }
}
