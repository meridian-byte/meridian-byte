import { Box, Stack } from '@mantine/core';
import React from 'react';

export default function Navbar({ children }: { children: React.ReactNode }) {
  return (
    <Box pl={14}>
      <Box style={{ borderLeft: '1px solid var(--mantine-color-default-border)' }} pl={4}>
        {children}
      </Box>
    </Box>
  );
}
