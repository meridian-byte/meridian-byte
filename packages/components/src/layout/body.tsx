/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import React, { useMemo } from 'react';
import { Box, Divider, Flex } from '@mantine/core';
import { BodyProps, Widths } from '@repo/types/layout';
import LayoutSection from './section';

export const DEFAULT_ASIDE_WIDTH = { md: 33, lg: 25 };

export default function Body({
  children,
  bar,
  header,
  nav,
  hero,
  aside,
  footer,
}: BodyProps) {
  const renderAside = (
    side: React.ReactNode,
    width?: Widths
  ): React.ReactNode => (
    <Box
      component="aside"
      visibleFrom="md"
      w={{
        md: `${width?.md ?? DEFAULT_ASIDE_WIDTH.md}%`,
        lg: `${width?.lg ?? DEFAULT_ASIDE_WIDTH.lg}%`,
      }}
    >
      {side}
    </Box>
  );

  const widthMain = useMemo(() => {
    const leftMd = aside?.left?.width?.md ?? 0;
    const rightMd = aside?.right?.width?.md ?? 0;
    const leftLg = aside?.left?.width?.lg ?? 0;
    const rightLg = aside?.right?.width?.lg ?? 0;

    return {
      md: 100 - (leftMd + rightMd),
      lg: 100 - (leftLg + rightLg),
    };
  }, [aside?.left?.width, aside?.right?.width]);

  return (
    <>
      {bar}
      {header}
      {nav}
      {hero}

      {aside ? (
        <LayoutSection
          id="layout-body-section"
          margined={aside.left?.withBorder || aside.right?.withBorder}
        >
          <Flex gap={aside.gap ?? 'xl'}>
            {aside.left && renderAside(aside.left.component, aside.left.width)}
            {aside.left?.withBorder && (
              <Divider orientation="vertical" visibleFrom="md" />
            )}
            <Box
              w={{
                base: '100%',
                md: `${widthMain.md}%`,
                lg: `${widthMain.lg}%`,
              }}
            >
              {children}
            </Box>
            {aside.right?.withBorder && (
              <Divider orientation="vertical" visibleFrom="md" />
            )}
            {aside.right &&
              renderAside(aside.right.component, aside.right.width)}
          </Flex>
        </LayoutSection>
      ) : (
        children
      )}

      {footer}
    </>
  );
}
