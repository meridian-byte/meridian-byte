'use client';

import { Stack, Text, Transition } from '@mantine/core';
import { useEffect, useState } from 'react';
import SpinnerApp from '../spinners/app';

export default function Main() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => setMounted(true), 5000);
  }, []);

  return (
    <Stack align="center">
      <SpinnerApp />

      <Transition mounted={mounted}>
        {(styles) => (
          <div style={styles}>
            <Text inherit fz={'xs'} ta={'center'}>
              This is taking longer than expected
              <br />
              you might be on a slow network
            </Text>
          </div>
        )}
      </Transition>
    </Stack>
  );
}
