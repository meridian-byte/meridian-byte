import { Box, Stack } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import React from 'react';

export default function Navbar({
  options,
  children,
}: {
  options?: { folder?: boolean };
  children: React.ReactNode;
}) {
  const desktop = useMediaQuery('(min-width: 62em)');

  return (
    <Box pl={desktop || options?.folder ? (desktop ? 14 : 12 + 28 / 2) : undefined}>
      <Box
        style={
          desktop || options?.folder
            ? { borderLeft: '1px solid var(--mantine-color-default-border)' }
            : undefined
        }
        pl={desktop || options?.folder ? 4 : undefined}
      >
        {children}
      </Box>
    </Box>
  );
}
