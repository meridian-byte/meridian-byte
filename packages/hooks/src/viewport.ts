'use client';

import { useEffect, useState } from 'react';
import { useMediaQuery } from '@mantine/hooks';

export interface BreakpointFlags {
  /** True once client matchMedia has run and values are real, not pre-hydration fallbacks */
  ready: boolean;
  /** Viewport <= 36em */
  isMobile: boolean;
  /** Viewport > 36em and < 62em */
  isTablet: boolean;
  /** Viewport >= 62em */
  isDesktop: boolean;
}

export function useBreakpointFlags(): BreakpointFlags {
  const [ready, setReady] = useState(false);

  // Aligns with Mantine's default xs (36em) and md (62em) boundaries
  const isDesktop = useMediaQuery('(min-width: 62em)', false, {
    getInitialValueInEffect: true,
  });
  const isMobile = useMediaQuery('(max-width: 36em)', false, {
    getInitialValueInEffect: true,
  });

  useEffect(() => {
    setReady(true);
  }, []);

  const resolvedMobile = ready ? Boolean(isMobile) : false;
  const resolvedDesktop = ready ? Boolean(isDesktop) : false;
  const resolvedTablet = ready ? !resolvedMobile && !resolvedDesktop : false;

  return {
    ready,
    isMobile: resolvedMobile,
    isTablet: resolvedTablet,
    isDesktop: resolvedDesktop,
  };
}
