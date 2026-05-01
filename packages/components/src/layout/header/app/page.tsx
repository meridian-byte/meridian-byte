'use client';

import React, { useMemo } from 'react';
import LayoutSection from '@repo/components/layout/section';
import { Box, Divider } from '@mantine/core';
import WrapperUnderlayGlass from '@repo/components/wrappers/underlays/glass';
import { useScroll } from '@repo/hooks/scroll';

export default function Page({ children }: { children: React.ReactNode }) {
  const { styles } = useScroll({
    threshold: 70,
    defaultStyles: useMemo(() => ({ opacity: 0 }), []),
    scrolledStyles: useMemo(() => ({ opacity: 1 }), []),
  });

  return (
    <Box pos={'sticky'} top={0} style={{ zIndex: 1 }}>
      <LayoutSection id={`note-details-header`} containerized={false}>
        <WrapperUnderlayGlass props={{ blur: 4, opacity: 0.8 }}>
          {children}
        </WrapperUnderlayGlass>
      </LayoutSection>

      <Box px={'xs'} style={{ ...styles, transition: '0.25s all ease' }}>
        <Divider />
      </Box>
    </Box>
  );
}
