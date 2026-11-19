import { Box, Stack } from '@mantine/core';

import { useBreakpointFlags } from '@repo/hooks';
import React from 'react';

export default function Navbar({
  options,
  children,
}: {
  options?: { folder?: boolean };
  children: React.ReactNode;
}) {
  const { ready, isMobile, isDesktop } = useBreakpointFlags();

  if (!ready) {
    // Must not render wrong layout before client knows viewport
    return null;
  }

  return (
    <Box pl={isDesktop || options?.folder ? (isDesktop ? 14 : 12 + 28 / 2) : undefined}>
      <Box
        style={
          isDesktop || options?.folder
            ? { borderLeft: '1px solid var(--mantine-color-default-border)' }
            : undefined
        }
        pl={isDesktop || options?.folder ? 4 : undefined}
      >
        {children}
      </Box>
    </Box>
  );
}
