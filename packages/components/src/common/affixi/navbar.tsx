'use client';

import React from 'react';
import { Affix, Transition } from '@mantine/core';
import { useHeadroom, useWindowScroll } from '@mantine/hooks';

export default function Navbar({ children }: { children?: React.ReactNode }) {
  const [scroll] = useWindowScroll();
  const pinned = useHeadroom({ fixedAt: 120 });

  return (
    <Affix position={{ left: 0, top: 0, right: 0 }}>
      <Transition transition={'slide-down'} mounted={scroll.y > 120 && pinned}>
        {(styles) => (
          <div style={styles}>{children || 'nav component goes here'}</div>
        )}
      </Transition>
    </Affix>
  );
}
