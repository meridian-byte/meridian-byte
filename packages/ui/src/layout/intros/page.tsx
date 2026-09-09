'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Container, Stack, Text, Title } from '@mantine/core';
import { crumbify } from '@repo/utils';
import { LayoutSection } from '../section';

interface PageHeaderProps {
  props: {
    /** If string, displayed as uppercase breadcrumb; if ReactNode, rendered directly */
    path?: string | React.ReactNode;
    title: string;
    desc?: string;
  };
  options?: {
    /** Controls vertical spacing style */
    spacing?: 'margin' | 'padding';
  };
}

export function LayoutIntroPage({ props, options }: PageHeaderProps) {
  const pathname = usePathname();
  const segments = crumbify(pathname);
  const fallbackLabel = segments[segments.length - 1]?.label ?? '';

  const spacingProps = {
    padded: options?.spacing === 'padding' || undefined,
    margined: options?.spacing === 'margin' || undefined,
  };

  const pathContent =
    typeof props.path === 'string' ? (
      <Text fw="bold" ta="center" c="pri.6" tt="uppercase" fz="sm">
        {props.path || fallbackLabel}
      </Text>
    ) : (
      props.path
    );

  return (
    <LayoutSection id="layout-intro-page" {...spacingProps}>
      <Stack>
        {pathContent}

        <Container size="sm">
          <Stack>
            <Title order={1} ta="center">
              {props.title}
            </Title>

            {props.desc && (
              <Text ta="center" fz="xl">
                {props.desc}
              </Text>
            )}
          </Stack>
        </Container>
      </Stack>
    </LayoutSection>
  );
}
