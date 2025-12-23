'use client';

import React from 'react';
import { SECTION_SPACING } from '@repo/constants/sizes';
import { Container } from '@mantine/core';

export default function Home() {
  return (
    <Container py={SECTION_SPACING / 2}>
      <div>home</div>
    </Container>
  );
}
